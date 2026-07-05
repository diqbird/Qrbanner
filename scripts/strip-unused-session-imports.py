#!/usr/bin/env python3
"""Strip unused getServerSession/authOptions imports from API routes."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = ROOT / "app" / "api"

IMPORT_SESSION = re.compile(r"import \{ getServerSession \} from 'next-auth';\r?\n")
IMPORT_AUTH = re.compile(r"import \{ authOptions \} from '@/lib/auth-options';\r?\n")


def uses_auth_options(text: str) -> bool:
    body = re.sub(r"^import .+$", "", text, flags=re.MULTILINE)
    return "authOptions" in body


def main() -> int:
    n = 0
    for fp in sorted(API.rglob("route.ts")):
        text = fp.read_text(encoding="utf-8")
        orig = text
        if "getServerSession(" not in text:
            text = IMPORT_SESSION.sub("", text)
        if not uses_auth_options(text):
            text = IMPORT_AUTH.sub("", text)
        if text != orig:
            fp.write_text(text, encoding="utf-8")
            print("stripped", fp.relative_to(ROOT))
            n += 1
    print("total:", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
