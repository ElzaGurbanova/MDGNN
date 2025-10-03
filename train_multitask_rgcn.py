#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multi-task R-GCN on MDG graphs (Path Traversal, Command Injection)

- Ingests nodes.csv / rels.csv per sample folder
- Builds compact node features + edge types
- Trains R-GCN (3x64) with attention pooling and two heads
- 5x grouped CV with per-task metrics and calibrated thresholds

Requires: torch, torch_geometric, pandas, numpy, scikit-learn, networkx, tqdm, pyyaml
"""

import os, re, json, math, random, argparse, hashlib, glob
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional

import numpy as np
import pandas as pd
import networkx as nx
from tqdm import tqdm
import csv, io


import torch
torch.set_num_threads(8)
from torch import nn
from torch_geometric.data import Data, Dataset
from torch_geometric.loader import DataLoader
from torch_geometric.nn import RGCNConv, GlobalAttention
from sklearn.metrics import average_precision_score, precision_recall_curve, f1_score

import warnings
warnings.filterwarnings("ignore", category=FutureWarning, module="torch")
warnings.filterwarnings("ignore", category=UserWarning, module="torch_geometric.deprecation")


# ------------------------------
# Utility: seeding & device
# ------------------------------
def seed_all(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)

def get_device():
    # Always CPU for mac stability
    dev = torch.device("cpu")
    print(f"[device] using {dev}")
    return dev

# ------------------------------
# Index builder (optional helper)
# ------------------------------
def auto_build_index(root: str, out_csv: str):
    """
    Walks root for */nodes.csv */rels.csv pairs and tries to guess labels from path names.
    You can edit the resulting CSV by hand to fix any guesses.
    """
    records = []
    for nodes_path in glob.glob(os.path.join(root, "**", "nodes.csv"), recursive=True):
        d = os.path.dirname(nodes_path)
        rels_path = os.path.join(d, "rels.csv")
        if not os.path.exists(rels_path): 
            continue
        # Guess labels from directory names
        path_lower = d.lower()
        y_path = ""  # unknown by default
        y_cmd  = ""
        if "path" in path_lower or "travers" in path_lower:
            y_path = 1 if ("vuln" in path_lower or "vulnerable" in path_lower) else (0 if "secure" in path_lower or "non" in path_lower else "")
        if "cmd" in path_lower or "command" in path_lower or "shell" in path_lower:
            y_cmd = 1 if ("vuln" in path_lower or "vulnerable" in path_lower) else (0 if "secure" in path_lower or "non" in path_lower else "")
        # Group id = top-level dir under root
        rel = os.path.relpath(d, root)
        group = rel.split(os.sep)[0]
        source = ("Secbench" if "secbench" in path_lower else
                  "VulCan"  if "vulcan"  in path_lower else
                  "Snyk"    if "snyk"    in path_lower else
                  "GitHub"  if "github"  in path_lower else
                  "Synthetic" if "synthetic" in path_lower else "Unknown")
        records.append({"graph_dir": d, "y_path": y_path, "y_cmd": y_cmd, "group": group, "source": source})
    df = pd.DataFrame(records)
    df.to_csv(out_csv, index=False)
    print(f"Wrote draft index with {len(df)} rows to {out_csv}. Review and edit labels as needed.")

# ------------------------------
# CSV readers (robust to separators)
# ------------------------------
# def read_csv_robust(path: str) -> pd.DataFrame:
#     # Your files often use '¿' as a separator; fallback to auto-sniff
#     with open(path, 'rb') as fh:
#         head = fh.read(4096)
#     text = head.decode('utf-8', errors='ignore')
#     sep = "¿" if "¿" in text else None
#     return pd.read_csv(path, sep=sep, engine="python")

# Try multiple separators, clean bytes, fix malformed rows (extra/fewer fields)
SEPS = ["¿", ",", "\t", ";", "|"]

def _read_bytes_clean(path: str) -> bytes:
    b = open(path, "rb").read()
    # strip BOM & NULLs, normalize newlines
    b = b.replace(b"\x00", b"").lstrip(b"\xef\xbb\xbf").replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    return b

def _sniff_sep(first_line: str) -> Optional[str]:
    for s in SEPS:
        if s in first_line:
            return s
    try:
        dialect = csv.Sniffer().sniff(first_line[:1024])
        return dialect.delimiter
    except Exception:
        return None

def _repair_rows(text: str, sep: str):
    """
    Return (headers, rows) with row lengths == header length.
    If a row has too many fields, merge extras into the last field.
    If a row has too few, pad with ''.
    """
    f = io.StringIO(text)
    reader = csv.reader(f, delimiter=sep, quotechar='"', escapechar='\\')
    rows = list(reader)
    if not rows or not rows[0]:
        return None, None
    headers = rows[0]
    exp = len(headers)
    fixed = []
    for r in rows[1:]:
        if len(r) == exp:
            fixed.append(r)
        elif len(r) > exp:
            # merge tail back into last column
            head = r[:exp-1]
            tail = r[exp-1:]
            head.append(sep.join(tail))
            fixed.append(head)
        else:  # len(r) < exp
            fixed.append(r + [""]*(exp - len(r)))
    return headers, fixed

def read_csv_robust(path: str) -> pd.DataFrame:
    b = _read_bytes_clean(path)
    if not b.strip():
        # return an empty-but-valid dataframe
        return pd.DataFrame()
    text = b.decode("utf-8", errors="replace")
    first_line = text.split("\n", 1)[0]
    sep = _sniff_sep(first_line) or ","

    # Try pandas first, tolerating bad lines
    try:
        df = pd.read_csv(io.StringIO(text),
                         sep=sep,
                         engine="python",
                         on_bad_lines="skip",
                         quoting=csv.QUOTE_MINIMAL,
                         escapechar="\\",
                         keep_default_na=False,
                         low_memory=False)
        if df.shape[1] >= 2:
            return df
    except Exception:
        pass

    # Fallback: manual repair to enforce a constant column count
    headers, rows = _repair_rows(text, sep)
    if headers is None:
        # give up: return empty df, caller will handle
        return pd.DataFrame()
    return pd.DataFrame(rows, columns=headers)



def normalize_col(df: pd.DataFrame, targets: List[str]) -> Dict[str, str]:
    """
    Map flexible column names to the targets requested.
    """
    lmap = {c.lower(): c for c in df.columns}
    out = {}
    for t in targets:
        # try exact, else partial
        if t.lower() in lmap:
            out[t] = lmap[t.lower()]
        else:
            # partial match
            cand = [c for c in df.columns if t.lower().replace(":","").replace("_","") in c.lower().replace(":","").replace("_","")]
            if not cand:
                raise KeyError(f"Column like '{t}' not found in {list(df.columns)[:10]} ...")
            out[t] = cand[0]
    return out

# put near other helpers
def compute_caps_for_folds(df_list, cache_dir):
    import numpy as np, os
    from torch_geometric.loader import DataLoader
    max_types = max_subs = 1
    max_rels  = 1
    for df in df_list:
        ds = MDGDataset(df, cache_dir=os.path.join(cache_dir, "_caps"))
        for i in range(len(ds)):
            d = ds.get(i)
            if d.x_type.numel() > 0:
                max_types = max(max_types, int(d.x_type.max().item()) + 1)
            if d.x_sub.numel() > 0:
                max_subs  = max(max_subs,  int(d.x_sub.max().item()) + 1)
            max_rels  = max(max_rels,  int(d.num_rels))
    return max_types, max_subs, max_rels



# ------------------------------
# Feature engineering
# ------------------------------
HOT_TOKENS = ["fs","path","child_process","exec","execfile","spawn","resolve","normalize","join",".."]

def hash_bow(name: str, D=64):
    v = np.zeros(D, dtype=np.float32)
    s = (str(name) or "").lower()
    for tok in re.split(r"[^a-z0-9]+", s):
        if tok: v[hash(tok) % D] += 1.0
    return v

def token_flags(name: str):
    s = (str(name) or "").lower()
    return np.array([1.0 if t in s else 0.0 for t in HOT_TOKENS], dtype=np.float32)

def graph_level_feats(identifiers: List[str]) -> np.ndarray:
    tokens = " ".join((s or "").lower() for s in identifiers)
    def cnt(sub): return tokens.count(sub)
    feats = [
        cnt("child_process"), cnt("exec"), cnt("execfile"), cnt("spawn"),
        cnt("fs"), cnt("path"), cnt("resolve"), cnt("normalize"), cnt("join"), cnt(".."),
    ]
    # ratios (avoid div by zero with +1)
    fs_cnt, path_cnt = cnt("fs"), cnt("path")
    hard = cnt("resolve") + cnt("normalize")
    feats.extend([ hard/(fs_cnt+1), (fs_cnt+path_cnt)/(len(identifiers)+1) ])
    return np.array(feats, dtype=np.float32)  # dim = 12

@dataclass
class GraphTensors:
    data: Data
    num_relations: int

def build_data_from_csv(nodes_csv: str, rels_csv: str) -> GraphTensors:
    nodes = read_csv_robust(nodes_csv)
    rels  = read_csv_robust(rels_csv)

    # Basic guards
    if nodes is None or nodes.empty:
        raise ValueError(f"nodes.csv is empty/unreadable: {nodes_csv}")
    if rels is None or rels.empty:
        raise ValueError(f"rels.csv is empty/unreadable: {rels_csv}")
    
    # Column mapping
    nmap = normalize_col(nodes, ["Id:ID","Type","SubType","IdentifierName"])
    emap = normalize_col(rels,  ["FromId:START_ID","ToId:END_ID","RelationLabel:TYPE","RelationType"])

    # Node ID reindexing
    node_ids_orig = nodes[nmap["Id:ID"]].values
    id2idx = {int(i): j for j,i in enumerate(node_ids_orig)}
    N = len(node_ids_orig)

    # Node categorical features
    types = nodes[nmap["Type"]].fillna("NA").astype(str).values
    subts = nodes[nmap["SubType"]].fillna("NA").astype(str).values
    uniq_types = {t:i for i,t in enumerate(sorted(set(types)))}
    uniq_subts = {t:i+1 for i,t in enumerate(sorted(set(subts)))}  # 0 = none
    x_type = np.array([uniq_types[t] for t in types], dtype=np.int64)
    x_sub  = np.array([uniq_subts.get(s,0) for s in subts], dtype=np.int64)

    idents = nodes[nmap["IdentifierName"]].fillna("").astype(str).tolist()
    x_bow = np.stack([hash_bow(s,64) for s in idents], axis=0)
    x_hot = np.stack([token_flags(s) for s in idents], axis=0)

    # Edges
    e_from = rels[emap["FromId:START_ID"]].astype(int).map(id2idx).values
    e_to   = rels[emap["ToId:END_ID"]].astype(int).map(id2idx).values
    edge_index = np.stack([e_from, e_to], axis=0).astype(np.int64)

    # Edge types (RelationLabel + RelationType)
    rel_label = rels[emap["RelationLabel:TYPE"]].fillna("").astype(str).values
    rel_type  = rels[emap["RelationType"]].fillna("").astype(str).values
    et_keys = [f"{a}|{b}" for a,b in zip(rel_label, rel_type)]
    uniq_et = {t:i for i,t in enumerate(sorted(set(et_keys)))}
    edge_type = np.array([uniq_et[t] for t in et_keys], dtype=np.int64)
    R = len(uniq_et)

    # Degrees/topology
    indeg = np.bincount(edge_index[1], minlength=N)
    outdeg= np.bincount(edge_index[0], minlength=N)
    x_topo = np.stack([np.log1p(indeg), np.log1p(outdeg), np.ones(N)], axis=0).T.astype(np.float32)

    # Graph-level feats
    g_feats = graph_level_feats(idents)  # dim=12

    # Pack to torch
    data = Data()
    data.x_type = torch.from_numpy(x_type)
    data.x_sub  = torch.from_numpy(x_sub)
    data.x_bow  = torch.from_numpy(x_bow)
    data.x_hot  = torch.from_numpy(x_hot)
    data.x_topo = torch.from_numpy(x_topo)
    data.edge_index = torch.from_numpy(edge_index)
    data.edge_type  = torch.from_numpy(edge_type)
    data.g_feats = torch.from_numpy(g_feats).unsqueeze(0)  # [1, 12]
    data.num_nodes = N
    data.num_rels = R
    return GraphTensors(data=data, num_relations=R)

# ------------------------------
# PyG Dataset that caches tensors
# ------------------------------
class MDGDataset(Dataset):
    def __init__(self, index_df: pd.DataFrame, cache_dir: str = None):
        super().__init__()
        self.df = index_df.reset_index(drop=True)
        self.cache_dir = cache_dir
        if cache_dir:
            os.makedirs(cache_dir, exist_ok=True)

    def len(self):
        return len(self.df)

    def get(self, idx):
        row = self.df.iloc[idx]
        d = row["graph_dir"]
        nodes_csv = os.path.join(d, "nodes.csv")
        rels_csv  = os.path.join(d, "rels.csv")
        cache_path = os.path.join(self.cache_dir, hashlib.md5(d.encode()).hexdigest()+".pt") if self.cache_dir else None

        # if cache_path and os.path.exists(cache_path):
        #     # obj = torch.load(cache_path, map_location="cpu")
        #     try:
        #         obj = torch.load(cache_path, map_location="cpu", weights_only=True)
        #     except TypeError:
        #         obj = torch.load(cache_path, map_location="cpu")
        #     data = obj["data"]
        #     R = obj["num_relations"]
        if cache_path and os.path.exists(cache_path):
            try:
                obj = torch.load(cache_path, map_location="cpu", weights_only=True)
            except Exception:
                # Cache contains a PyG Data object (not weights-only) – load trusted local file
                obj = torch.load(cache_path, map_location="cpu")
            data = obj["data"]
            R = obj["num_relations"]
        else:
            gt = build_data_from_csv(nodes_csv, rels_csv)
            data, R = gt.data, gt.num_relations
            if cache_path:
                torch.save({"data": data, "num_relations": R}, cache_path)

        # Attach labels and masks
        y_path = row.get("y_path")
        y_cmd  = row.get("y_cmd")
        m_pt = 0.0 if (pd.isna(y_path) or y_path=="") else 1.0
        m_ci = 0.0 if (pd.isna(y_cmd)  or y_cmd=="")  else 1.0
        yp = float(y_path) if m_pt==1.0 else 0.0
        yc = float(y_cmd)  if m_ci==1.0 else 0.0

        data.y_path = torch.tensor([yp], dtype=torch.float32)
        data.y_cmd  = torch.tensor([yc], dtype=torch.float32)
        data.m_pt   = torch.tensor([m_pt], dtype=torch.float32)
        data.m_ci   = torch.tensor([m_ci], dtype=torch.float32)
        data.group  = row["group"]
        data.source = row.get("source","")
        data.num_rels = int(data.num_rels)  # used later
        return data

# ------------------------------
# Grouped multi-label K-fold (greedy balance)
# ------------------------------
def make_grouped_folds(df: pd.DataFrame, n_folds=5, seed=42):
    """
    Greedy assignment of groups to folds to balance positives per task.
    Works with missing labels via masking.
    """
    rng = random.Random(seed)
    groups = sorted(df["group"].unique())
    rng.shuffle(groups)

    # group label counts
    gstat = {}
    for g in groups:
        sub = df[df.group == g]
        p_pt = int((sub["y_path"]==1).sum())
        p_ci = int((sub["y_cmd"]==1).sum())
        gstat[g] = (p_pt, p_ci, len(sub))

    folds = [[] for _ in range(n_folds)]
    load = [(0,0,0) for _ in range(n_folds)]  # (pt_pos, ci_pos, total)

    for g in groups:
        gp = gstat[g]
        # pick fold that minimizes (pt imbalance + ci imbalance + size imbalance)
        best = None
        score = None
        for i in range(n_folds):
            pt_i, ci_i, sz_i = load[i]
            cand = (pt_i+gp[0], ci_i+gp[1], sz_i+gp[2])
            # simple L2 distance to average
            avg_pt = (sum(l[0] for l in load)+gp[0])/(i+1)
            avg_ci = (sum(l[1] for l in load)+gp[1])/(i+1)
            s = (cand[0]-avg_pt)**2 + (cand[1]-avg_ci)**2 + 0.1*(cand[2])  # weight size lightly
            if (score is None) or (s < score):
                score, best = s, i
        folds[best].append(g)
        pt_i, ci_i, sz_i = load[best]
        load[best] = (pt_i+gp[0], ci_i+gp[1], sz_i+gp[2])

    # convert to (train_idx, test_idx)
    split = []
    for i in range(n_folds):
        test_groups = set(folds[i])
        test_idx = df.index[df["group"].isin(test_groups)].tolist()
        train_idx = df.index[~df["group"].isin(test_groups)].tolist()
        split.append((train_idx, test_idx))
    return split

# ------------------------------
# Model: R-GCN + attention, 2 heads
# ------------------------------
class Encoder(nn.Module):
    def __init__(self, num_node_types, num_subtypes, num_relations, bow_dim=64, hot_dim=len(HOT_TOKENS), hid=64, bases=8, dropout=0.3):
        super().__init__()
        self.emb_type = nn.Embedding(num_node_types, 16)
        self.emb_sub  = nn.Embedding(num_subtypes+1, 8)
        in_dim = 16 + 8 + bow_dim + hot_dim + 3  # +3 topo features
        self.r1 = RGCNConv(in_dim, hid, num_relations, num_bases=bases)
        self.r2 = RGCNConv(hid,   hid, num_relations, num_bases=bases)
        self.r3 = RGCNConv(hid,   hid, num_relations, num_bases=bases)
        self.bn = nn.BatchNorm1d(hid)
        self.drop = nn.Dropout(dropout)
        self.pool = GlobalAttention(
            gate_nn=nn.Sequential(nn.Linear(hid, 64), nn.ReLU(), nn.Linear(64,1))
        )
        # Heads take pooled graph emb + aux graph feats (12-dim)
        self.head_pt = nn.Linear(hid + 12, 1)
        self.head_ci = nn.Linear(hid + 12, 1)

    def forward(self, data: Data):
        x = torch.cat([
            self.emb_type(data.x_type),
            self.emb_sub(data.x_sub),
            data.x_bow, data.x_hot, data.x_topo
        ], dim=-1)
        for conv in (self.r1, self.r2, self.r3):
            x = conv(x, data.edge_index, data.edge_type)
            x = self.bn(x)
            x = torch.relu(x)
            x = self.drop(x)
        g = self.pool(x, data.batch)                      # [B, hid]
        g = torch.cat([g, data.g_feats], dim=-1)          # [B, hid+12]
        logit_pt = self.head_pt(g).squeeze(-1)            # [B]
        logit_ci = self.head_ci(g).squeeze(-1)            # [B]
        return logit_pt, logit_ci

# ------------------------------
# Training & Evaluation
# ------------------------------
def masked_bce_loss(logit, target, mask, pos_weight=None):
    # BCEWithLogits with masks; pos_weight balances positives
    if pos_weight is None:
        loss_fn = nn.BCEWithLogitsLoss(reduction="none")
    else:
        loss_fn = nn.BCEWithLogitsLoss(reduction="none", pos_weight=pos_weight)
    loss = loss_fn(logit, target) * mask
    denom = torch.clamp(mask.sum(), min=1.0)
    return loss.sum() / denom

@torch.no_grad()
def eval_epoch(model, loader, device):
    model.eval()
    all_pt, all_ci = [], []
    all_ypt, all_yci = [], []
    all_mpt, all_mci = [], []
    for data in loader:
        data = data.to(device)
        lp, lc = model(data)
        all_pt.extend(torch.sigmoid(lp).detach().cpu().tolist())
        all_ci.extend(torch.sigmoid(lc).detach().cpu().tolist())
        all_ypt.extend(data.y_path.cpu().tolist())
        all_yci.extend(data.y_cmd.cpu().tolist())
        all_mpt.extend(data.m_pt.cpu().tolist())
        all_mci.extend(data.m_ci.cpu().tolist())
    return (np.array(all_pt), np.array(all_ci),
            np.array(all_ypt), np.array(all_yci),
            np.array(all_mpt), np.array(all_mci))

def pr_f1_with_thresholds(y_true, y_prob, mask):
    m = mask.astype(bool)
    if m.sum() == 0:
        return {"ap": float("nan"), "best_f1": float("nan"), "best_thr": 0.5,
                "prec": float("nan"), "rec": float("nan")}
    ap = average_precision_score(y_true[m], y_prob[m])
    prec, rec, thr = precision_recall_curve(y_true[m], y_prob[m])
    f1s = 2*prec*rec/(prec+rec+1e-9)
    i = int(np.nanargmax(f1s))
    return {"ap": float(ap), "best_f1": float(f1s[i]),
            "best_thr": float(thr[max(i-1,0)]) if i < len(thr) else 0.5,
            "prec": float(prec[i]), "rec": float(rec[i])}

def train_fold(df_train, df_val, args, caps):
    device = get_device()
    # Build datasets
    ds_train = MDGDataset(df_train, cache_dir=os.path.join(args.cache_dir, "train"))
    ds_val   = MDGDataset(df_val,   cache_dir=os.path.join(args.cache_dir, "val"))

    # --- NEW: use fold-wide caps for embedding/relations sizes ---
    num_node_types, num_subtypes, num_relations = caps

    model = Encoder(num_node_types=num_node_types,
                    num_subtypes=num_subtypes,
                    num_relations=num_relations,
                    hid=args.hidden, bases=args.bases, dropout=args.dropout).to(device)

    opt = torch.optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.wd)

    # Compute pos_weight for each task on the training set
    ypt = df_train["y_path"].dropna().astype(int).values if "y_path" in df_train else np.array([])
    yci = df_train["y_cmd"].dropna().astype(int).values  if "y_cmd"  in df_train else np.array([])
    def pw(y): 
        if len(y)==0: return None
        p = y.sum(); n = len(y)-p
        return torch.tensor([(n/max(p,1))], dtype=torch.float32, device=device)
    posw_pt, posw_ci = pw(ypt), pw(yci)

    loader_train = DataLoader(ds_train, batch_size=args.batch_size, shuffle=True, num_workers=0)
    loader_val   = DataLoader(ds_val,   batch_size=args.batch_size, shuffle=False, num_workers=0)

    best_val = -1.0
    best_state = None
    patience = getattr(args, "patience", 30)
    no_improve = 0

    for epoch in range(1, args.epochs+1):
        model.train()
        running = 0.0
        for data in loader_train:
            data = data.to(device)
            lp, lc = model(data)
            loss_pt = masked_bce_loss(lp, data.y_path, data.m_pt, posw_pt)
            loss_ci = masked_bce_loss(lc, data.y_cmd,  data.m_ci, posw_ci)
            loss = loss_pt + loss_ci
            opt.zero_grad()
            loss.backward()
            opt.step()
            running += float(loss.item())

        # Validation
        p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_val, device)
        metri_pt = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
        metri_ci = pr_f1_with_thresholds(y_ci, p_ci, m_ci)
        score = np.nanmean([metri_pt["ap"], metri_ci["ap"]])

        print(f"Epoch {epoch:03d} | loss={running/len(loader_train):.4f} | "
              f"PT AP={metri_pt['ap']:.3f} | CI AP={metri_ci['ap']:.3f}")

        if score > best_val:
            best_val = score
            best_state = {k:v.cpu() for k,v in model.state_dict().items()}
            no_improve = 0
        else:
            no_improve += 1
            if no_improve >= patience:
                print("Early stopping.")
                break

    # Final thresholds based on validation
    model.load_state_dict(best_state)
    p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_val, device)
    metri_pt = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
    metri_ci = pr_f1_with_thresholds(y_ci, p_ci, m_ci)

    results = {
        "PT": metri_pt, "CI": metri_ci, "best_score": best_val
    }
    return model.cpu(), results



# def train_fold(df_train, df_val, args):
#     device = get_device()
#     # Build datasets
#     ds_train = MDGDataset(df_train, cache_dir=os.path.join(args.cache_dir, "train"))
#     ds_val   = MDGDataset(df_val,   cache_dir=os.path.join(args.cache_dir, "val"))

#     # Infer vocab sizes & num_relations from a sample (robust: max across dataset)
#     # (All graphs use per-graph vocab; embeddings shared because indices are per-graph cardinalities)
#     # We simply pass maximum counts for embedding tables
#     max_types, max_subs, max_rels = 1, 1, 1
#     for i in range(min(32, len(ds_train))):
#         d = ds_train.get(i)
#         max_types = max(max_types, int(d.x_type.max().item())+1)
#         max_subs  = max(max_subs,  int(d.x_sub.max().item())+1)
#         max_rels  = max(max_rels,  int(d.num_rels))

#     model = Encoder(num_node_types=max_types, num_subtypes=max_subs, num_relations=max_rels,
#                     hid=args.hidden, bases=args.bases, dropout=args.dropout).to(device)

#     opt = torch.optim.Adam(model.parameters(), lr=args.lr, weight_decay=args.wd)

#     # Compute pos_weight for each task on the training set
#     ypt = df_train["y_path"].dropna().astype(int).values if "y_path" in df_train else np.array([])
#     yci = df_train["y_cmd"].dropna().astype(int).values  if "y_cmd"  in df_train else np.array([])
#     def pw(y): 
#         if len(y)==0: return None
#         p = y.sum(); n = len(y)-p
#         return torch.tensor([(n/max(p,1))], dtype=torch.float32, device=device)
#     posw_pt, posw_ci = pw(ypt), pw(yci)

#     loader_train = DataLoader(ds_train, batch_size=args.batch_size, shuffle=True, num_workers=0)
#     loader_val   = DataLoader(ds_val,   batch_size=args.batch_size, shuffle=False, num_workers=0)

#     best_val = -1.0
#     best_state = None
#     patience = getattr(args, "patience", 30)

#     no_improve = 0

#     for epoch in range(1, args.epochs+1):
#         model.train()
#         running = 0.0
#         for data in loader_train:
#             data = data.to(device)
#             lp, lc = model(data)
#             loss_pt = masked_bce_loss(lp, data.y_path, data.m_pt, posw_pt)
#             loss_ci = masked_bce_loss(lc, data.y_cmd,  data.m_ci, posw_ci)
#             loss = loss_pt + loss_ci
#             opt.zero_grad()
#             loss.backward()
#             opt.step()
#             running += float(loss.item())

#         # Validation
#         p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_val, device)
#         metri_pt = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
#         metri_ci = pr_f1_with_thresholds(y_ci, p_ci, m_ci)
#         score = np.nanmean([metri_pt["ap"], metri_ci["ap"]])

#         print(f"Epoch {epoch:03d} | loss={running/len(loader_train):.4f} | "
#               f"PT AP={metri_pt['ap']:.3f} | CI AP={metri_ci['ap']:.3f}")

#         if score > best_val:
#             best_val = score
#             best_state = {k:v.cpu() for k,v in model.state_dict().items()}
#             no_improve = 0
#         else:
#             no_improve += 1
#             if no_improve >= patience:
#                 print("Early stopping.")
#                 break

#     # Final thresholds based on validation
#     model.load_state_dict(best_state)
#     p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_val, device)
#     metri_pt = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
#     metri_ci = pr_f1_with_thresholds(y_ci, p_ci, m_ci)

#     results = {
#         "PT": metri_pt, "CI": metri_ci, "best_score": best_val
#     }
#     return model.cpu(), results

# def cross_validate(index_csv: str, args):
#     df = pd.read_csv(index_csv)
#     # Cast labels to numeric or NaN
#     for c in ("y_path","y_cmd"):
#         if c in df.columns:
#             df[c] = pd.to_numeric(df[c], errors="coerce")

#     # Build folds by group (no leakage)
#     folds = make_grouped_folds(df, n_folds=args.folds, seed=args.seed)

#     all_results = []
#     for k, (tr_idx, te_idx) in enumerate(folds, 1):
#         print("="*80)
#         print(f"Fold {k}/{args.folds}")
#         df_train = df.iloc[tr_idx].reset_index(drop=True)
#         df_test  = df.iloc[te_idx].reset_index(drop=True)

#         # Split train further: small val split (stratified by group is already handled)
#         # We'll reserve 15% for validation from the training groups.
#         val_groups = set(df_train["group"].unique()[:max(1, int(0.15*df_train['group'].nunique()))])
#         df_val = df_train[df_train["group"].isin(val_groups)].reset_index(drop=True)
#         df_tr  = df_train[~df_train["group"].isin(val_groups)].reset_index(drop=True)

#         model, val_res = train_fold(df_tr, df_val, args)
#         # Test
#         ds_test = MDGDataset(df_test, cache_dir=os.path.join(args.cache_dir, f"fold{k}_test"))
#         loader_test = DataLoader(ds_test, batch_size=args.batch_size, shuffle=False, num_workers=0)
#         device = get_device()
#         model = model.to(device).eval()
#         p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_test, device)

#         # Use validation thresholds if available, else 0.5
#         thr_pt = val_res["PT"]["best_thr"] if not math.isnan(val_res["PT"]["best_thr"]) else 0.5
#         thr_ci = val_res["CI"]["best_thr"] if not math.isnan(val_res["CI"]["best_thr"]) else 0.5

#         # Metrics
#         test_PT = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
#         test_CI = pr_f1_with_thresholds(y_ci, p_ci, m_ci)
#         # Also compute F1 at the chosen thresholds
#         def f1_at_thr(y, p, m, thr):
#             m = m.astype(bool)
#             if m.sum()==0: return float("nan")
#             yhat = (p[m] >= thr).astype(int)
#             return float(f1_score(y[m], yhat))
#         f1_pt_thr = f1_at_thr(y_pt, p_pt, m_pt, thr_pt)
#         f1_ci_thr = f1_at_thr(y_ci, p_ci, m_ci, thr_ci)

#         fold_res = {
#             "fold": k,
#             "val": val_res,
#             "test": {
#                 "PT": {**test_PT, "f1_at_thr": f1_pt_thr, "thr": thr_pt},
#                 "CI": {**test_CI, "f1_at_thr": f1_ci_thr, "thr": thr_ci}
#             }
#         }
#         all_results.append(fold_res)
#         # Save fold checkpoint
#         os.makedirs(args.out_dir, exist_ok=True)
#         torch.save({"state_dict": model.cpu().state_dict(), "fold": k, "val": val_res},
#                    os.path.join(args.out_dir, f"rgcn_fold{k}.pt"))
#         with open(os.path.join(args.out_dir, f"results_fold{k}.json"), "w") as f:
#             json.dump(fold_res, f, indent=2)

#     # Aggregate summary
#     def agg(metric):
#         vals_PT = [fr["test"]["PT"][metric] for fr in all_results if not math.isnan(fr["test"]["PT"][metric])]
#         vals_CI = [fr["test"]["CI"][metric] for fr in all_results if not math.isnan(fr["test"]["CI"][metric])]
#         def mean_std(v): 
#             return (float(np.mean(v)) if v else float("nan"),
#                     float(np.std(v, ddof=1)) if len(v)>1 else float("nan"))
#         return {"PT": mean_std(vals_PT), "CI": mean_std(vals_CI)}

#     summary = {
#         "AP_mean±std": agg("ap"),
#         "F1@thr_mean±std": {
#             "PT": agg("f1_at_thr")["PT"],
#             "CI": agg("f1_at_thr")["CI"]
#         }
#     }
#     with open(os.path.join(args.out_dir, "summary.json"), "w") as f:
#         json.dump(summary, f, indent=2)
#     print("Summary:", summary)


def cross_validate(index_csv: str, args):
    df = pd.read_csv(index_csv)
    # Cast labels to numeric or NaN
    for c in ("y_path","y_cmd"):
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")

    # Build folds by group (no leakage)
    folds = make_grouped_folds(df, n_folds=args.folds, seed=args.seed)

    all_results = []
    for k, (tr_idx, te_idx) in enumerate(folds, 1):
        print("="*80)
        print(f"Fold {k}/{args.folds}")
        df_train = df.iloc[tr_idx].reset_index(drop=True)
        df_test  = df.iloc[te_idx].reset_index(drop=True)

        # Small val split from training groups (15%)
        val_groups = set(df_train["group"].unique()[:max(1, int(0.15*df_train['group'].nunique()))])
        df_val = df_train[df_train["group"].isin(val_groups)].reset_index(drop=True)
        df_tr  = df_train[~df_train["group"].isin(val_groups)].reset_index(drop=True)

        # --- NEW: compute embedding/relations caps across train+val+test for this fold ---
        caps = compute_caps_for_folds([df_tr, df_val, df_test], args.cache_dir)
        num_types, num_subs, num_rels = caps
        print(f"[caps] node_types={num_types}  subtypes={num_subs}  relations={num_rels}")

        # Train with fold-wide caps
        model, val_res = train_fold(df_tr, df_val, args, caps=caps)

        # Test
        ds_test = MDGDataset(df_test, cache_dir=os.path.join(args.cache_dir, f"fold{k}_test"))
        loader_test = DataLoader(ds_test, batch_size=args.batch_size, shuffle=False, num_workers=0)
        device = get_device()
        model = model.to(device).eval()
        p_pt, p_ci, y_pt, y_ci, m_pt, m_ci = eval_epoch(model, loader_test, device)

        thr_pt = val_res["PT"]["best_thr"] if not math.isnan(val_res["PT"]["best_thr"]) else 0.5
        thr_ci = val_res["CI"]["best_thr"] if not math.isnan(val_res["CI"]["best_thr"]) else 0.5

        test_PT = pr_f1_with_thresholds(y_pt, p_pt, m_pt)
        test_CI = pr_f1_with_thresholds(y_ci, p_ci, m_ci)
        def f1_at_thr(y, p, m, thr):
            m = m.astype(bool)
            if m.sum()==0: return float("nan")
            yhat = (p[m] >= thr).astype(int)
            return float(f1_score(y[m], yhat))
        f1_pt_thr = f1_at_thr(y_pt, p_pt, m_pt, thr_pt)
        f1_ci_thr = f1_at_thr(y_ci, p_ci, m_ci, thr_ci)

        fold_res = {
            "fold": k,
            "val": val_res,
            "test": {
                "PT": {**test_PT, "f1_at_thr": f1_pt_thr, "thr": thr_pt},
                "CI": {**test_CI, "f1_at_thr": f1_ci_thr, "thr": thr_ci}
            }
        }
        all_results.append(fold_res)

        os.makedirs(args.out_dir, exist_ok=True)
        torch.save({"state_dict": model.cpu().state_dict(), "fold": k, "val": val_res},
                   os.path.join(args.out_dir, f"rgcn_fold{k}.pt"))
        with open(os.path.join(args.out_dir, f"results_fold{k}.json"), "w") as f:
            json.dump(fold_res, f, indent=2)

    def agg(metric):
        vals_PT = [fr["test"]["PT"][metric] for fr in all_results if not math.isnan(fr["test"]["PT"][metric])]
        vals_CI = [fr["test"]["CI"][metric] for fr in all_results if not math.isnan(fr["test"]["CI"][metric])]
        def mean_std(v): 
            return (float(np.mean(v)) if v else float("nan"),
                    float(np.std(v, ddof=1)) if len(v)>1 else float("nan"))
        return {"PT": mean_std(vals_PT), "CI": mean_std(vals_CI)}

    summary = {
        "AP_mean±std": agg("ap"),
        "F1@thr_mean±std": {
            "PT": agg("f1_at_thr")["PT"],
            "CI": agg("f1_at_thr")["CI"]
        }
    }
    with open(os.path.join(args.out_dir, "summary.json"), "w") as f:
        json.dump(summary, f, indent=2)
    print("Summary:", summary)


# ------------------------------
# CLI
# ------------------------------
def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index_csv", type=str, default="index.csv", help="Master index with graph_dir,y_path,y_cmd,group,source")
    ap.add_argument("--cache_dir", type=str, default="cache_mdgs")
    ap.add_argument("--out_dir", type=str, default="runs_rgcn")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--folds", type=int, default=5)
    ap.add_argument("--hidden", type=int, default=64)
    ap.add_argument("--bases", type=int, default=8)
    ap.add_argument("--dropout", type=float, default=0.3)
    ap.add_argument("--epochs", type=int, default=200)
    ap.add_argument("--batch_size", type=int, default=2)
    ap.add_argument("--lr", type=float, default=1e-3)
    ap.add_argument("--wd", type=float, default=5e-4)
    ap.add_argument("--auto_build_index_root", type=str, default="")
    return ap.parse_args()

def main():
    args = parse_args()
    seed_all(args.seed)
    os.makedirs(args.cache_dir, exist_ok=True)
    os.makedirs(args.out_dir, exist_ok=True)

    if args.auto_build_index_root:
        auto_build_index(args.auto_build_index_root, args.index_csv)

    cross_validate(args.index_csv, args)

if __name__ == "__main__":
    main()

