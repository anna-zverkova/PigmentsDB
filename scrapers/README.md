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

## White Nights — GreatArt swatches

**Source HTML**
- `WHITE NIGHTS - Great Art - individual swatches.html` (saved locally)

**What it does**
- Extracts paint names from image `alt` text and image URLs from `src`
- Downloads all paint images
- Writes a CSV summary table
 - Includes a DNS fallback (Cloudflare DoH + `curl --resolve`) for restricted networks

**Run**
```bash
python scrapers/white_nights_greatart_scraper.py \
  --html "WHITE NIGHTS - Great Art - individual swatches.html" \
  --out-dir "public/uploads/white-nights-greatart/img-from-greatart" \
  --csv "scrapers/white_nights_greatart.csv"
```

**Output**
- Images: `public/uploads/white-nights-greatart/img-from-greatart/`
- CSV: `scrapers/white_nights_greatart.csv`

## White Nights — GreatArt missing-only

**What it does**
- Reads the TintMap paints database
- Finds White Nights paints missing `swatchImage`
- Copies matching GreatArt downloads into a missing-only folder
- Writes a CSV report

**Run**
```bash
python scrapers/white_nights_greatart_missing_only.py \
  --paints "content/paints.json" \
  --csv "scrapers/white_nights_greatart.csv" \
  --src-dir "public/uploads/white-nights-greatart/img-from-greatart" \
  --out-dir "public/uploads/white-nights-greatart/img-from-greatart-missing-only" \
  --out-csv "scrapers/white_nights_greatart_missing_only.csv"
```

**Output**
- Images: `public/uploads/white-nights-greatart/img-from-greatart-missing-only/`
- CSV: `scrapers/white_nights_greatart_missing_only.csv`

## White Nights — auto-assign swatches

**What it does**
- Scans `public/uploads/white-nights` for swatch files
- Matches filenames to White Nights paint names by slug
- Fills missing `swatchImage` fields in `content/paints.json`

**Run**
```bash
python scrapers/update_white_nights_swatches.py \
  --paints "content/paints.json" \
  --swatch-dir "public/uploads/white-nights"
```

## ShinHan — import from Oto Kano HTML

**What it does**
- Parses the Oto Kano paint table from saved HTML
- Copies swatch images from the `_files` folder
- Computes a simple average hex color from each swatch
- Appends paints to `content/paints.json`

**Run**
```bash
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
```

## Ken Bromley — import from Oto Kano HTML

**What it does**
- Parses the Ken Bromley paint table from the saved Oto Kano HTML
- Matches swatches from `public/uploads/ken-bromley`
- Downloads any missing swatch from the archived source URL
- Appends paints to `content/paints.json`

**Run**
```bash
node scrapers/import_ken_bromley_from_html.mjs \
  --html "Ken Bromley - Watercolor Paints Database - - Dr. Oto Kano.html" \
  --paints "content/paints.json" \
  --uploads-dir "public/uploads/ken-bromley" \
  --brand-id "ken-bromley"
```

## Daler Rowney Pro — import from Oto Kano HTML

**What it does**
- Parses the Daler Rowney Pro paint table from the saved Oto Kano HTML
- Matches swatches from `public/uploads/daler-rowney-pro`
- Downloads any missing swatch from the archived source URL
- Appends paints to `content/paints.json`

**Run**
```bash
node scrapers/import_daler_rowney_pro_from_html.mjs \
  --html "Daler Rowney Pro - Watercolor Paint Database - Dr. Oto Kano.html" \
  --paints "content/paints.json" \
  --uploads-dir "public/uploads/daler-rowney-pro" \
  --brand-id "daler-rowney-prof"
```
