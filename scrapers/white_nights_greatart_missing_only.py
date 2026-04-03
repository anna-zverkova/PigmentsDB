#!/usr/bin/env python3
"""
Create a missing-only image folder for White Nights (GreatArt source).

- Reads existing TintMap paints data
- Finds White Nights paints that have no swatchImage
- Copies matching GreatArt downloads into a missing-only folder
- Writes a CSV report

Usage:
  python scrapers/white_nights_greatart_missing_only.py \
    --paints "content/paints.json" \
    --csv "scrapers/white_nights_greatart.csv" \
    --src-dir "public/uploads/white-nights-greatart/img-from-greatart" \
    --out-dir "public/uploads/white-nights-greatart/img-from-greatart-missing-only" \
    --out-csv "scrapers/white_nights_greatart_missing_only.csv"
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import shutil
from pathlib import Path


def norm_name(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def main() -> int:
    parser = argparse.ArgumentParser(description="White Nights GreatArt missing-only generator")
    parser.add_argument("--paints", default="content/paints.json")
    parser.add_argument("--csv", default="scrapers/white_nights_greatart.csv")
    parser.add_argument("--src-dir", default="public/uploads/white-nights-greatart/img-from-greatart")
    parser.add_argument("--out-dir", default="public/uploads/white-nights-greatart/img-from-greatart-missing-only")
    parser.add_argument("--out-csv", default="scrapers/white_nights_greatart_missing_only.csv")
    args = parser.parse_args()

    paints_path = Path(args.paints)
    csv_path = Path(args.csv)
    src_dir = Path(args.src_dir)
    out_dir = Path(args.out_dir)
    out_csv = Path(args.out_csv)

    if not paints_path.exists():
        raise SystemExit(f"Paints file not found: {paints_path}")
    if not csv_path.exists():
        raise SystemExit(f"CSV file not found: {csv_path}")

    with open(paints_path, encoding="utf-8") as f:
        paints = json.load(f).get("items", [])

    white_nights = [p for p in paints if p.get("brandId") == "white-nights"]
    name_has_swatch = {}
    for p in white_nights:
        name = norm_name(p.get("name", ""))
        if not name:
            continue
        swatch = p.get("swatchImage") or ""
        name_has_swatch[name] = name_has_swatch.get(name, False) or bool(swatch.strip())

    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    missing_rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            paint_name = row["paint_name"]
            if name_has_swatch.get(norm_name(paint_name), False):
                continue

            image_file = row["image_file"]
            src = src_dir / image_file
            if src.exists():
                shutil.copy2(src, out_dir / image_file)
                status = "copied"
            else:
                status = "missing_source"

            missing_rows.append({
                "paint_name": paint_name,
                "image_url": row["image_url"],
                "image_file": image_file,
                "status": status,
            })

    out_csv.parent.mkdir(parents=True, exist_ok=True)
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["paint_name", "image_url", "image_file", "status"],
        )
        writer.writeheader()
        writer.writerows(missing_rows)

    print(f"White Nights paints in DB: {len(white_nights)}")
    print(f"Missing rows: {len(missing_rows)}")
    print(f"Copied: {sum(1 for r in missing_rows if r['status']=='copied')}")
    print(f"Missing source: {sum(1 for r in missing_rows if r['status']=='missing_source')}")
    print(f"Missing-only folder: {out_dir}")
    print(f"Missing CSV: {out_csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
