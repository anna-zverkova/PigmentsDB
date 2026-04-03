#!/usr/bin/env python3
"""
Auto-assign White Nights swatch images from filenames in public/uploads/white-nights.

- Matches paint names to filenames by slug (case/punctuation insensitive)
- Fills swatchImage only when missing
- Writes the updated paints.json back to disk

Usage:
  python scrapers/update_white_nights_swatches.py \
    --paints "content/paints.json" \
    --swatch-dir "public/uploads/white-nights"
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def slugify(text: str) -> str:
    text = text.strip().lower()
    # common spelling fixes for White Nights data
    text = text.replace("petesburg", "petersburg")
    # normalize separators
    text = re.sub(r"[\s_]+", "-", text)
    # drop anything not alnum or dash
    text = re.sub(r"[^a-z0-9-]+", "", text)
    # collapse dashes
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def file_slug(filename: str) -> str:
    name = Path(filename).stem
    # remove duplicate suffixes like (1)
    name = re.sub(r"\\(\\d+\\)$", "", name)
    # drop common prefixes like WH-, WG-
    name = re.sub(r"^[A-Za-z]{2}-", "", name)
    return slugify(name)


def main() -> int:
    parser = argparse.ArgumentParser(description="Update White Nights swatch images")
    parser.add_argument("--paints", default="content/paints.json")
    parser.add_argument("--swatch-dir", default="public/uploads/white-nights")
    args = parser.parse_args()

    paints_path = Path(args.paints)
    swatch_dir = Path(args.swatch_dir)

    if not paints_path.exists():
        raise SystemExit(f"Paints file not found: {paints_path}")
    if not swatch_dir.exists():
        raise SystemExit(f"Swatch directory not found: {swatch_dir}")

    with open(paints_path, encoding="utf-8") as f:
        data = json.load(f)

    paints = data.get("items", [])

    # Build filename map
    file_map = {}
    for path in swatch_dir.iterdir():
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        slug = file_slug(path.name)
        # keep first occurrence
        file_map.setdefault(slug, path.name)

    updated = 0
    for p in paints:
        if p.get("brandId") != "white-nights":
            continue
        if p.get("swatchImage"):
            continue
        name_slug = slugify(p.get("name", ""))
        filename = file_map.get(name_slug)
        if not filename:
            continue
        p["swatchImage"] = f"/uploads/white-nights/{filename}"
        updated += 1

    if updated:
        with open(paints_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated swatchImage for {updated} White Nights paints")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
