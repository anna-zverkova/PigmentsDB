#!/usr/bin/env python3
"""
White Nights GreatArt swatch scraper.

- Parses a saved HTML file (default: "WHITE NIGHTS - Great Art - individual swatches.html")
- Finds paint image URLs and alt text
- Downloads images to a target folder
- Writes a CSV table with paint name + image filename + source URL

Usage:
  python scrapers/white_nights_greatart_scraper.py \
    --html "WHITE NIGHTS - Great Art - individual swatches.html" \
    --out-dir "public/uploads/white-nights-greatart/img-from-greatart" \
    --csv "scrapers/white_nights_greatart.csv"
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import sys
import json
import subprocess
from pathlib import Path
from typing import Iterable, Tuple
from urllib.error import URLError
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup


DEFAULT_HTML = "WHITE NIGHTS - Great Art - individual swatches.html"
DEFAULT_OUT_DIR = "public/uploads/white-nights-greatart/img-from-greatart"


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def extract_paints(html_path: Path) -> Iterable[Tuple[str, str]]:
    """
    Returns (paint_name, image_url).
    """
    html = html_path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "html.parser")

    blocks = soup.find_all("div", class_=lambda c: c and "color-image" in c)
    for block in blocks:
        img = block.find("img")
        if not img:
            continue
        img_url = (img.get("src") or img.get("data-src") or "").strip()
        # Defensive cleanup if HTML includes wrapped quotes
        img_url = img_url.strip("\"'")
        if not img_url:
            continue
        paint_name = (img.get("alt") or "").strip()
        if not paint_name:
            continue
        yield paint_name, img_url


def download_image(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urlopen(req) as resp, open(dest, "wb") as f:
            f.write(resp.read())
        return
    except URLError as e:
        # DNS issues are common in locked-down networks. Try a DoH + curl fallback.
        if "nodename nor servname provided" in str(e) or "Name or service not known" in str(e):
            _download_with_curl_doh(url, dest)
            return
        raise


def _download_with_curl_doh(url: str, dest: Path) -> None:
    """
    Fallback downloader that resolves DNS via Cloudflare DoH and uses curl
    with --resolve to preserve SNI and HTTPS cert validation.
    """
    host = url.split("/")[2]
    doh_url = f"https://cloudflare-dns.com/dns-query?name={host}&type=A"
    req = Request(doh_url, headers={"accept": "application/dns-json"})
    with urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    ips = [a.get("data") for a in data.get("Answer", []) if a.get("data")]
    if not ips:
        raise URLError(f"DoH failed to resolve {host}")

    dest.parent.mkdir(parents=True, exist_ok=True)
    # Try the first IP; curl keeps SNI via --resolve.
    ip = ips[0]
    resolve_arg = f"{host}:443:{ip}"
    subprocess.check_call([
        "curl",
        "-L",
        "--silent",
        "--show-error",
        "--fail",
        "--resolve",
        resolve_arg,
        "-o",
        str(dest),
        url,
    ])


def main() -> int:
    parser = argparse.ArgumentParser(description="White Nights GreatArt scraper")
    parser.add_argument("--html", default=DEFAULT_HTML, help="Path to saved HTML file")
    parser.add_argument("--out-dir", default=DEFAULT_OUT_DIR, help="Output image directory")
    parser.add_argument("--csv", default="scrapers/white_nights_greatart.csv", help="Output CSV path")
    args = parser.parse_args()

    html_path = Path(args.html)
    if not html_path.exists():
        print(f"HTML file not found: {html_path}", file=sys.stderr)
        return 1

    out_dir = Path(args.out_dir)
    csv_path = Path(args.csv)

    rows = []
    seen = {}

    for paint_name, img_url in extract_paints(html_path):
        base_slug = f"white-nights-{slugify(paint_name)}"
        if base_slug in seen:
            seen[base_slug] += 1
            slug = f"{base_slug}-v{seen[base_slug]}"
        else:
            seen[base_slug] = 1
            slug = base_slug

        ext = os.path.splitext(img_url)[1].lower() or ".jpg"
        filename = f"{slug}{ext}"
        dest = out_dir / filename

        if not dest.exists():
            try:
                download_image(img_url, dest)
                status = "downloaded"
            except Exception as e:
                status = f"error: {e}"
        else:
            status = "skipped"

        rows.append({
            "paint_name": paint_name,
            "image_url": img_url,
            "image_file": filename,
            "status": status,
        })

    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["paint_name", "image_url", "image_file", "status"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Processed {len(rows)} paints")
    print(f"Images: {out_dir}")
    print(f"CSV: {csv_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
