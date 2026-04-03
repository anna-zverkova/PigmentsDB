#!/usr/bin/env python3
"""
White Nights watercolor range scraper.

- Parses a saved HTML file (default: "White Nights - watercolor range.html")
- Finds paint image URLs and captions
- Downloads images to a target folder
- Writes a CSV table with paint name + image filename + source URL

Usage:
  python scrapers/white_nights_scraper.py \
    --html "White Nights - watercolor range.html" \
    --out-dir "public/uploads/white-nights-range" \
    --csv "scrapers/white_nights_range.csv"
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import sys
from pathlib import Path
from typing import Iterable, Tuple
from urllib.request import urlopen, Request

from bs4 import BeautifulSoup


DEFAULT_HTML = "White Nights - watercolor range.html"


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

    # Match any div containing the required class substring
    blocks = soup.find_all(
        "div",
        class_=lambda c: c
        and "landing-block-node-img-container" in c
        and "g-pos-rel" in c
    )

    for block in blocks:
        # href contains the image URL
        link = block.find("a", href=True)
        if not link:
            continue
        img_url = link["href"].strip()

        # data-caption holds the paint name
        caption = link.get("data-caption") or block.get("data-caption")
        if not caption:
            continue

        # Example: "White Night watercolour, PRUSSIAN BLUE"
        # Prefer the part after the comma
        paint_name = caption.split(",", 1)[-1].strip()
        if not paint_name:
            continue

        yield paint_name, img_url


def download_image(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req) as resp, open(dest, "wb") as f:
        f.write(resp.read())


def main() -> int:
    parser = argparse.ArgumentParser(description="White Nights scraper")
    parser.add_argument("--html", default=DEFAULT_HTML, help="Path to saved HTML file")
    parser.add_argument("--out-dir", default="public/uploads/white-nights-range", help="Output image directory")
    parser.add_argument("--csv", default="scrapers/white_nights_range.csv", help="Output CSV path")
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
