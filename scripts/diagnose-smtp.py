#!/usr/bin/env python3
"""Diagnose SMTP config on VPS and send a live test email via nodemailer."""
import os
import sys
import paramiko

HOST = os.environ.get("DEPLOY_HOST", "31.97.113.170")
USER = os.environ.get("DEPLOY_USER", "root")
PW = os.environ.get("DEPLOY_PASSWORD")
REMOTE = os.environ.get("DEPLOY_REMOTE", "/var/www/qrbanner")

TEST_TO = sys.argv[1] if len(sys.argv) > 1 else ""

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect(HOST, username=USER, password=PW, timeout=30)

# 1) Which SMTP vars are present (mask password)
_, stdout, _ = c.exec_command(
    f"grep -E '^SMTP_' {REMOTE}/.env | sed -E 's/(SMTP_PASSWORD=).*/\\1***MASKED***/'",
    timeout=30,
)
print("--- SMTP env on VPS ---")
print(stdout.read().decode("utf-8", "replace") or "NO SMTP VARS")

if not TEST_TO:
    print("\n(Provide a recipient email as an argument to send a live test.)")
    c.close()
    raise SystemExit(0)

# 2) Live nodemailer test using the same env the app uses
node = r'''
const fs = require("fs");
const nodemailer = require("nodemailer");
const env = fs.readFileSync(".env","utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1,-1);
  process.env[m[1]] = v;
}
const host = process.env.SMTP_HOST, port = parseInt(process.env.SMTP_PORT||"465",10);
const user = process.env.SMTP_USER, pass = process.env.SMTP_PASSWORD;
if (!host || !user || !pass) { console.log("SMTP_NOT_CONFIGURED"); process.exit(0); }
const t = nodemailer.createTransport({ host, port, secure: port===465, auth:{user,pass} });
t.verify().then(()=>{
  console.log("VERIFY_OK", host, port);
  return t.sendMail({
    from: `QRbanner <${process.env.SMTP_FROM||user}>`,
    to: process.env.TEST_TO,
    subject: "QRbanner SMTP test",
    text: "SMTP test OK - " + new Date().toISOString(),
  });
}).then(info=>{
  console.log("SEND_OK", info.messageId, JSON.stringify(info.accepted), JSON.stringify(info.rejected));
}).catch(e=>{
  console.log("SMTP_ERROR", e.message);
});
'''
cmd = f"cd {REMOTE} && TEST_TO='{TEST_TO}' node -e {node!r}"
_, stdout, stderr = c.exec_command(cmd, timeout=60)
print("--- live send test ---")
print(stdout.read().decode("utf-8", "replace"))
err = stderr.read().decode("utf-8", "replace")
if err.strip():
    print("stderr:", err)
c.close()
