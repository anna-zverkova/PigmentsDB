#!/usr/bin/env node
/**
 * Import Ken Bromley watercolor paints from a saved Dr. Oto Kano HTML page.
 *
 * - Parses the paint table from the archived HTML
 * - Matches swatches by filename from public/uploads/ken-bromley
 * - Downloads any missing swatch from the archived source URL
 * - Appends new paint rows to content/paints.json
 *
 * Usage:
 *   node scrapers/import_ken_bromley_from_html.mjs \
 *     --html "Ken Bromley - Watercolor Paints Database - - Dr. Oto Kano.html" \
 *     --paints "content/paints.json" \
 *     --uploads-dir "public/uploads/ken-bromley" \
 *     --brand-id "ken-bromley"
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_HTML = 'Ken Bromley - Watercolor Paints Database - - Dr. Oto Kano.html';
const DEFAULT_PAINTS = 'content/paints.json';
const DEFAULT_UPLOADS_DIR = 'public/uploads/ken-bromley';
const DEFAULT_BRAND_ID = 'ken-bromley';

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
  if (!table) throw new Error('Could not find the Ken Bromley paint table.');

  const rows = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .slice(1)
    .map((m) => m[1]);

  return rows.map((row) => [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) => m[1]));
}

function parseImageInfo(cellHtml) {
  const srcMatch = cellHtml.match(/src="([^"]+)"/i);
  const dataSrcMatch = cellHtml.match(/data-src="([^"]+)"/i);
  const src = srcMatch?.[1] || '';
  const dataSrc = dataSrcMatch?.[1] || '';
  return {
    src,
    dataSrc,
    filename: src ? path.basename(src) : dataSrc ? path.basename(new URL(dataSrc).pathname) : '',
  };
}

function toTransparency(value) {
  const normalized = stripTags(value).toUpperCase();
  if (normalized === 'O') return 'Opaque';
  if (normalized === 'SO') return 'Semi-Opaque';
  if (normalized === 'ST') return 'Semi-Transparent';
  if (normalized === 'T') return 'Transparent';
  return '—';
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

async function ensureFileExists(filePath, sourceUrl) {
  try {
    await fs.access(filePath);
    return 'skipped';
  } catch {
    if (!sourceUrl) return 'missing';
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return 'missing';
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, bytes);
    return 'downloaded';
  }
}

async function main() {
  const htmlPath = path.resolve(repoRoot, argValue('--html', DEFAULT_HTML));
  const paintsPath = path.resolve(repoRoot, argValue('--paints', DEFAULT_PAINTS));
  const uploadsDir = path.resolve(repoRoot, argValue('--uploads-dir', DEFAULT_UPLOADS_DIR));
  const brandId = argValue('--brand-id', DEFAULT_BRAND_ID);

  const [html, paintsJson] = await Promise.all([
    fs.readFile(htmlPath, 'utf8'),
    fs.readFile(paintsPath, 'utf8'),
  ]);

  const rows = parseTableRows(html);
  const paintsData = JSON.parse(paintsJson);
  const paints = paintsData.items || [];
  const existingIds = new Set(paints.map((paint) => paint.id));
  const existingByName = new Map(
    paints
      .filter((paint) => paint.brandId === brandId)
      .map((paint) => [String(paint.name).trim().toLowerCase(), paint])
  );

  let added = 0;
  let updatedSwatches = 0;
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
    const lightfastness = stripTags(cells[8]) || 'Unknown';
    const staining = stripTags(cells[9]) || '—';
    const granulation = stripTags(cells[10]) || '—';
    const transparency = toTransparency(cells[11]);
    const isVegan = stripTags(cells[12]).toUpperCase() === 'V';

    if (!name) continue;

    const baseId = `${brandId}-${slugify(name)}`;
    const paintId = uniqueId(baseId, existingIds);
    const swatchFilename = swatchInfo.filename || `${slugify(name)}.png`;
    const swatchFilePath = path.join(uploadsDir, swatchFilename);
    const localSwatchPath = `/uploads/ken-bromley/${swatchFilename}`;
    const imageUrl = swatchInfo.dataSrc || '';

    const swatchState = await ensureFileExists(swatchFilePath, imageUrl);
    if (swatchState !== 'missing') {
      updatedSwatches += 1;
    } else {
      console.warn(`Missing swatch for ${name}; leaving swatchImage blank.`);
    }

    const existing = existingByName.get(name.toLowerCase());
    if (existing) {
      if (!existing.swatchImage && swatchState !== 'missing') {
        existing.swatchImage = localSwatchPath;
      }
      if (!existing.hex) {
        existing.hex = '#E6D9C6';
      }
      seenNames.add(name.toLowerCase());
      continue;
    }

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
      isVegan,
      isDiscontinued: false,
      hue: hue && hue !== '–' ? hue : '–',
      ...(swatchState === 'missing' ? {} : { swatchImage: localSwatchPath }),
    });
    added += 1;
    seenNames.add(name.toLowerCase());
  }

  paintsData.items = paints;
  await fs.writeFile(paintsPath, `${JSON.stringify(paintsData, null, 2)}\n`, 'utf8');

  console.log(`Added ${added} paints to ${paintsPath}`);
  console.log(`Processed ${rows.length} Ken Bromley rows`);
  console.log(`Swatches ensured in ${uploadsDir}`);
  console.log(`Existing Ken Bromley rows updated: ${seenNames.size - added}`);
  console.log(`Swatches downloaded or verified: ${updatedSwatches}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
