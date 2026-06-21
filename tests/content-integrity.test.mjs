import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const fileExists = (relativePath) => fs.existsSync(path.join(root, relativePath));

const brands = readJson('content/brands.json').items ?? [];
const paints = readJson('content/paints.json').items ?? [];
const home = readJson('content/home.json');
const blogs = readJson('content/blogs.json');

const brandIds = new Set(brands.map((brand) => brand.id));
const paintById = new Map(paints.map((paint) => [paint.id, paint]));

test('paint ids are unique', () => {
  assert.equal(paintById.size, paints.length);
});

test('every paint references a known brand', () => {
  const unknownBrands = paints.filter((paint) => !brandIds.has(paint.brandId)).map((paint) => paint.id);
  assert.deepEqual(unknownBrands, []);
});

test('paint pigment codes are present as strings', () => {
  const malformed = paints
    .flatMap((paint) =>
      (paint.pigmentCodes ?? [])
        .filter((code) => typeof code !== 'string' || code.trim().length === 0)
        .map((code) => `${paint.id}:${String(code)}`)
    );

  assert.deepEqual(malformed, []);
});

test('repaired swatches exist on disk', () => {
  const requiredSwatches = [
    'public/uploads/sennelier/SE-Perylene-Brown.png',
    'public/uploads/sennelier/SE-Hookers-Green.png',
    'public/uploads/sennelier/SE-Paynes-Grey.png',
    'public/uploads/turner/TU-turners-yellow.png',
  ];
  const missingSwatches = requiredSwatches.filter((relativePath) => !fileExists(relativePath));

  assert.deepEqual(missingSwatches, []);
});

test('home featured paints exist and are marked featured', () => {
  const featuredIds = (home.featured?.items ?? []).map((item) => item.paintId);
  const missing = [];
  const unfeatured = [];

  for (const id of featuredIds) {
    const paint = paintById.get(id);
    if (!paint) {
      missing.push(id);
    } else if (paint.isFeatured !== true) {
      unfeatured.push(id);
    }
  }

  assert.deepEqual(missing, []);
  assert.deepEqual(unfeatured, []);
});

test('featured blog article exists', () => {
  const featuredId = blogs.featured?.articleId;
  if (!featuredId) {
    assert.fail('blogs.featured.articleId is missing');
  }

  const articleExists = (blogs.articles ?? []).some((article) => article.id === featuredId);
  assert.equal(articleExists, true);
});
