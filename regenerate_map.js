#!/usr/bin/env node
/**
 * regenerate_map.js
 * Regenera map.json incluyendo todas las imágenes WebP actuales
 * y sus versiones optimizadas.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = '/home/masterenherramientas/master-herramientas';
const IMG_DIR = path.join(ROOT, 'assets/imagenes');
const OPT_DIR = path.join(IMG_DIR, '_optimized');
const MAP_PATH = path.join(OPT_DIR, 'map.json');

const WIDTHS = [400, 800, 1200];

async function getDims(file) {
  const meta = await sharp(file).metadata();
  return { width: meta.width, height: meta.height };
}

async function main() {
  console.log('Regenerando map.json...');

  const map = {};

  // Find all WebP files (not in _optimized subdirs)
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === '_optimized') continue;
        walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (ext === '.webp') {
          files.push(full);
        }
      }
    }
  }
  walk(IMG_DIR);

  console.log('WebP files found:', files.length);

  for (const abs of files) {
    const rel = path.relative(IMG_DIR, abs).replace(/\\/g, '/');
    if (rel.startsWith('_optimized/')) continue;

    const dims = await getDims(abs);

    // Find optimized versions
    const sizes = [];
    for (const w of WIDTHS) {
      if (w > dims.width) continue;
      const optPath = path.join(OPT_DIR, rel.replace(/\.webp$/, '') + '-' + w + '.webp');
      const optRel = '_optimized/' + rel.replace(/\.webp$/, '') + '-' + w + '.webp';
      if (fs.existsSync(optPath)) {
        const optMeta = await sharp(optPath).metadata();
        sizes.push({
          rel: optRel,
          width: optMeta.width,
          height: optMeta.height
        });
      }
    }

    const dir = path.dirname(rel);
    const base = path.basename(rel, '.webp');

    map[rel] = {
      base,
      dir: dir === '.' ? '' : dir,
      original: rel,
      originalSize: { width: dims.width, height: dims.height },
      sizes
    };
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
  console.log('Map saved with', Object.keys(map).length, 'entries');
  console.log('Done.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
