#!/usr/bin/env python3
"""
Prepare qrbanner for GitHub + Actions CI.
Run after installing Git: https://git-scm.com/download/win

Usage:
  set GITHUB_REPO=https://github.com/YOUR_ORG/qrbanner.git
  python scripts/setup-github-ci.py
"""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REMOTE = os.environ.get("GITHUB_REPO", "").strip()


def run(cmd: list[str], cwd: str = ROOT) -> int:
    print("+", " ".join(cmd))
    return subprocess.call(cmd, cwd=cwd, shell=False)


def find_git() -> str | None:
    for name in ("git", "git.exe"):
        path = shutil.which(name)
        if path:
            return path
    for candidate in (
        r"C:\Program Files\Git\bin\git.exe",
        r"C:\Program Files (x86)\Git\bin\git.exe",
    ):
        if os.path.isfile(candidate):
            return candidate
    return None


def main() -> int:
    git = find_git()
    if not git:
        print("Git bulunamadi. Once Git for Windows kurun, sonra bu scripti tekrar calistirin.")
        print("https://git-scm.com/download/win")
        return 1

    if not os.path.isdir(os.path.join(ROOT, ".git")):
        if run([git, "init"]) != 0:
            return 1
        print("Git repo olusturuldu.")

    if run([git, "add", "-A"]) != 0:
        return 1

    status = subprocess.check_output([git, "status", "--porcelain"], cwd=ROOT, text=True)
    if not status.strip():
        print("Commit edilecek degisiklik yok.")
    else:
        msg = os.environ.get("GIT_COMMIT_MSG", "chore: QA pipeline, i18n, Playwright E2E")
        if run([git, "commit", "-m", msg]) != 0:
            print("Commit atlandi (belki bos veya hook).")

    if not REMOTE:
        print("\nSonraki adim: GitHub'da bos repo olusturun, sonra:")
        print('  set GITHUB_REPO=https://github.com/KULLANICI/qrbanner.git')
        print("  python scripts/setup-github-ci.py")
        return 0

    run([git, "branch", "-M", "main"])
    run([git, "remote", "remove", "origin"])
    if run([git, "remote", "add", "origin", REMOTE]) != 0:
        return 1
    code = run([git, "push", "-u", "origin", "main"])
    if code == 0:
        print("\nPush tamam. GitHub > Actions sekmesinden QA workflow'unu kontrol edin.")
    else:
        print("\nPush basarisiz. GitHub kimlik dogrulama veya repo URL kontrol edin.")
    return code


if __name__ == "__main__":
    sys.exit(main())
