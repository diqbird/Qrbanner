#!/usr/bin/env python3
import json
import subprocess
import sys
import urllib.request

RUN_ID = sys.argv[1] if len(sys.argv) > 1 else "28672368130"
REPO = "diqbird/Qrbanner"

req = urllib.request.Request(
    f"https://api.github.com/repos/{REPO}/actions/runs/{RUN_ID}/jobs",
    headers={"Accept": "application/vnd.github+json", "User-Agent": "qrbanner-ci-log"},
)
with urllib.request.urlopen(req, timeout=30) as resp:
    data = json.loads(resp.read())

for job in data.get("jobs", []):
    if job.get("conclusion") != "failure":
        continue
    print(f"\n=== {job['name']} (id {job['id']}) ===")
    for step in job.get("steps", []):
        if step.get("conclusion") == "failure":
            print(f"  failed step: {step['name']}")
