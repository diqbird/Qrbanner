#!/usr/bin/env python3
"""Create GitHub repo and push after gh auth is complete."""
import os
import subprocess
import sys
import time

ROOT = os.environ.get("DEPLOY_LOCAL", r"C:\Users\ACRO Technology\qrbanner")
REPO_NAME = os.environ.get("GITHUB_REPO_NAME", "qrbanner")
PRIVATE = os.environ.get("GITHUB_PRIVATE", "1") not in ("0", "false", "False")
GIT = r"C:\Program Files\Git\bin\git.exe"
GH = r"C:\Program Files\GitHub CLI\gh.exe"


def run(cmd: list[str], cwd: str = ROOT) -> int:
    print("+", " ".join(cmd))
    return subprocess.call(cmd, cwd=cwd)


def auth_ok() -> bool:
    return subprocess.call([GH, "auth", "status"], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL) == 0


def main() -> int:
    if not auth_ok():
        print("GitHub oturumu yok. Once su komutu calistirin (gh PATH'te olmayabilir):")
        print(f'  & "{GH}" auth login')
        print("  https://github.com/login/device")
        print("Sonra: python scripts/push-github.py")
        return 1

    user = subprocess.check_output([GH, "api", "user", "-q", ".login"], cwd=ROOT, text=True).strip()
    print(f"Logged in as {user}")

    visibility = ["--private"] if PRIVATE else ["--public"]
    code = run(
        [GH, "repo", "create", REPO_NAME, *visibility, "--source", ".", "--remote", "origin", "--push"],
        cwd=ROOT,
    )
    if code != 0:
        # Repo may already exist — try push only
        remote = f"https://github.com/{user}/{REPO_NAME}.git"
        run([GIT, "remote", "remove", "origin"], cwd=ROOT)
        if run([GIT, "remote", "add", "origin", remote], cwd=ROOT) != 0:
            return 1
        code = run([GIT, "push", "-u", "origin", "main"], cwd=ROOT)

    if code == 0:
        print(f"\nRepo: https://github.com/{user}/{REPO_NAME}")
        print("Actions: https://github.com/{0}/{1}/actions".format(user, REPO_NAME))
    return code


if __name__ == "__main__":
    sys.exit(main())
