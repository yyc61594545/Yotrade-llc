#!/usr/bin/env python3
"""Thin client for the Bing Webmaster Tools API.

Key lives in ~/.config/yotrade/bing_webmaster.env (BING_WEBMASTER_API_KEY=...),
never in the repo. Docs: https://learn.microsoft.com/bingwebmaster/

Usage:
  scripts/bing_webmaster.py GetCrawlStats            # daily crawl/index counts
  scripts/bing_webmaster.py GetRankAndTrafficStats   # daily impressions/clicks
  scripts/bing_webmaster.py GetUrlInfo url=https://www.yotradellc.com/
  scripts/bing_webmaster.py GetQueryStats | GetPageStats | GetCrawlIssues
"""
import json
import os
import sys
import urllib.parse
import urllib.request

SITE = os.environ.get("BING_SITE_URL", "https://www.yotradellc.com/")
KEY_FILE = os.path.expanduser("~/.config/yotrade/bing_webmaster.env")


def api_key() -> str:
    key = os.environ.get("BING_WEBMASTER_API_KEY")
    if not key and os.path.exists(KEY_FILE):
        for line in open(KEY_FILE):
            if line.startswith("BING_WEBMASTER_API_KEY="):
                key = line.split("=", 1)[1].strip()
    if not key:
        sys.exit(f"missing BING_WEBMASTER_API_KEY (env or {KEY_FILE})")
    return key


def call(method: str, **params):
    q = {"siteUrl": SITE, "apikey": api_key(), **params}
    url = f"https://ssl.bing.com/webmaster/api.svc/json/{method}?" + urllib.parse.urlencode(q)
    req = urllib.request.Request(url, headers={"User-Agent": "yotrade-bwt/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)["d"]


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    method, *rest = sys.argv[1:]
    print(json.dumps(call(method, **dict(a.split("=", 1) for a in rest)), ensure_ascii=False, indent=1))
