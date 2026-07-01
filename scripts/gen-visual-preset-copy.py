#!/usr/bin/env python3
"""Generate lib/i18n/visual-preset-copy.ts from visual-qr-presets.ts + TR JSON."""
import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
src = (ROOT / "lib" / "visual-qr-presets.ts").read_text(encoding="utf-8")
tr_data = json.loads((ROOT / "scripts" / "visual-preset-tr.json").read_text(encoding="utf-8"))

blocks = re.split(r"\n  \{", src)
presets = []
for block in blocks:
    m_id = re.search(r"id: '([^']+)'", block)
    m_name = re.search(r"name: '([^']*(?:\\'[^']*)*)'", block)
    m_desc = re.search(r"description: '([^']*(?:\\'[^']*)*)'", block)
    if not m_id or not m_name or not m_desc:
        continue
    pid = m_id.group(1)
    if pid in ("business", "hospitality", "retail", "social", "event", "health", "minimal", "luxury"):
        continue
    presets.append({
        "id": pid,
        "name": m_name.group(1).replace("\\'", "'"),
        "description": m_desc.group(1).replace("\\'", "'"),
    })


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def emit_presets(lang: str) -> str:
    lines = ["{"]
    for p in presets:
        if lang == "en":
            name, desc = p["name"], p["description"]
        else:
            tr = tr_data["presets"][p["id"]]
            name, desc = tr["name"], tr["description"]
        lines.append(f"    '{p['id']}': {{")
        lines.append(f"      name: '{esc(name)}',")
        lines.append(f"      description: '{esc(desc)}',")
        lines.append("    },")
    lines.append("  }")
    return "\n".join(lines)


def emit_styles(lang: str) -> str:
    styles = tr_data["designStylesEn"] if lang == "en" else tr_data["designStylesTr"]
    lines = ["{"]
    for k, v in styles.items():
        lines.append(f"    {k}: '{esc(v)}',")
    lines.append("  }")
    return "\n".join(lines)

out = f"""import type {{ TranslationTree }} from './types';

export const visualPresetCopyEn: TranslationTree = {{
  presets: {emit_presets('en')},
  designStyles: {emit_styles('en')},
}};

export const visualPresetCopyTr: TranslationTree = {{
  presets: {emit_presets('tr')},
  designStyles: {emit_styles('tr')},
}};
"""

(ROOT / "lib" / "i18n" / "visual-preset-copy.ts").write_text(out, encoding="utf-8")
print(f"wrote visual-preset-copy.ts ({len(presets)} presets)")
