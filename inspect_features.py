#!/usr/bin/env python3
import os, pandas as pd, numpy as np, json
from collections import Counter
from train_multitask_rgcn import MDGDataset, build_data_from_csv, read_csv_robust  # reuse your code

def feature_inventory(index_csv, sample_limit=200):
    df = pd.read_csv(index_csv)
    seen_types, seen_subs, seen_rel = set(), set(), set()
    dims = Counter()
    stats = dict(graphs=0, nodes_total=0, edges_total=0)

    for i, row in df.iterrows():
        gdir = row["graph_dir"]
        ncsv, rcsv = os.path.join(gdir, "nodes.csv"), os.path.join(gdir, "rels.csv")
        if not (os.path.exists(ncsv) and os.path.exists(rcsv)):
            continue
        try:
            gt = build_data_from_csv(ncsv, rcsv)
            d = gt.data
        except Exception:
            continue

        # record dims
        dims["x_type_emb_index_max"] = max(dims["x_type_emb_index_max"], int(d.x_type.max().item())) if "x_type_emb_index_max" in dims else int(d.x_type.max().item())
        dims["x_sub_emb_index_max"]  = max(dims["x_sub_emb_index_max"],  int(d.x_sub.max().item()))  if "x_sub_emb_index_max" in dims  else int(d.x_sub.max().item())
        dims["x_bow_dim"]            = d.x_bow.shape[1]
        dims["x_hot_dim"]            = d.x_hot.shape[1]
        dims["x_topo_dim"]           = d.x_topo.shape[1]
        dims["num_relations"]        = max(dims.get("num_relations", 0), int(d.num_rels))

        # aggregate global stats
        stats["graphs"]      += 1
        stats["nodes_total"] += int(d.num_nodes)
        stats["edges_total"] += int(d.edge_index.shape[1])

        if stats["graphs"] >= sample_limit:
            break

    out = {
        "graphs_sampled": stats["graphs"],
        "avg_nodes": round(stats["nodes_total"]/max(1,stats["graphs"]), 2),
        "avg_edges": round(stats["edges_total"]/max(1,stats["graphs"]), 2),
        "node_features": {
            "type_embedding_vocab_size": int(dims["x_type_emb_index_max"]+1),
            "subtype_embedding_vocab_size": int(dims["x_sub_emb_index_max"]+1),
            "bow_dim": int(dims["x_bow_dim"]),
            "api_hotflags_dim": int(dims["x_hot_dim"]),
            "topology_dim": int(dims["x_topo_dim"])
        },
        "edge_features": {
            "num_relation_types": int(dims["num_relations"]),
            "relation_encoding": "id per edge (embedded in R-GCN / GINE)"
        }
    }
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    feature_inventory("index_clean.csv", sample_limit=200)

