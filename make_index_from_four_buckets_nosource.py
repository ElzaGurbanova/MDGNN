#!/usr/bin/env python3
import os, csv, json, argparse

# Map top-level bucket -> which task & label it implies
BUCKETS = {
    "ci_secure": {"task": "ci", "label": 0},
    "ci_vuln":   {"task": "ci", "label": 1},
    "pt_secure": {"task": "pt", "label": 0},
    "pt_vuln":   {"task": "pt", "label": 1},
}

def read_graph_stats(dirpath: str):
    p = os.path.join(dirpath, "graph_stats.json")
    if not os.path.exists(p): return "", ""
    try:
        with open(p, "r", encoding="utf-8") as f:
            js = json.load(f)
        return js.get("nodes",""), js.get("edges","")
    except Exception:
        return "", ""

def sample_dirs(root: str):
    """
    Yield (bucket, sample_dir) where sample_dir contains nodes.csv & rels.csv.
    Allows one extra nesting level.
    """
    for bucket in BUCKETS:
        bdir = os.path.join(root, bucket)
        if not os.path.isdir(bdir): 
            continue
        for entry in sorted(os.listdir(bdir)):
            sdir = os.path.join(bdir, entry)
            if not os.path.isdir(sdir): 
                continue

            # Case 1: files directly in sdir
            if os.path.exists(os.path.join(sdir,"nodes.csv")) and os.path.exists(os.path.join(sdir,"rels.csv")):
                yield bucket, sdir
                continue

            # Case 2: one-level nested
            for sub in os.listdir(sdir):
                subdir = os.path.join(sdir, sub)
                if not os.path.isdir(subdir): 
                    continue
                if os.path.exists(os.path.join(subdir,"nodes.csv")) and os.path.exists(os.path.join(subdir,"rels.csv")):
                    yield bucket, subdir

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True, help="Path to Graph_files (contains ci_secure, ci_vuln, pt_secure, pt_vuln)")
    ap.add_argument("--out", default="index.csv", help="Output CSV path")
    ap.add_argument("--require_stats", action="store_true", help="Skip samples missing graph_stats.json")
    args = ap.parse_args()

    rows = []
    root = os.path.abspath(args.root)

    for bucket, gdir in sample_dirs(root):
        task = BUCKETS[bucket]["task"]
        label = BUCKETS[bucket]["label"]

        # group = sample folder name (keeps project variants together)
        group = os.path.basename(gdir.rstrip(os.sep))

        # labels: fill only the matching task; leave the other empty
        y_path = str(label) if task == "pt" else ""
        y_cmd  = str(label) if task == "ci" else ""

        # optional stats
        nodes_ct, edges_ct = read_graph_stats(gdir)
        if args.require_stats and (nodes_ct == "" or edges_ct == ""):
            continue

        rows.append({
            "graph_dir": gdir,
            "y_path": y_path,
            "y_cmd":  y_cmd,
            "group":  group,
            "nodes":  nodes_ct,
            "edges":  edges_ct,
        })

    # Sort for reproducibility
    rows.sort(key=lambda r: (r["y_cmd"] or r["y_path"], r["group"]))

    os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".", exist_ok=True)
    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["graph_dir","y_path","y_cmd","group","nodes","edges"])
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print(f"Wrote {len(rows)} rows to {args.out}")
    # Quick counts
    ci_pos = sum(1 for r in rows if r["y_cmd"] == "1")
    ci_neg = sum(1 for r in rows if r["y_cmd"] == "0")
    pt_pos = sum(1 for r in rows if r["y_path"] == "1")
    pt_neg = sum(1 for r in rows if r["y_path"] == "0")
    print(f"CI: {ci_pos} vuln, {ci_neg} secure | PT: {pt_pos} vuln, {pt_neg} secure")

if __name__ == "__main__":
    main()

