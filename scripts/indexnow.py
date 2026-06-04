#!/usr/bin/env python3
"""IndexNow submitter for allinmediafactory.com.
Pings Bing/Yandex (IndexNow protocol) so new/updated URLs get crawled fast.
Bing powers Copilot + ChatGPT retrieval, so this matters for AI citation.

Usage:
  python scripts/indexnow.py                      # submits the whole sitemap
  python scripts/indexnow.py URL1 URL2 ...         # submits specific URLs
"""
import sys
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

HOST = "allinmediafactory.com"
KEY = "3c768509dac5a87f4bfa270538270bdf"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
SITEMAPS = [
    f"https://{HOST}/sitemap-pages.xml",
    f"https://{HOST}/sitemap-blog.xml",
]


def urls_from_sitemaps():
    urls = []
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    for sm in SITEMAPS:
        try:
            with urllib.request.urlopen(sm, timeout=20) as r:
                root = ET.fromstring(r.read())
            urls += [loc.text.strip() for loc in root.iter(f"{ns}loc")]
        except Exception as e:
            print(f"[warn] {sm}: {e}")
    return urls


def submit(urls):
    if not urls:
        print("No URLs to submit.")
        return
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT, data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow: HTTP {r.status} for {len(urls)} URLs")
    except urllib.error.HTTPError as e:
        print(f"IndexNow HTTPError {e.code}: {e.read().decode(errors='ignore')}")
    except Exception as e:
        print(f"IndexNow error: {e}")


if __name__ == "__main__":
    urls = sys.argv[1:] or urls_from_sitemaps()
    print(f"Submitting {len(urls)} URLs to IndexNow...")
    submit(urls)
