import paramiko
import os
import sys

dest = r"C:\Users\ACRO Technology\qrbanner"
remote_base = "/var/www/qrbanner"
pattern = sys.argv[1] if len(sys.argv) > 1 else "components"

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect("31.97.113.170", username="root", password=os.environ["DEPLOY_PASSWORD"], timeout=20)

cmd = f'find {remote_base}/{pattern} -type f'
stdin, stdout, stderr = c.exec_command(cmd)
paths = [p for p in stdout.read().decode().strip().split("\n") if p]

for p in paths:
    rel = p.replace(remote_base + "/", "")
    local = os.path.join(dest, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(local), exist_ok=True)
    stdin, stdout, stderr = c.exec_command("cat " + repr(p))
    with open(local, "wb") as f:
        f.write(stdout.read())
    print(rel)

print(f"Synced {len(paths)} files")
c.close()
