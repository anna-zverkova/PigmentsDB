# 1. What Is TintMap?
PM focus: You need a crisp product definition, who it serves, and where it stands today so you can prioritize improvements without re-deriving context.

TintMap is a non-profit, solo‑creator pigment atlas for watercolour artists. It exists to make pigment codes (Colour Index names like PB29, PV19) and paint performance attributes readable, comparable, and brand‑agnostic. The intent is practical: help artists buy smarter, avoid mismatched pigments, and understand how different brands interpret the same pigment.

**How TintMap differs from other databases**
| Site | How it differs | Why TintMap exists alongside it |
|---|---|---|
| handprint.com | Deep theory and pigment research, not a structured searchable catalog | TintMap emphasizes structured, searchable data and cross‑brand comparison [INFERRED — verify] |
| paintingwithpalettes.com | Swatch‑driven catalog, less focused on pigment code mapping | TintMap is explicitly pigment‑code‑first and includes performance attributes [INFERRED — verify] |

**Current state snapshot (from data files)**
| Metric | Value | Source |
|---|---|---|
| Active brands | 6 | `content/paints.json` + `content/brands.json` |
| Paint count | 652 | `content/paints.json` |
| Single‑pigment paints | 374 | `content/paints.json` |

**Active brands**
| Brand | Status |
|---|---|
| Daniel Smith | Professional |
| Holbein | Professional |
| Schmincke | Professional |
| White Nights | Professional |
| Winsor & Newton Professional | Professional |
| Winsor & Newton Cotman | Student |

**Roadmap brands (coming soon)**
| Brand |
|---|
| Art Spectrum |
| Blick Own Brand |
| Blockx |
| Cass Arts Own Brand |
| Da Vinci Paints |
| Daler Rowney Professional |
| Daler Rowney Aquafine |
| Grumbacher Finest |
| Grumbacher Academy |
| Isaro |
| Jackson's Own Brand |
| Ken Bromley Own Brand |
| Kusakabe |
| Lukas Aquarell |
| Lutea |
| M. Graham |
| MaimeriBlu |
| Mijello Mission Gold |
| Old Holland |
| QoR |
| Rembrandt |
| Renesans (Pans) |
| Renesans (Tubes) |
| Roman Szmal |
| Sennelier |
| ShinHan Pro (Students) |
| ShinHan PWC (Artist's) |
| Turner |
| Utrecht |
| Van Gogh |
| Prima Marketing |

[IMAGE: Screenshot of the Home page hero and navigation]

---

# 2. How the Site Works (Technical Architecture)
PM focus: You need a mental map of what runs where, what can break, and how updates move from data to live site.

**Static site overview**
TintMap is a static site built with React + Vite, deployed to GitHub Pages. There is no backend API. All data is local JSON that ships with the site. TinaCMS runs **only in local development** (no server means no live admin on Pages).

**Repository structure (key parts)**
| Path | Purpose |
|---|---|
| `content/` | JSON data for paints, pigments, brands, home copy |
| `pages/` | Route pages (Paints, Pigments, Brands, Compare, Detail views) |
| `components/` | Shared UI (Layout, Card, Button, ComparisonBar) |
| `public/uploads/` | Swatch images (brand folders) |
| `tina/` | TinaCMS config + generated schema |
| `vite.config.ts` | Vite config and dev proxy for Tina |
| `index.html` | Tailwind config, fonts, SPA redirect script |
| `docs/` | Technical documentation (this folder) |

**Routing (hash‑based)**
GitHub Pages doesn’t support server‑side routing, so the app uses `HashRouter`.

| Route | Description |
|---|---|
| `/#/` | Home |
| `/#/pigments/:family` | Pigment families browser |
| `/#/brands` | Brands overview |
| `/#/brands/:id` | Brand detail page |
| `/#/paints` | Paints library |
| `/#/paints/:id` | Paint detail page |
| `/#/compare` | Compare view |

**Data layer**
Data is loaded from JSON files and exported in `constants.ts`:
- `PAINTS` from `content/paints.json`
- `PIGMENTS` from `content/pigments.json`
- `BRANDS` from `content/brands.json`

All filtering and search is client‑side.

**Build & deployment**
| Step | Command | Notes |
|---|---|---|
| Dev | `npm run dev` | TinaCMS runs locally |
| Build (Pages) | `npm run build:pages` | Vite build only |
| Deploy | GitHub Actions (`.github/workflows/deploy.yml`) | Pages artifact from `dist/` |

**Dependencies & tooling**
| Tool | Use |
|---|---|
| React 19 | UI |
| Vite | Build + dev server |
| TinaCMS | Local content editing |
| Tailwind (CDN) | Styling |
| React Router | Hash‑based routing |

[IMAGE: High‑level architecture diagram — Static site + JSON data + local CMS]

---

# 3. The Data Model — Paints & Pigments
PM focus: You need to know exactly what’s in each paint record, how to interpret it, and how data quality is handled so you can prioritize cleanup or expansion.

**Paint field reference**
| Field | Type | Required | Meaning | Example |
|---|---|---|---|---|
| `id` | string | Yes | Unique paint slug (brand + name + number + optional version) | `winsor-newton-professional-winsor-lemon-123` |
| `brandId` | string | Yes | Brand key from `content/brands.json` | `ds` |
| `name` | string | Yes | Paint name | `Ultramarine Blue` |
| `pigmentCodes` | string[] | Yes | Colour Index pigment codes | `PB29`, `PV19` |
| `hue` | string | Optional | Hue label from source table | `Blue` or `—` |
| `paintNumber` | string | Optional | Brand’s SKU / number | `284600179` |
| `series` | string | Optional | Brand tier | `1`, `2`, `A` |
| `hex` | string | Yes | Fallback color (used if no swatch image) | `#1C1C75` |
| `swatchImage` | string | Optional | Swatch image path in `public/uploads/...` | `/uploads/white-nights/WH-Zinc-white.png` |
| `lightfastness` | string | Optional | Lightfastness rating (I/II or 3/4 etc.) | `3/4`, `I` |
| `transparency` | string | Optional | Transparency rating | `Transparent` |
| `staining` | string | Optional | Staining rating | `Medium-Staining` |
| `granulation` | string | Optional | Granulation | `Low` |
| `stainingVsLifting` | string | Optional | Lifting behavior | `Easy to lift` |
| `flow` | string | Optional | Flow / spread | `High` |
| `tintingStrength` | string | Optional | Tinting strength | `High` |
| `performance` | string | Optional | Professional/Student | `Professional` |
| `toxicity` | string | Optional | Toxicity notes | `None` |
| `isVegan` | boolean | Optional | Vegan flag | `true` |
| `isDiscontinued` | boolean | Optional | Discontinued status | `false` |
| `collection` | string | Optional | Sub‑line or series | `Standard Assortment` |

**Pigment field reference**
| Field | Type | Required | Meaning | Example |
|---|---|---|---|---|
| `code` | string | Yes | Colour Index code | `PB29` |
| `name` | string | Optional | Pigment common name | `Ultramarine Blue` |
| `family` | string | Yes | Family | `Blue` |
| `description` | string | Optional | Short note | `The standard warm blue.` |
| `toxicity` | string | Optional | Toxicity | `None` |

**Colour Index naming convention**
| Element | Meaning | Example |
|---|---|---|
| `P` | Pigment | `P` in `PB29` |
| `B` | Color family (Blue) | `B` in `PB29` |
| `29` | Pigment index | `29` in `PB29` |
| `:3` | Variant/sub‑index | `PB15:3` |

**Multi‑pigment handling**
- Multiple pigments are stored as an array in `pigmentCodes`.
- Filtering by family uses the pigment code → family map in `content/pigments.json`.

**Variants / multiple formulas**
- When two paints share the same brand + name + number, IDs are made unique with `-v2`, `-v3`, etc.
- The UI currently treats them as separate paints; no special “variant grouping” exists. [INFERRED — verify in code]

**Data quality flags**
| Value | Meaning |
|---|---|
| `Unknown` | Data not provided by source |
| `—` | Explicitly blank/unknown placeholder |
| `Not listed by producer` | Missing from manufacturer documentation [INFERRED — verify] |

**Special pigment types**
| Type | How represented |
|---|---|
| Mica / Iridescent | Included as pigment codes (may be literal strings if not CIN) |
| Duochrome / Chameleon | Typically listed in `collection` or name; pigment code may be non‑CIN |

---

# 4. Feature Guide
PM focus: You need to know how each feature works, what its current limits are, and what the easiest improvements are.

### 4.1 Pigment Families Browser
| Aspect | Detail |
|---|---|
| What it does | Lists pigments by color family and shows paints for each pigment |
| How it works | Filters `PIGMENTS` by family; filters `PAINTS` by pigment code |
| User flow | Choose family → click pigment pill → scroll to pigment table |
| Limitations | Pigment `name` may be placeholder; not all pigments have descriptions |
| Improvement ideas | Add pigment descriptions from a trusted source, add “popular paints” filter |

### 4.2 Brands Browser (including coming‑soon state)
| Aspect | Detail |
|---|---|
| What it does | Shows active brands (with paints) and coming‑soon brands |
| How it works | Active = `PAINTS.brandId` exists; coming‑soon otherwise |
| Status tint | Professional = light green; Student = light yellow |
| Limitations | Brand descriptions mostly empty |
| Improvement ideas | Add brand summaries and official URLs |

### 4.3 Paints Library & Filtering
| Aspect | Detail |
|---|---|
| What it does | Search and filter paints by brand and pigment family |
| How it works | Client‑side filter on `PAINTS` |
| Limitations | No pagination; all paints loaded in memory |
| Improvement ideas | Add multi‑select filters for lightfastness/granulation/staining |

### 4.4 Signal‑Rich Search
| Aspect | Detail |
|---|---|
| What it does | Search by name or pigment code |
| How it works | Simple string match on `PAINTS` |
| Limitations | No fuzzy matching, no facets |
| Improvement ideas | Add tokenized search, auto‑suggest, or Fuse.js |

### 4.5 Side‑by‑Side Compare
| Aspect | Detail |
|---|---|
| What it does | Compare up to 4 paints |
| How it works | Stored in React context (`useComparison`) |
| Limitations | No persistence across refresh |
| Improvement ideas | Persist to URL or localStorage |

### 4.6 Individual Paint Detail Pages
| Aspect | Detail |
|---|---|
| What it does | Shows full data for a paint |
| How it works | Route lookup by paint `id` |
| Limitations | No related paints or pigment links |
| Improvement ideas | Add “same pigment” and “same brand” links |

### 4.7 Admin Panel
| Aspect | Detail |
|---|---|
| What it does | Local editing of JSON content |
| How it works | TinaCMS with LocalAuthProvider |
| Limitations | Not available on GitHub Pages |
| Improvement ideas | Add a hosted Tina backend or a GitHub‑based editor workflow |

### 4.8 Global Search Bar
| Aspect | Detail |
|---|---|
| What it does | UI input in header |
| How it works | Currently cosmetic; no handler wired [INFERRED — verify] |
| Improvement ideas | Hook into paints search or a global search modal |

### 4.9 Newsletter
| Aspect | Detail |
|---|---|
| What it does | Email input in footer |
| How it works | UI only; no backend integration [INFERRED — verify] |
| Improvement ideas | Connect to Buttondown, ConvertKit, or Mailchimp |

---

# 5. How to Add & Update Content
PM focus: You need repeatable steps that don’t depend on tribal knowledge.

**Add a new brand and its paint library**
| Step | Action |
|---|---|
| 1 | Add brand to `content/brands.json` (name, id, status, country) |
| 2 | Add paint records to `content/paints.json` with `brandId` |
| 3 | Add swatches under `public/uploads/<brand>` and reference `swatchImage` |
| 4 | Verify on `/brands` and `/paints` pages |

**Add individual paint records**
| Step | Action |
|---|---|
| 1 | Append to `content/paints.json` |
| 2 | Ensure unique `id` (brand + name + number + optional `-v2`) |
| 3 | Include `pigmentCodes`, `lightfastness`, and `swatchImage` if available |

**Add a new pigment code**
| Step | Action |
|---|---|
| 1 | Add pigment to `content/pigments.json` |
| 2 | Ensure correct `family` for filtering |
| 3 | Optional: add `description` and `toxicity` |

**Update existing paint data**
| Step | Action |
|---|---|
| 1 | Find record in `content/paints.json` |
| 2 | Update only the target field |
| 3 | Keep `id` stable unless it’s wrong or non‑unique |

**Update White Nights swatches from new files**
| Step | Action |
|---|---|
| 1 | Add new image files to `public/uploads/white-nights` |
| 2 | Run the auto‑assign script below |
| 3 | Verify swatches appear on `/paints` and `/brands/white-nights` |

```bash
python scrapers/update_white_nights_swatches.py \
  --paints "content/paints.json" \
  --swatch-dir "public/uploads/white-nights"
```

**Promote brand from “coming soon” to active**
| Step | Action |
|---|---|
| 1 | Add at least one paint with that `brandId` |
| 2 | Brand automatically becomes active on `/brands` |

**Managing variants**
| Rule | Detail |
|---|---|
| Duplicate names | Append `-v2`, `-v3` in `id` |
| Variants | Treat as separate paints until a variant model is introduced |

---

# 6. Product Improvement Opportunities
PM focus: You want a prioritized, realistic roadmap for a solo creator.

**Data completeness**
| Priority | Opportunity |
|---|---|
| High | Fill missing `lightfastness`, `hue`, `granulation`, `transparency` |
| Medium | Add missing `series` / `collection` / `paintNumber` |
| Low | Normalize pigment names across brands |

**UX improvements**
| Priority | Opportunity |
|---|---|
| High | Add filter chips for lightfastness / granulation / transparency |
| Medium | Add “clear filters” and saved views |
| Low | Global search modal |

**Compare feature**
| Priority | Opportunity |
|---|---|
| High | Persist compare selection to URL/localStorage |
| Medium | Add “export compare” view |

**Mobile experience**
| Priority | Opportunity |
|---|---|
| Medium | Sticky filter drawer for paints |
| Low | Compact compare table |

**New features artists would value**
| Priority | Opportunity |
|---|---|
| High | Palette builder + saved palettes |
| Medium | Mixing prediction or “closest match” |
| Low | Community swatch uploads |

**SEO & discoverability**
| Priority | Opportunity |
|---|---|
| High | Generate static metadata per brand/pigment page |
| Medium | Add sitemap.xml + structured data |

**Brand expansion strategy**
| Priority | Opportunity |
|---|---|
| High | Prioritize global top 5 brands by availability |
| Medium | Add student lines for affordability coverage |

---

# 7. Domain Glossary
PM focus: You need canonical definitions so the UI, data, and copy stay consistent.

| Term | Definition |
|---|---|
| Colour Index Name (CIN) | Standardized pigment code system (e.g., PB29). P = pigment, B = blue, 29 = index. |
| Lightfastness | Resistance to fading; ASTM ratings I/II/III or fractional ratings (3/4, 4/4). |
| Granulation | Particle behavior that creates texture in washes. |
| Transparency | Degree to which paint lets light through (transparent → opaque). |
| Staining | How deeply pigment binds to paper fibers. |
| Lifting | How easily a pigment can be lifted after drying. |
| Hue | “Hue” in paint names means a pigment substitute for a traditional color. |
| Tinting strength | How strongly a color influences mixtures. |
| Performance grade | Professional vs Student quality tiers. |
| Vegan | No animal‑derived components. |
| Mica | Reflective pigment used for metallic/iridescent paints. |
| Duochrome | Pigment that shifts color based on angle or light. |
| Chameleon | Multi‑shift effect pigment (extreme color shift). |
| Series | Brand pricing tier or grade within a line. |
| Collection | Brand sub‑line (e.g., Granulating, Limited Edition). |

---

# 8. Quick Reference for the PM
PM focus: You need a one‑page operational snapshot so you can plan without diving into code.

**Essentials**
| Item | Value |
|---|---|
| Live site | https://tintmap.com |
| Repo | `/Users/annazverkova/Documents/PigmentsDB` (local) |
| Active brands | 6 |
| Paint count | 652 |

**Feature status**
| Feature | Status |
|---|---|
| Pigment Families Browser | Live |
| Brands Browser (active + coming soon) | Live |
| Paints Library & Filtering | Live |
| Signal‑Rich Search | Live (basic) |
| Side‑by‑Side Compare | Live |
| Paint Detail Pages | Live |
| Admin Panel (local) | Live (local only) |
| Global Search Bar | UI only [INFERRED — verify] |
| Newsletter | UI only [INFERRED — verify] |

**Brands roadmap**
| Coming soon |
|---|
| Art Spectrum, Blick Own Brand, Blockx, Cass Arts Own Brand, Da Vinci Paints, Daler Rowney Professional, Daler Rowney Aquafine, Grumbacher Finest, Grumbacher Academy, Isaro, Jackson's Own Brand, Ken Bromley Own Brand, Kusakabe, Lukas Aquarell, Lutea, M. Graham, MaimeriBlu, Mijello Mission Gold, Old Holland, QoR, Rembrandt, Renesans (Pans), Renesans (Tubes), Roman Szmal, Sennelier, ShinHan Pro (Students), ShinHan PWC (Artist's), Turner, Utrecht, Van Gogh, Prima Marketing |

**Key decisions log (why it’s built this way)**
| Decision | Reason |
|---|---|
| HashRouter | GitHub Pages cannot serve deep links |
| JSON data in repo | Simple, transparent, and offline‑editable |
| Local TinaCMS only | No backend required for a passion project |
| Swatch images in `/public/uploads` | Keep the site fully static |

[IMAGE: Summary dashboard mockup showing counts and status]
