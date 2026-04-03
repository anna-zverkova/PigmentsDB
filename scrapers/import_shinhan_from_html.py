#!/usr/bin/env python3
"""
Import ShinHan paints from saved Oto Kano HTML tables.

- Parses the table with headers: Pigment(s), Paint Name, Hue, Brand, Color, ... Light, Stain, Granu., Transp., Vegan
- Copies swatch images from the local *_files folder
- Computes a simple average hex color from the swatch image
- Appends paints to content/paints.json with unique IDs

Usage:
  python scrapers/import_shinhan_from_html.py \
    --html "ShinHan Pro - Paint Database - Dr. Oto Kano.html" \
    --brand-id "shinhan-pro" \
    --performance "Student" \
    --uploads-dir "public/uploads/shinhan-pro"

  python scrapers/import_shinhan_from_html.py \
    --html "ShinHan PWC - Paint Database - Dr. Oto Kano.html" \
    --brand-id "shinhan-pwc" \
    --performance "Professional" \
    --uploads-dir "public/uploads/shinhan-pwc"
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Dict, List

from bs4 import BeautifulSoup
from PIL import Image


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"[^a-z0-9-]+", "", text)
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def parse_pigments(text: str) -> List[str]:
    text = text.strip()
    if text in {"–", "-", "—", ""}:
        return []
    # Normalize separators
    text = re.sub(r"[+/&;]+", ",", text)
    parts = [p.strip() for p in re.split(r"[,\s]+", text) if p.strip()]
    return parts


def map_transparency(code: str) -> str:
    code = code.strip().upper()
    if code == "O":
        return "Opaque"
    if code == "SO":
        return "Semi-Opaque"
    if code == "ST":
        return "Semi-Transparent"
    if code == "T":
        return "Transparent"
    return "Transparent"


def avg_hex(path: Path) -> str:
    try:
        with Image.open(path) as img:
            img = img.convert("RGBA")
            # Composite on white background to avoid transparency issues
            bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
            img = Image.alpha_composite(bg, img)
            img = img.convert("RGB")
            img = img.resize((1, 1))
            r, g, b = img.getpixel((0, 0))
            return f"#{r:02X}{g:02X}{b:02X}"
    except Exception:
        return "#E6D9C6"


def find_table(soup: BeautifulSoup):
    for table in soup.find_all("table"):
        headers = [th.get_text(" ", strip=True) for th in table.find_all("th")]
        if headers and "Pigment(s)" in headers and "Paint Name" in headers:
            return table, headers
    return None, []


def make_unique_id(base: str, existing: set) -> str:
    if base not in existing:
        existing.add(base)
        return base
    i = 2
    while True:
        candidate = f"{base}-v{i}"
        if candidate not in existing:
            existing.add(candidate)
            return candidate
        i += 1


def main() -> int:
    parser = argparse.ArgumentParser(description="Import ShinHan paints from HTML")
    parser.add_argument("--html", required=True)
    parser.add_argument("--brand-id", required=True)
    parser.add_argument("--performance", required=True, choices=["Professional", "Student"])
    parser.add_argument("--uploads-dir", required=True)
    parser.add_argument("--paints", default="content/paints.json")
    args = parser.parse_args()

    html_path = Path(args.html)
    if not html_path.exists():
        raise SystemExit(f"HTML file not found: {html_path}")

    uploads_dir = Path(args.uploads_dir)
    uploads_dir.mkdir(parents=True, exist_ok=True)

    with open(html_path, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    table, headers = find_table(soup)
    if not table:
        raise SystemExit("Could not find paint table in HTML.")

    header_index: Dict[str, int] = {h: i for i, h in enumerate(headers)}
    required = ["Pigment(s)", "Paint Name", "Hue", "Color", "Light", "Transp.", "Vegan"]
    for key in required:
        if key not in header_index:
            raise SystemExit(f"Missing column: {key}")

    with open(args.paints, encoding="utf-8") as f:
        paints_data = json.load(f)

    paints = paints_data.get("items", [])
    existing_ids = {p["id"] for p in paints}

    added = 0
    for row in table.find_all("tr")[1:]:
        tds = row.find_all("td")
        if len(tds) < len(headers):
            continue

        pigment_text = tds[header_index["Pigment(s)"]].get_text(" ", strip=True)
        name = tds[header_index["Paint Name"]].get_text(" ", strip=True)
        hue = tds[header_index["Hue"]].get_text(" ", strip=True)
        light = tds[header_index["Light"]].get_text(" ", strip=True)
        transp_code = tds[header_index["Transp."]].get_text(" ", strip=True)
        vegan_text = tds[header_index["Vegan"]].get_text(" ", strip=True)

        if not name:
            continue

        pigments = parse_pigments(pigment_text)
        if not pigments:
            pigments = []

        # Swatch image (Color column)
        color_cell = tds[header_index["Color"]]
        img = color_cell.find("img")
        swatch_path = None
        if img:
            src = (img.get("src") or img.get("data-src") or "").strip()
            if src.startswith("./"):
                local_path = html_path.parent / src
                if local_path.exists():
                    dest = uploads_dir / Path(local_path).name
                    if not dest.exists():
                        dest.write_bytes(local_path.read_bytes())
                    swatch_path = f"/uploads/{uploads_dir.name}/{dest.name}"
                    hex_value = avg_hex(dest)
                else:
                    hex_value = "#E6D9C6"
            else:
                hex_value = "#E6D9C6"
        else:
            hex_value = "#E6D9C6"

        base_id = f"{args.brand_id}-{slugify(name)}"
        paint_id = make_unique_id(base_id, existing_ids)

        paint = {
            "id": paint_id,
            "brandId": args.brand_id,
            "name": name,
            "pigmentCodes": pigments,
            "hex": hex_value,
            "transparency": map_transparency(transp_code),
            "staining": "Medium-Staining",
            "granulation": "Low",
            "lightfastness": light if light and light != "–" else "Unknown",
            "isVegan": True if vegan_text.upper() == "V" else False,
            "performance": args.performance,
            "swatchImage": swatch_path,
            "hue": hue if hue and hue != "–" else "–",
        }

        paints.append(paint)
        added += 1

    paints_data["items"] = paints
    with open(args.paints, "w", encoding="utf-8") as f:
        json.dump(paints_data, f, ensure_ascii=False, indent=2)

    print(f"Added {added} paints to {args.paints}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
