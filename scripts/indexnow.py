#!/usr/bin/env python3
"""
Notify IndexNow (Bing, Yandex, Seznam, Naver...) about yotradellc.com URLs.

Google gives this site ~40% of its visits while Bing gives ~0, the mirror image
of blog.yotradeapi.com. IndexNow is the fastest way to get new posts into Bing.

Usage:
  scripts/indexnow.py <slug> [<slug> ...]      # /blog/<slug> pages
  scripts/indexnow.py --all                    # every URL in the live sitemap
  scripts/indexnow.py --wait <slug>            # first wait until the page is live

The key file lives at public/<KEY>.txt and is served from the site root.
"""
from __future__ import annotations

import json
import re
import sys
import time
import urllib.request

HOST = "www.yotradellc.com"
KEY = "d82404d0ed6094e4353e610eecafe69c"
UA = {"User-Agent": "curl/8.7.1"}


def fetch(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return 0, ""


def wait_live(url: str, timeout: int = 900) -> bool:
    """Vercel deploys a few minutes after merge; poll until the page answers 200."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        if fetch(url)[0] == 200:
            return True
        time.sleep(30)
    return False


def main(argv: list[str]) -> int:
    wait = "--wait" in argv
    args = [a for a in argv if not a.startswith("--")]

    if "--all" in argv:
        status, body = fetch(f"https://{HOST}/sitemap.xml")
        if status != 200:
            print(f"sitemap fetch failed: HTTP {status}")
            return 1
        urls = re.findall(r"<loc>([^<]+)</loc>", body)
    else:
        urls = [f"https://{HOST}/blog/{s}" for s in args]

    if not urls:
        print("no URLs to submit")
        return 0

    if wait and not wait_live(urls[0]):
        print(f"{urls[0]} not live after waiting, skip IndexNow")
        return 1

    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": urls[:10000],
    }
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps(payload).encode(),
        headers={**UA, "Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow HTTP {r.status}, {len(urls)} URL(s)")
            return 0
    except urllib.error.HTTPError as e:
        print(f"IndexNow HTTP {e.code}: {e.read()[:200]!r}")
        return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
