#!/usr/bin/env python3
"""Verify the Paddle webhook signature check works on VPS with the configured secret."""
import os
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

# Runs on the VPS: reads the secret from .env, builds a valid paddle-signature
# header (ts=...;h1=hmac_sha256(secret, "ts:body")) and posts to the live endpoint.
REMOTE_SCRIPT = r'''
cd /var/www/qrbanner
node -e '
const crypto = require("crypto");
const fs = require("fs");
const env = fs.readFileSync(".env","utf8");
const m = env.match(/^PADDLE_WEBHOOK_SECRET=(.*)$/m);
if(!m){ console.log("NO_SECRET"); process.exit(1); }
let secret = m[1].trim().replace(/^["\x27]|["\x27]$/g,"");
const ts = Math.floor(Date.now()/1000);
const body = JSON.stringify({event_type:"transaction.completed",data:{id:"txn_verify",status:"completed"}});
const h1 = crypto.createHmac("sha256", secret).update(ts+":"+body).digest("hex");
const sig = "ts="+ts+";h1="+h1;
fetch("https://qrbanner.com/api/billing/webhook",{method:"POST",headers:{"Content-Type":"application/json","paddle-signature":sig},body}).then(async r=>{
  console.log("valid_sig_status", r.status, await r.text());
  // Now a wrong signature should be rejected (400)
  const bad = "ts="+ts+";h1=deadbeef";
  const r2 = await fetch("https://qrbanner.com/api/billing/webhook",{method:"POST",headers:{"Content-Type":"application/json","paddle-signature":bad},body});
  console.log("bad_sig_status", r2.status);
}).catch(e=>{console.log("ERR",e.message)});
'
'''


def main():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PW, timeout=30)
    _, stdout, stderr = c.exec_command(REMOTE_SCRIPT, timeout=60)
    print(stdout.read().decode("utf-8", "replace"))
    err = stderr.read().decode("utf-8", "replace")
    if err.strip():
        print("--- stderr ---")
        print(err)
    c.close()


if __name__ == "__main__":
    main()
