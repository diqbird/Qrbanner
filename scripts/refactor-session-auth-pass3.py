#!/usr/bin/env python3
"""Pass 3: fix remaining session patterns + strip unused imports."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API = ROOT / "app" / "api"

LOCAL_GET_USER = re.compile(
    r"\nasync function getUserId\(\) \{\r?\n"
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  return \(session\?\.user as \{ id\?: string \}\)\?\.id \?\? null;\r?\n"
    r"\}\r?\n",
)

BLOCK_CHANGE_PW = re.compile(
    r"    const session = await getServerSession\(authOptions\);\r?\n"
    r"    if \(!session\?\.user\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n\r?\n"
    r"    const userId = \(session\.user as \{ id\?: string \}\)\?\.id;\r?\n"
    r"    if \(!userId\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n",
)

BLOCK_UPLOAD = re.compile(
    r"    const session = await getServerSession\(authOptions\);\r?\n"
    r"    if \(!session\?\.user\) \{\r?\n"
    r"      return NextResponse\.json\(\{ error: 'Unauthorized' \}, \{ status: 401 \}\);\r?\n"
    r"    \}\r?\n\r?\n",
)

BLOCK_INVITE = re.compile(
    r"  const session = await getServerSession\(authOptions\);\r?\n"
    r"  const userId = \(session\?\.user as \{ id\?: string \} \| undefined\)\?\.id;\r?\n"
    r"  if \(!userId\) return NextResponse\.json\(\{ error: 'Sign in required' \}, \{ status: 401 \}\);\r?\n\r?\n"
    r"  const mfaVerified = \(session as \{ mfaVerified\?: boolean \}\)\.mfaVerified;\r?\n"
    r"  if \(mfaVerified === false\) \{\r?\n"
    r"    return NextResponse\.json\(\{ error: 'mfa_required' \}, \{ status: 403 \}\);\r?\n"
    r"  \}\r?\n",
)

REPL_AUTH = (
    "    const auth = await requireUserId();\n"
    "    if (isAuthError(auth)) return auth;\n"
    "    const userId = auth;\n\n"
)

REPL_INVITE = (
    "  const auth = await requireSessionContext();\n"
    "  if (isAuthError(auth)) return auth;\n"
    "  if (auth.mfaVerified === false) {\n"
    "    return NextResponse.json({ error: 'mfa_required' }, { status: 403 });\n"
    "  }\n"
    "  const userId = auth.userId;\n\n"
)

AUTH_IMPORT = "import { requireUserId, isAuthError, requireSessionContext } from '@/lib/session-auth';\n"


def ensure_import(text: str) -> str:
    if "@/lib/session-auth" in text:
        if "requireSessionContext" in text and "requireSessionContext" not in text.split("session-auth")[1].split("\n")[0]:
            text = text.replace(
                "from '@/lib/session-auth'",
                "from '@/lib/session-auth'",
            )
        # upgrade import line if needed
        text = re.sub(
            r"import \{ requireUserId, isAuthError(?:, getSessionUserId)? \} from '@/lib/session-auth';",
            "import { requireUserId, isAuthError, getSessionUserId, requireSessionContext } from '@/lib/session-auth';",
            text,
        )
        if "requireSessionContext" in text and "requireSessionContext" not in text:
            pass
        return text
    m = re.search(r"(import .+;\r?\n)+", text)
    if m:
        return text[: m.end()] + AUTH_IMPORT + text[m.end() :]
    return AUTH_IMPORT + text


def strip_unused(text: str) -> str:
    if "getServerSession(" not in text and "authOptions" not in text.replace("auth-options", ""):
        text = re.sub(r"import \{ getServerSession \} from 'next-auth';\r?\n", "", text)
        text = re.sub(r"import \{ authOptions \} from '@/lib/auth-options';\r?\n", "", text)
    return text


def process(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    orig = text
    text = LOCAL_GET_USER.sub("\n", text)
    text = BLOCK_CHANGE_PW.sub(REPL_AUTH, text)
    text = BLOCK_UPLOAD.sub(
        "    const auth = await requireUserId();\n"
        "    if (isAuthError(auth)) return auth;\n"
        "    const userId = auth;\n\n",
        text,
    )
    if "invite" in str(path):
        text = BLOCK_INVITE.sub(REPL_INVITE, text)
    text = strip_unused(text)
    if "requireUserId" in text or "requireSessionContext" in text or "getSessionUserId" in text:
        if "@/lib/session-auth" not in text:
            text = ensure_import(text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("fixed", path.relative_to(ROOT))
        return True
    return False


def main() -> int:
    n = 0
    for fp in sorted(API.rglob("route.ts")):
        if process(fp):
            n += 1
    # strip pass all
    for fp in sorted(API.rglob("route.ts")):
        text = fp.read_text(encoding="utf-8")
        stripped = strip_unused(text)
        if stripped != text:
            fp.write_text(stripped, encoding="utf-8")
            print("stripped", fp.relative_to(ROOT))
            n += 1
    print("pass3:", n)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
