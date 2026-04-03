# Scrapers

This folder contains one‑off data scrapers that operate on saved HTML pages.
No credentials or API keys are used.

## White Nights — watercolor range

**Source HTML**
- `White Nights - watercolor range.html` (saved locally)

**What it does**
- Extracts paint names and image URLs
- Downloads all paint images
- Writes a CSV summary table

**Run**
```bash
python scrapers/white_nights_scraper.py \
  --html "White Nights - watercolor range.html" \
  --out-dir "public/uploads/white-nights-range" \
  --csv "scrapers/white_nights_range.csv"
```

**Output**
- Images: `public/uploads/white-nights-range/`
- CSV: `scrapers/white_nights_range.csv`

**Notes**
- Filenames are normalized as `white-nights-<paint-name>.jpg`.
- If duplicates exist, `-v2`, `-v3` are appended.
- The CSV includes a `status` column (`downloaded`, `skipped`, `error: ...`).
