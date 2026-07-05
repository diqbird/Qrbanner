#!/usr/bin/env python3
"""Scan qrbanner for likely unused exports: components, hooks, lib, API routes."""
import json
import os
import re
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[2]
SCAN_DIRS = ["app", "components", "hooks", "lib", "scripts", "e2e", "types"]
SKIP_DIRS = {"node_modules", ".next", "qa-reports", "test-results", ".git"}
EXTS = {".ts", ".tsx", ".js", ".jsx", ".mjs"}

EXPORT_RE = [
    re.compile(r"export\s+(?:async\s+)?function\s+(\w+)"),
    re.compile(r"export\s+const\s+(\w+)\s*="),
    re.compile(r"export\s+class\s+(\w+)"),
    re.compile(r"export\s+default\s+function\s+(\w+)"),
    re.compile(r"export\s+\{\s*([^}]+)\s*\}"),
    re.compile(r"export\s+type\s+(\w+)"),
    re.compile(r"export\s+interface\s+(\w+)"),
    re.compile(r"export\s+enum\s+(\w+)"),
]

IMPORT_PATTERNS = [
    re.compile(r"from\s+['\"]([^'\"]+)['\"]"),
    re.compile(r"import\s*\(\s*['\"]([^'\"]+)['\"]"),
    re.compile(r"require\s*\(\s*['\"]([^'\"]+)['\"]"),
]

# UI shadcn components are often used only via barrel or same-folder; track file basename too
def collect_files() -> list[Path]:
    files = []
    for base in SCAN_DIRS:
        p = ROOT / base
        if not p.exists():
            continue
        for dirpath, dirnames, filenames in os.walk(p):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for fn in filenames:
                if Path(fn).suffix in EXTS:
                    files.append(Path(dirpath) / fn)
    return files


def resolve_import(imp: str, from_file: Path) -> str | None:
    if imp.startswith("@/"):
        target = ROOT / imp[2:].replace("/", os.sep)
    elif imp.startswith("."):
        target = (from_file.parent / imp).resolve()
        try:
            target = target.relative_to(ROOT)
        except ValueError:
            return None
        target = ROOT / target
    else:
        return None  # node_modules

    candidates = [
        target,
        Path(str(target) + ".ts"),
        Path(str(target) + ".tsx"),
        target / "index.ts",
        target / "index.tsx",
    ]
    for c in candidates:
        if c.is_file():
            return str(c.relative_to(ROOT)).replace("\\", "/")
    return None


def parse_exports(text: str) -> set[str]:
    names: set[str] = set()
    for rx in EXPORT_RE:
        for m in rx.finditer(text):
            chunk = m.group(1)
            if "{" in chunk:
                continue
            if "," in chunk and rx.pattern.startswith("export\\s+\\{"):
                for part in chunk.split(","):
                    part = part.strip()
                    if not part:
                        continue
                    part = re.sub(r"\s+as\s+\w+", "", part).strip()
                    if part:
                        names.add(part)
            else:
                names.add(chunk.strip())
    # export { a, b }
    for m in re.finditer(r"export\s+\{([^}]+)\}", text):
        for part in m.group(1).split(","):
            part = part.strip()
            if not part:
                continue
            part = re.sub(r"\s+as\s+(\w+)", r"\1", part)
            part = part.split(" as ")[0].strip()
            if part and part != "type":
                names.add(part)
    return names


def importers_for(rel: str, corpus: dict[str, str]) -> list[str]:
    rel_path = rel.replace(".tsx", "").replace(".ts", "")
    patterns = [f"@/{rel_path}", rel_path]
    hits = []
    for path, text in corpus.items():
        if path == rel:
            continue
        if any(p in text for p in patterns):
            hits.append(path)
    return sorted(hits)


def main() -> int:
    files = collect_files()
    file_texts: dict[str, str] = {}
    for f in files:
        rel = str(f.relative_to(ROOT)).replace("\\", "/")
        try:
            file_texts[rel] = f.read_text(encoding="utf-8", errors="replace")
        except OSError:
            pass

    # Build import graph: resolved path -> set of importing files
    imported_by: dict[str, set[str]] = {p: set() for p in file_texts}
    all_imports_raw: list[tuple[str, str]] = []

    for rel, text in file_texts.items():
        from_file = ROOT / rel
        for rx in IMPORT_PATTERNS:
            for imp in rx.findall(text):
                all_imports_raw.append((rel, imp))
                resolved = resolve_import(imp, from_file)
                if resolved and resolved in imported_by:
                    imported_by[resolved].add(rel)
                # Also match directory imports to route.ts
                if resolved and resolved.endswith("/route.ts") is False:
                    rt = resolved.replace(".tsx", "").replace(".ts", "") + "/route.ts"
                    if rt in imported_by:
                        imported_by[rt].add(rel)

    # Dynamic string refs (fetch paths, links)
    dynamic_refs = "\n".join(file_texts.values())

    def usage_count(rel: str, export_names: set[str]) -> tuple[int, list[str]]:
        importers = imported_by.get(rel, set())
        basename = Path(rel).stem
        # default export component often imported by folder name
        extra_hits = 0
        reasons = list(sorted(importers))[:5]
        if not importers:
            # search basename / path fragment
            path_fragments = [
                f"@/{rel.replace('.tsx','').replace('.ts','')}",
                rel.replace(".tsx", "").replace(".ts", ""),
                basename,
            ]
            for frag in path_fragments:
                if frag in dynamic_refs and dynamic_refs.count(frag) > 1:
                    extra_hits += 1
                    break
        return len(importers) + extra_hits, reasons

    unused_components = []
    unused_hooks = []
    unused_lib = []

    for rel, text in sorted(file_texts.items()):
        if rel.startswith("components/"):
            exports = parse_exports(text)
            count, reasons = usage_count(rel, exports)
            # page/layout imports or self
            if count == 0 and rel not in ("components/providers.tsx",):
                # providers.tsx imported from layout
                if rel == "components/providers.tsx":
                    if "components/providers" in dynamic_refs or "@/components/providers" in dynamic_refs:
                        continue
                unused_components.append({"file": rel, "exports": sorted(exports)[:8], "importers": reasons})

        if rel.startswith("hooks/"):
            count, reasons = usage_count(rel, set())
            if count == 0:
                hook_name = Path(rel).stem
                if hook_name not in dynamic_refs:
                    unused_hooks.append({"file": rel, "importers": reasons})

        if rel.startswith("lib/") and not rel.endswith(".d.ts"):
            count, reasons = usage_count(rel, set())
            exports = parse_exports(text)
            if count == 0 and exports:
                # lib files re-exported?
                lib_path = rel.replace(".ts", "").replace(".tsx", "")
                if f"@/{lib_path}" in dynamic_refs or lib_path in dynamic_refs:
                    continue
                unused_lib.append({"file": rel, "exports": sorted(exports)[:10], "importers": reasons})

    # API routes
    api_root = ROOT / "app" / "api"
    api_routes = []
    for dirpath, _, filenames in os.walk(api_root):
        if "route.ts" not in filenames:
            continue
        fp = Path(dirpath) / "route.ts"
        rel = str(fp.relative_to(ROOT)).replace("\\", "/")
        # build path
        api_path = "/api/" + rel.replace("app/api/", "").replace("/route.ts", "")
        api_path = re.sub(r"\[(\w+)\]", r"{\1}", api_path)
        # search references
        fragments = [
            api_path.replace("{", "").replace("}", ""),
            api_path.split("/")[2] if len(api_path.split("/")) > 2 else "",
        ]
        # normalize dynamic segments for search
        search_path = re.sub(r"/\[[^\]]+\]", "", rel.replace("app/api", "/api").replace("/route.ts", ""))
        hits = 0
        for frag in [api_path, search_path, f'"{search_path}', f"'{search_path}", f"/api/{Path(dirpath).name}"]:
            if frag and frag in dynamic_refs:
                hits += dynamic_refs.count(frag)
        # openapi might list all
        if hits <= 1:  # only self in route file
            api_routes.append({"file": rel, "path": api_path, "refHits": hits})

    # npm packages - simple grep
    pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    all_deps = set(pkg.get("dependencies", {})) | set(pkg.get("devDependencies", {}))
    corpus = dynamic_refs
    unused_deps = []
    for dep in sorted(all_deps):
        if dep.startswith("@types/"):
            continue
        # scoped package root
        patterns = [f'from "{dep}', f"from '{dep}", f'require("{dep}', f"require('{dep}"]
        if not any(p in corpus for p in patterns):
            # @radix-ui often imported as subpath
            if dep.startswith("@radix-ui/"):
                sub = dep.split("/")[-1]
                if f"react-{sub.replace('react-', '')}" in corpus or dep in corpus:
                    continue
            unused_deps.append(dep)

    # Verified lib with zero importers
    zero_import_lib = []
    for rel in sorted(file_texts):
        if not rel.startswith("lib/") or rel.endswith(".d.ts"):
            continue
        imp = importers_for(rel, file_texts)
        if not imp:
            zero_import_lib.append(
                {"file": rel, "exports": sorted(parse_exports(file_texts[rel]))[:12]}
            )

    # Package usage via import/require (more accurate)
    pkg = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    deps = sorted(set(pkg.get("dependencies", {})))
    dep_usage: dict[str, bool] = {}
    for dep in deps:
        needles = [f'"{dep}/', f"'{dep}/", f'"{dep}"', f"'{dep}'", f'require("{dep}")']
        dep_usage[dep] = any(n in dynamic_refs for n in needles)

    out = {
        "unused_components_likely": unused_components[:80],
        "unused_hooks_likely": unused_hooks,
        "unused_lib_likely": unused_lib[:60],
        "zero_import_lib": zero_import_lib,
        "api_routes_low_refs": api_routes[:40],
        "unused_deps_grep": unused_deps,
        "dep_usage": {k: v for k, v in dep_usage.items() if not v},
        "counts": {
            "components_checked": sum(1 for f in file_texts if f.startswith("components/")),
            "unused_components": len(unused_components),
            "unused_hooks": len(unused_hooks),
            "unused_lib": len(unused_lib),
            "zero_import_lib": len(zero_import_lib),
            "api_low_refs": len(api_routes),
            "unused_deps": len(unused_deps),
            "deps_unused_import": sum(1 for v in dep_usage.values() if not v),
        },
    }

    out_path = ROOT / "qa-reports" / "dead-code-scan.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")

    print(json.dumps(out["counts"], indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
