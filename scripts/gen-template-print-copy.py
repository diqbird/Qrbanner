#!/usr/bin/env python3
"""Emit template-print-copy.ts and print-template-copy.ts from layout sources."""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
LAYOUTS = ROOT / "lib" / "industry-print-layouts.ts"
PRINT = ROOT / "lib" / "print-banner.ts"
TR_JSON = ROOT / "scripts" / "template-print-tr.json"


def parse_layouts() -> dict[str, dict[str, str]]:
    text = LAYOUTS.read_text(encoding="utf-8")
    out: dict[str, dict[str, str]] = {}
    for m in re.finditer(
        r"(?:'([^']+)'|(\w+)):\s*\{[^}]*?headline:\s*'((?:\\'|[^'])*)'[^}]*?"
        r"subtitle:\s*'((?:\\'|[^'])*)'[^}]*?notes:\s*'((?:\\'|[^'])*)'",
        text,
        re.S,
    ):
        tid = m.group(1) or m.group(2)
        headline, subtitle, notes = m.group(3), m.group(4), m.group(5)
        out[tid] = {
            "headline": headline.replace("\\'", "'"),
            "subtitle": subtitle.replace("\\'", "'"),
            "notes": notes.replace("\\'", "'"),
        }
    return out


def parse_print_templates() -> dict[str, dict[str, str]]:
    text = PRINT.read_text(encoding="utf-8")
    out: dict[str, dict[str, str]] = {}
    for m in re.finditer(
        r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*description:\s*'([^']+)'",
        text,
    ):
        pid, name, desc = m.groups()
        out[pid] = {"name": name, "description": desc}
    return out


def emit_tree(data: dict, indent: int = 0) -> str:
    pad = "  " * indent
    lines: list[str] = []
    for key, val in data.items():
        if isinstance(val, dict):
            lines.append(f"{pad}'{key}': {{")
            lines.append(emit_tree(val, indent + 1))
            lines.append(f"{pad}}},")
        else:
            esc = val.replace("\\", "\\\\").replace("'", "\\'")
            lines.append(f"{pad}'{key}': '{esc}',")
    return "\n".join(lines)


def main() -> None:
    layouts_en = parse_layouts()
    formats_en = parse_print_templates()
    tr_data = json.loads(TR_JSON.read_text(encoding="utf-8")) if TR_JSON.exists() else {}
    layouts_tr = tr_data.get("layouts", {})
    formats_tr = tr_data.get("formats", {})

    layouts_tr_out: dict[str, dict[str, str]] = {}
    for tid, en in layouts_en.items():
        tr = layouts_tr.get(tid, {})
        layouts_tr_out[tid] = {
            "headline": tr.get("headline", en["headline"]),
            "subtitle": tr.get("subtitle", en["subtitle"]),
            "notes": tr.get("notes", en["notes"]),
        }

    formats_tr_out: dict[str, dict[str, str]] = {}
    for pid, en in formats_en.items():
        tr = formats_tr.get(pid, {})
        formats_tr_out[pid] = {
            "name": tr.get("name", en["name"]),
            "description": tr.get("description", en["description"]),
        }

    for path, var_en, var_tr, en_data, tr_data_out in [
        (
            ROOT / "lib/i18n/template-print-copy.ts",
            "templatePrintCopyEn",
            "templatePrintCopyTr",
            layouts_en,
            layouts_tr_out,
        ),
        (
            ROOT / "lib/i18n/print-template-copy.ts",
            "printTemplateCopyEn",
            "printTemplateCopyTr",
            formats_en,
            formats_tr_out,
        ),
    ]:
        body = (
            "import type { TranslationTree } from './types';\n\n"
            f"export const {var_en}: TranslationTree = {{\n{emit_tree(en_data, 1)}\n}};\n\n"
            f"export const {var_tr}: TranslationTree = {{\n{emit_tree(tr_data_out, 1)}\n}};\n"
        )
        path.write_text(body, encoding="utf-8")
        print(f"wrote {path.name} ({len(en_data)} entries)")


if __name__ == "__main__":
    main()
