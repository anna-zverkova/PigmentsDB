const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const paintsPath = path.join(root, 'content', 'paints.json');
const homePath = path.join(root, 'content', 'home.json');

const paints = JSON.parse(fs.readFileSync(paintsPath, 'utf8'));
const home = JSON.parse(fs.readFileSync(homePath, 'utf8'));

const featuredPaints = (paints.items || [])
  .filter((paint) => paint && paint.isFeatured === true)
  .map((paint) => ({ paintId: paint.id }));

home.featured = home.featured || {};
home.featured.items = featuredPaints;

fs.writeFileSync(homePath, JSON.stringify(home, null, 2) + '\n');

console.log(`Synced ${featuredPaints.length} featured paints into content/home.json`);
