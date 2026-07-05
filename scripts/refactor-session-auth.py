#!/usr/bin/env python3
"""One-time codemod: migrate API routes to lib/session-auth."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = ROOT / "app" / "api"

SKIP = {
    "app/api/marketplace/seller/route.ts",  # uses session.user.name/email
}

IMPORT_SESSION = re.compile(
    r"import \{ getServerSession \} from 'next-auth';\n"
    r"import \{ authOptions \} from '@/lib/auth-auth-options';?\n?",
)
# fix typo in pattern
IMPORT_SESSION = re.compile(
    r"import \{ getServerSession \} from 'next-auth';\r?\n"
    r"import \{ authOptions \} from '@/lib/auth-options';\r?\n"
)

LOCAL_GET_USER = re.compile(
    r"\nasync function getUserId\(\) \{\r?\n"
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  const userId = \(session\?\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"  if \(!userId\) return null;\r?\n"
    r"  return userId;\r?\n\}\r?\n",
    re.MULTILINE,
)

BLOCK3 = re.compile(
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  const userId = \(session\?\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"  if \(!userId\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n",
    re.MULTILINE,
)

BLOCK3_4 = re.compile(
    r"    const session = await getServerSession\(authOptions\);\r?\n"
    r"    const userId = \(session\?\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"    if \(!userId\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n",
    re.MULTILINE,
)

BLOCK_UNAUTH_LOWER = re.compile(
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  const userId = \(session\?\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"  if \(!userId\) \{\r?\n"
    r"    return NextResponse\.json\(\{ error: 'unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"  \}\r?\n",
    re.MULTILINE,
)

BLOCK_TRY_SESSION = re.compile(
    r"    const session = await getServerSession\(authOptions\);\r?\n"
    r"    if \(!session\?\.user\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n\r?\n"
    r"    const userId = \(session\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"    if \(!userId\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n",
    re.MULTILINE,
)

BLOCK_TRY_SESSION_ONLINE = re.compile(
    r"    const session = await getServerSession\(authOptions\);\r?\n"
    r"    if \(!session\?\.user\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n"
    r"    const userId = \(session\.user as \{ id\?: string \}\)\?\.id;\r?\n",
    re.MULTILINE,
)

LOCAL_GET_SESSION_USER_ID = re.compile(
    r"\nasync function getSessionUserId\(\) \{\r?\n"
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  return \(session\?\.user as \{ id\?: string \}\)\?\.id \?\? null;\r?\n"
    r"\}\r?\n",
    re.MULTILINE,
)

GET_SESSION_CALL = re.compile(
    r"    const userId = await getSessionUserId\(\);\r?\n"
    r"    if \(!userId\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n",
    re.MULTILINE,
)

GET_USER_CALL = re.compile(
    r"    const userId = await getUserId\(\);\r?\n"
    r"    if \(!userId\) return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n",
    re.MULTILINE,
)

REPLACEMENT3 = (
    "  const auth = await requireUserId();\n"
    "  if (isAuthError(auth)) return auth;\n"
    "  const userId = auth;\n"
)

REPLACEMENT4 = (
    "    const auth = await requireUserId();\n"
    "    if (isAuthError(auth)) return auth;\n"
    "    const userId = auth;\n"
)

REPLACEMENT_GET = REPLACEMENT4

AUTH_IMPORT = "import { requireUserId, isAuthError, getSessionUserId } from '@/lib/session-auth';\n"


def ensure_import(text: str) -> str:
    if "@/lib/session-auth" in text:
        if "await getSessionUserId()" in text and "getSessionUserId" not in text.split("from '@/lib/session-auth'")[1].split("\n")[0]:
            text = text.replace(
                "{ requireUserId, isAuthError }",
                "{ requireUserId, isAuthError, getSessionUserId }",
            )
        return text
    # after first import block
    m = re.search(r"(import .+;\r?\n)+", text)
    if m:
        pos = m.end()
        return text[:pos] + AUTH_IMPORT + text[pos:]
    return AUTH_IMPORT + text


def strip_session_imports(text: str) -> str:
    text = re.sub(r"import \{ getServerSession \} from 'next-auth';\r?\n", "", text)
    text = re.sub(r"import \{ authOptions \} from '@/lib/auth-options';\r?\n", "", text)
    return text


def still_uses_session(text: str) -> bool:
    return "getServerSession" in text or "authOptions" in text


def process(path: Path) -> bool:
    rel = str(path.relative_to(ROOT)).replace("\\", "/")
    if rel in SKIP:
        return False
    text = path.read_text(encoding="utf-8")
    if "getServerSession" not in text and "async function getUserId" not in text:
        return False
    orig = text
    text = LOCAL_GET_USER.sub("\n", text)
    text = LOCAL_GET_SESSION_USER_ID.sub("\n", text)
    text = GET_USER_CALL.sub(REPLACEMENT_GET, text)
    text = GET_SESSION_CALL.sub(REPLACEMENT_GET, text)
    text = BLOCK3.sub(REPLACEMENT3, text)
    text = BLOCK3_4.sub(REPLACEMENT4, text)
    text = BLOCK_UNAUTH_LOWER.sub(REPLACEMENT3, text)
    text = BLOCK_TRY_SESSION.sub(REPLACEMENT4, text)
    text = BLOCK_TRY_SESSION_ONLINE.sub(REPLACEMENT4, text)
    if text == orig:
        return False
    if not still_uses_session(text):
        text = strip_session_imports(text)
    text = ensure_import(text)
    path.write_text(text, encoding="utf-8")
    print("updated", rel)
    return True


def main() -> int:
    n = 0
    for fp in sorted(API.rglob("route.ts")):
        if process(fp):
            n += 1
    print(f"Done: {n} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
