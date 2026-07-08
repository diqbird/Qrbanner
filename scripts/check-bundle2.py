#!/usr/bin/env python3
import paramiko, re
import os

HOST = "31.97.113.170"
USER = "root"
PASSWORD = os.environ["DEPLOY_PASSWORD"]

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PASSWORD, timeout=30)
stdin, stdout, stderr = c.exec_command(
    "cat '/var/www/qrbanner/.next/server/app/s/[code]/route.js'",
    timeout=90,
)
content = stdout.read().decode("utf-8", errors="replace")
# find geoip related snippets
for pat in ["geoip", "lookupGeo", "countryName", "loadGeoip", "Turkey", "require("]:
    idx = content.find(pat)
    if idx >= 0:
        print(f"=== {pat} @ {idx} ===")
        print(content[max(0, idx - 80) : idx + 200])
        print()
# check nft.json for traced files
stdin, stdout, stderr = c.exec_command(
    "cat '/var/www/qrbanner/.next/server/app/s/[code]/route.js.nft.json' | head -c 4000",
    timeout=30,
)
nft = stdout.read().decode("utf-8", errors="replace")
print("=== NFT (first 4000) ===")
print(nft)
if "geoip" in nft.lower():
    print("GEOIP IN NFT")
else:
    print("GEOIP NOT IN NFT")
c.close()
