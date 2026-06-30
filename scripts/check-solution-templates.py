import re
from pathlib import Path

text = Path(__file__).resolve().parents[1] / "lib" / "solutions.ts"
text = text.read_text(encoding="utf-8")
missing = []
for m in re.finditer(r"slug: '([^']+)'", text):
    slug = m.group(1)
    if slug == "string":
        continue
    header = re.search(
        rf"slug: '{re.escape(slug)}',[\s\S]*?icon: '[^']+',\n    categoryId:",
        text,
    )
    if not header or "templateId:" not in header.group(0):
        missing.append(slug)
print("total", len([s for s in re.findall(r"slug: '([^']+)'", text) if s != "string"]))
print("missing", missing or "none")
