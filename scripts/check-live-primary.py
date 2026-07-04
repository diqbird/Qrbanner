#!/usr/bin/env python3
import re
import urllib.request

html = urllib.request.urlopen("https://qrbanner.com", timeout=30).read().decode("utf-8", "replace")
css_hrefs = re.findall(r'href="(/_next/static/css/[^"]+\.css)"', html)
print(f"CSS bundles: {len(css_hrefs)}")
for href in css_hrefs:
    css = urllib.request.urlopen(f"https://qrbanner.com{href}", timeout=30).read().decode("utf-8", "replace")
    primaries = re.findall(r"--primary:\s*([^;}{]+)", css)
    print(f"{href}: primary={primaries[:2]}")
    bg = re.search(r"\.bg-primary\{([^}]+)\}", css)
    if bg:
        print(f"  .bg-primary => {bg.group(1)[:80]}")
