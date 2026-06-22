#!/usr/bin/env node
/**
 * Import Renesans watercolor paints from the saved Dr. Oto Kano HTML pages.
 *
 * - Parses both the Extra Fine (Pans) and Intense (Tubes) paint tables
 * - Matches swatches only against public/uploads/renesans
 * - Leaves swatchImage blank when the local swatch file does not exist
 * - Uses collection to distinguish the two product lines
 * - Appends new paint rows to content/paints.json
 *
 * Usage:
 *   node scrapers/import_renesans_from_html.mjs \
 *     --pans-html "Renesans Extra Fine (Pans) - Paint Database - Dr. Oto Kano.html" \
 *     --tubes-html "Renesans Intense (Tubes) - Paint Database - Dr. Oto Kano.html" \
 *     --paints "content/paints.json" \
 *     --uploads-dir "public/uploads/renesans" \
 *     --brand-id "renesans"
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PANS_HTML = 'Renesans Extra Fine (Pans) - Paint Database - Dr. Oto Kano.html';
const DEFAULT_TUBES_HTML = 'Renesans Intense (Tubes) - Paint Database - Dr. Oto Kano.html';
const DEFAULT_PAINTS = 'content/paints.json';
const DEFAULT_UPLOADS_DIR = 'public/uploads/renesans';
const DEFAULT_BRAND_ID = 'renesans';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function argValue(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx === process.argv.length - 1) return fallback;
  return process.argv[idx + 1];
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeEntities(text) {
  return String(text)
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&quot;/g, '"');
}

function stripTags(html) {
  return decodeEntities(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTableRows(html) {
  const tables = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)].map((m) => m[1]);
  const table = tables.find((t) => t.includes('<thead>') && t.includes('Pigment(s)'));
  if (!table) throw new Error('Could not find the Renesans paint table.');

  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .slice(1)
    .map((m) => m[1]);

  return rows.map((row) => [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => m[1]));
}

function parseImageInfo(cellHtml) {
  const srcMatch = cellHtml.match(/src="([^"]+)"/i) || cellHtml.match(/data-src="([^"]+)"/i);
  const src = srcMatch?.[1] || '';
  return {
    src,
    filename: src ? path.basename(src) : '',
  };
}

function toLightfastness(value) {
  const normalized = stripTags(value);
  return normalized && normalized !== '–' && normalized !== '—' ? normalized : null;
}

function toStaining(value) {
  const normalized = stripTags(value).toLowerCase();
  if (!normalized || normalized === '–' || normalized === '—') return null;
  if (normalized === 'stain') return 'Staining';
  if (normalized === 'non') return 'Non-Staining';
  return normalized;
}

function toGranulation(value) {
  const normalized = stripTags(value).toUpperCase();
  if (!normalized || normalized === '–' || normalized === '—') return null;
  if (normalized === 'NG') return 'None';
  if (normalized === 'G') return 'High';
  return normalized;
}

function toTransparency(value) {
  const normalized = stripTags(value).toUpperCase();
  if (normalized === 'O') return 'Opaque';
  if (normalized === 'SO') return 'Semi-Opaque';
  if (normalized === 'ST') return 'Semi-Transparent';
  if (normalized === 'T') return 'Transparent';
  return null;
}

function uniqueId(baseId, existingIds) {
  if (!existingIds.has(baseId)) {
    existingIds.add(baseId);
    return baseId;
  }

  let index = 2;
  while (existingIds.has(`${baseId}-v${index}`)) index += 1;
  const id = `${baseId}-v${index}`;
  existingIds.add(id);
  return id;
}

function matchSwatchFilename(uploadByLowerName, candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const hit = uploadByLowerName.get(candidate.toLowerCase());
    if (hit) return hit;
  }
  return '';
}

function normalizeLine(collection) {
  return collection.replace(/\s+/g, ' ').trim();
}

function buildCandidates(name, prefix, filename, stripPrimary = false) {
  const normalizedSlug = slugify(name);
  const candidates = [filename];

  if (prefix) {
    candidates.push(`${prefix}-${normalizedSlug}.png`);
    candidates.push(`${prefix}${normalizedSlug}.png`);
  }

  candidates.push(`${normalizedSlug}.png`);

  if (stripPrimary) {
    const noPrimary = slugify(name.replace(/\s*\(Primary\)\s*/i, ' '));
    candidates.push(`${prefix}-${noPrimary}.png`);
    candidates.push(`${noPrimary}.png`);
  }

  return [...new Set(candidates.filter(Boolean))];
}

async function importSource({
  htmlPath,
  paints,
  existingIds,
  existingByName,
  uploadByLowerName,
  uploadsDir,
  brandId,
  collection,
  prefix,
  stripPrimary = false,
}) {
  const html = await fs.readFile(htmlPath, 'utf8');
  const rows = parseTableRows(html);

  let added = 0;
  let linkedSwatches = 0;
  let missingSwatches = 0;
  const seenNames = new Set();

  for (const cells of rows) {
    if (cells.length < 13) continue;

    const pigmentCodes = stripTags(cells[0])
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const name = stripTags(cells[1]);
    const hue = stripTags(cells[2]);
    const swatchInfo = parseImageInfo(cells[4]);
    const swatchFilename = matchSwatchFilename(
      uploadByLowerName,
      buildCandidates(name, prefix, swatchInfo.filename, stripPrimary)
    );
    const localSwatchPath = swatchFilename ? `/uploads/renesans/${swatchFilename}` : '';
    const lightfastness = toLightfastness(cells[8]) || 'Unknown';
    const staining = toStaining(cells[9]);
    const granulation = toGranulation(cells[10]);
    const transparency = toTransparency(cells[11]);
    const vegan = stripTags(cells[12]).toLowerCase();
    const collectionLabel = normalizeLine(collection);

    if (!name) continue;

    const existing = existingByName.get(`${collectionLabel.toLowerCase()}|${name.toLowerCase()}`);
    if (existing) {
      if (!existing.swatchImage && localSwatchPath) {
        existing.swatchImage = localSwatchPath;
      }
      if (!existing.hex) {
        existing.hex = '#E6D9C6';
      }
      seenNames.add(name.toLowerCase());
      continue;
    }

    if (localSwatchPath) linkedSwatches += 1;
    else missingSwatches += 1;

    const baseId = `${brandId}-${slugify(collectionLabel)}-${slugify(name)}`;
    const paintId = uniqueId(baseId, existingIds);

    paints.push({
      id: paintId,
      brandId,
      name,
      pigmentCodes,
      hex: '#E6D9C6',
      transparency,
      staining,
      granulation,
      lightfastness,
      isVegan: vegan === 'no' ? false : vegan === 'yes' ? true : null,
      isDiscontinued: false,
      performance: 'Professional',
      collection: collectionLabel,
      hue: hue && hue !== '–' && hue !== '—' ? hue : '—',
      ...(localSwatchPath ? { swatchImage: localSwatchPath } : {}),
    });
    added += 1;
    seenNames.add(name.toLowerCase());
  }

  return {
    rows: rows.length,
    added,
    linkedSwatches,
    missingSwatches,
    updates: seenNames.size - added,
  };
}

async function main() {
  const pansHtmlPath = path.resolve(repoRoot, argValue('--pans-html', DEFAULT_PANS_HTML));
  const tubesHtmlPath = path.resolve(repoRoot, argValue('--tubes-html', DEFAULT_TUBES_HTML));
  const paintsPath = path.resolve(repoRoot, argValue('--paints', DEFAULT_PAINTS));
  const uploadsDir = path.resolve(repoRoot, argValue('--uploads-dir', DEFAULT_UPLOADS_DIR));
  const brandId = argValue('--brand-id', DEFAULT_BRAND_ID);

  const [paintsJson, uploadNames] = await Promise.all([
    fs.readFile(paintsPath, 'utf8'),
    fs.readdir(uploadsDir).catch(() => []),
  ]);

  const uploadByLowerName = new Map(uploadNames.map((file) => [file.toLowerCase(), file]));
  const paintsData = JSON.parse(paintsJson);
  const paints = paintsData.items || [];
  const existingIds = new Set(paints.map((paint) => paint.id));
  const existingByName = new Map(
    paints
      .filter((paint) => paint.brandId === brandId)
      .map((paint) => [`${String(paint.collection || '').trim().toLowerCase()}|${String(paint.name).trim().toLowerCase()}`, paint])
  );

  const pans = await importSource({
    htmlPath: pansHtmlPath,
    paints,
    existingIds,
    existingByName,
    uploadByLowerName,
    uploadsDir,
    brandId,
    collection: 'Extra Fine (Pans)',
    prefix: 'RENE',
    stripPrimary: true,
  });

  const tubes = await importSource({
    htmlPath: tubesHtmlPath,
    paints,
    existingIds,
    existingByName,
    uploadByLowerName,
    uploadsDir,
    brandId,
    collection: 'Intense (Tubes)',
    prefix: 'RT',
  });

  paintsData.items = paints;
  await fs.writeFile(paintsPath, `${JSON.stringify(paintsData, null, 2)}\n`, 'utf8');

  console.log(`Added ${pans.added + tubes.added} paints to ${paintsPath}`);
  console.log(`Processed ${pans.rows} Renesans Extra Fine (Pans) rows`);
  console.log(`Processed ${tubes.rows} Renesans Intense (Tubes) rows`);
  console.log(`Local swatches checked in ${uploadsDir}`);
  console.log(`Local swatches linked: ${pans.linkedSwatches + tubes.linkedSwatches}`);
  console.log(`Missing swatches left blank: ${pans.missingSwatches + tubes.missingSwatches}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
