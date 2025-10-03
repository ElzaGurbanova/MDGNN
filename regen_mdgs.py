#!/usr/bin/env python3
import os, sys, argparse, subprocess, shlex, difflib
from pathlib import Path

# ---------- tuning knobs ----------
EXCLUDE_DIRS = {"node_modules", "dist", "build", "coverage", "cypress", ".git", ".next",
                ".cache", ".output", "out", "target", "tmp", "test", "tests", "__tests__", "example", "examples", "docs"}
JS_NAME_PRIORITIES = [
    "server.js","app.js","index.js","cli.js","bin.js","main.js",
    "start.js","run.js","serve.js"
]
EXCLUDE_FILE_PATTERNS = (".test.js",".spec.js",".min.js",".e2e.js",".bench.js",".perf.js")
MAX_JS_PER_PROJECT = 12       # hard cap to avoid exploding runs
MAX_DEPTH = 5                 # how deep to search for .js in a source project
FUZZY_THRESHOLD = 0.6         # if exact name not found, fuzzy must be >= 0.6

def list_dirs(root: Path, max_depth=6):
    out = []
    for p in root.rglob("*"):
        if not p.is_dir(): continue
        rel = p.relative_to(root)
        if len(rel.parts) > max_depth: continue
        if any(x in EXCLUDE_DIRS for x in rel.parts): continue
        out.append(p)
    return out

def find_source_dir_from_name(src_root: Path, target_name: str) -> Path | None:
    # exact match by last segment
    candidates = []
    for p in src_root.rglob(target_name):
        if p.is_dir():
            candidates.append(p)
    if candidates:
        # prefer shallower paths (likely project root)
        candidates.sort(key=lambda p: len(p.relative_to(src_root).parts))
        return candidates[0]

    # fuzzy by folder name
    all_dirs = list_dirs(src_root, max_depth=6)
    names = [d.name for d in all_dirs]
    best = difflib.get_close_matches(target_name, names, n=1, cutoff=FUZZY_THRESHOLD)
    if best:
        idx = names.index(best[0])
        return all_dirs[idx]
    return None

def gather_js_files(proj_root: Path, max_depth=MAX_DEPTH):
    js_files = []
    for p in proj_root.rglob("*.js"):
        rel = p.relative_to(proj_root)
        if len(rel.parts) > max_depth: 
            continue
        if any(part in EXCLUDE_DIRS for part in rel.parts):
            continue
        name = p.name.lower()
        if name.endswith(EXCLUDE_FILE_PATTERNS):
            continue
        js_files.append(p)

    if not js_files:
        return []

    # prefer likely entrypoints first
    def rank(p: Path):
        name = p.name.lower()
        # lower score = higher priority
        try:
            pri = JS_NAME_PRIORITIES.index(name)
        except ValueError:
            pri = len(JS_NAME_PRIORITIES) + 10
        # prefer top-level (shallow)
        depth = len(p.relative_to(proj_root).parts)
        return (pri, depth, len(str(p)))
    js_files.sort(key=rank)
    return js_files[:MAX_JS_PER_PROJECT]

def run_graphjs(graphjs_cli_dir: Path, js_file: Path, out_dir: Path, dry=False):
    out_dir.mkdir(parents=True, exist_ok=True)
    cmd = ["npm","start","--","-f",str(js_file),"--csv","-o",str(out_dir)]
    if dry:
        print("(dry) cwd=", graphjs_cli_dir, "\n     ", " ".join(shlex.quote(c) for c in cmd))
        return 0
    print("→", js_file, "=>", out_dir)
    proc = subprocess.run(cmd, cwd=graphjs_cli_dir, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if proc.returncode != 0:
        print("[graphjs error]", proc.stdout[:5000])
    return proc.returncode

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bad_list", required=True, help="File with one graph_dir per line (to regenerate)")
    ap.add_argument("--source_root", required=True, help="Root of original JS sources (e.g., JS_totals_only_js)")
    ap.add_argument("--graphjs_cli_dir", required=True, help="Path to Graph.js CLI repo (where npm start works)")
    ap.add_argument("--dry_run", action="store_true", help="Print actions only")
    ap.add_argument("--limit_per_project", type=int, default=MAX_JS_PER_PROJECT)
    args = ap.parse_args()

    src_root = Path(args.source_root).resolve()
    graphjs_cli = Path(args.graphjs_cli_dir).resolve()

    # sanity checks
    if not src_root.exists():
        print("source_root not found:", src_root); sys.exit(1)
    if not (graphjs_cli / "package.json").exists():
        print("graphjs_cli_dir doesn't look like an npm project:", graphjs_cli); sys.exit(1)

    # load bad graph_dir paths
    bad_dirs = []
    with open(args.bad_list, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line: continue
            bad_dirs.append(Path(line).resolve())

    report = {"ok":[], "no_source_match":[], "no_js":[], "errors":[]}

    for gdir in bad_dirs:
        name = gdir.name  # group ID
        src_dir = find_source_dir_from_name(src_root, name)
        if not src_dir:
            report["no_source_match"].append(str(gdir))
            print(f"[skip] no source match for {gdir} (looked for folder named '{name}')")
            continue

        js_files = gather_js_files(src_dir, max_depth=MAX_DEPTH)
        if not js_files:
            report["no_js"].append(str(gdir))
            print(f"[skip] no .js under {src_dir}")
            continue

        # cap per-project files if requested
        if args.limit_per_project and len(js_files) > args.limit_per_project:
            js_files = js_files[:args.limit_per_project]

        errs = 0
        for jf in js_files:
            rc = run_graphjs(graphjs_cli, jf, gdir, dry=args.dry_run)
            if rc != 0: errs += 1

        # quick existence check after run
        nodes = gdir / "nodes.csv"
        rels  = gdir / "rels.csv"
        if nodes.exists() and rels.exists():
            report["ok"].append(str(gdir))
        else:
            report["errors"].append(str(gdir))
            print(f"[warn] after run, missing nodes.csv or rels.csv in {gdir}")

    # write a small report
    import json
    (Path.cwd()/"regen_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("Done. Summary:", {k: len(v) for k,v in report.items()})
    print("See regen_report.json for details.")

if __name__ == "__main__":
    main()

