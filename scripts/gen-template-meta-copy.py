#!/usr/bin/env python3
"""Extract template taglines/useCases/tips and emit template-meta-copy.ts."""
import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
sources = [
    ROOT / "lib" / "industry-templates.ts",
    ROOT / "lib" / "industry-archetype-templates.ts",
]
tr_data = json.loads((ROOT / "scripts" / "template-meta-tr.json").read_text(encoding="utf-8"))

text = "\n".join(p.read_text(encoding="utf-8") for p in sources)
blocks = re.split(r"\n  \{", text)
templates: list[dict] = []

for block in blocks:
    m_id = re.search(r"id: '([^']+)'", block)
    if not m_id:
        continue
    tid = m_id.group(1)
    if tid in ("venue", "menu-link", "service", "personal", "company", "reach", "location"):
        continue
    m_tag = re.search(r"tagline: '([^']*(?:\\'[^']*)*)'", block)
    if not m_tag:
        continue
    tagline = m_tag.group(1).replace("\\'", "'")
    uc = re.search(r"useCases: \[(.*?)\]", block, re.S)
    use_cases = []
    if uc:
        use_cases = re.findall(r"'([^']*(?:\\'[^']*)*)'", uc.group(1))
        use_cases = [u.replace("\\'", "'") for u in use_cases]
    tips_m = re.search(r"tips: \[(.*?)\],\n", block, re.S)
    if not tips_m:
        tips_m = re.search(r"tips: \[(.*?)\]\n", block, re.S)
    tips = []
    if tips_m:
        tips = re.findall(r"'([^']*(?:\\'[^']*)*)'", tips_m.group(1))
        tips = [t.replace("\\'", "'") for t in tips]
    templates.append({"id": tid, "tagline": tagline, "useCases": use_cases, "tips": tips})


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def emit_tree(lang: str) -> str:
    lines = ["{"]
    for t in templates:
        tid = t["id"]
        lines.append(f"    '{tid}': {{")
        if lang == "en":
            tag = t["tagline"]
            ucs = t["useCases"]
            tips = t["tips"]
        else:
            tr = tr_data[tid]
            tag = tr["tagline"]
            ucs = tr["useCases"]
            tips = tr["tips"]
        lines.append(f"      tagline: '{esc(tag)}',")
        lines.append("      useCases: {")
        for i, u in enumerate(ucs):
            lines.append(f"        '{i}': '{esc(u)}',")
        lines.append("      },")
        lines.append("      tips: {")
        for i, tip in enumerate(tips):
            lines.append(f"        '{i}': '{esc(tip)}',")
        lines.append("      },")
        lines.append("    },")
    lines.append("  }")
    return "\n".join(lines)


out = f"""import type {{ TranslationTree }} from './types';

/** Per-template tagline, use cases and pro tips — keyed by template id */
export const templateMetaEn: TranslationTree = {emit_tree('en')};

export const templateMetaTr: TranslationTree = {emit_tree('tr')};
"""

out_path = ROOT / "lib" / "i18n" / "template-meta-copy.ts"
out_path.write_text(out, encoding="utf-8")
print(f"wrote {out_path} ({len(templates)} templates)")
