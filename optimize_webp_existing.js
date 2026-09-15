#!/usr/bin/env node
/**
 * optimize_webp_existing.js
 * Genera tamaños para los archivos .webp que ya existen (no cubiertos por optimize_images.js)
 * y los añade al map.json existente.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;

// Localizar map.json dinámicamente (evita problemas de capitalización)
const MAP_PATH = (() => {
  const out = execSync(`find "${ROOT}/assets" -name "map.json" 2>/dev/null | head -1`, { encoding: 'utf8' }).trim();
  if (!out) throw new Error('No se encontró map.json');
  return out;
})();

const IMG_DIR = path.dirname(MAP_PATH); // assets/Imagenes/_optimized
const IMG_ROOT = path.dirname(IMG_DIR); // assets/Imagenes

const WIDTHS = [400, 800, 1200];
const QUALITY = 80;

function log(msg) { console.log(msg); }

async function ensureDir(p) {
  if (!fs.existsSync(p)) await fs.promises.mkdir(p, { recursive: true });
}

async function convertOne(srcAbs, relDir, baseName, width) {
  const outRel = path.join('_optimized', relDir, `${baseName}-${width}.webp`);
  const outAbs = path.join(IMG_DIR, outRel);
  await ensureDir(path.dirname(outAbs));
  const meta = await sharp(srcAbs).metadata();
  const targetWidth = Math.min(width, meta.width);
  const targetHeight = Math.round((meta.height * targetWidth) / meta.width);
  await sharp(srcAbs)
    .resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, smartSubsample: true })
    .toFile(outAbs);
  return { rel: outRel, width: targetWidth, height: targetHeight };
}

async function main() {
  console.log('MAP_PATH:', MAP_PATH);
  console.log('IMG_ROOT:', IMG_ROOT);

  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  const existingKeys = new Set(Object.keys(map));

  const files = [];
  function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === '_optimized') continue;
        walk(full);
      } else if (e.isFile() && path.extname(e.name).toLowerCase() === '.webp') {
        files.push(full);
      }
    }
  }
  walk(IMG_ROOT);

  let processed = 0;
  for (const abs of files) {
    const rel = path.relative(IMG_ROOT, abs);
    if (existingKeys.has(rel)) continue;
    const relDir = path.dirname(rel);
    const base = path.basename(rel, '.webp');
    const meta = await sharp(abs).metadata();
    const sizes = [];
    for (const w of WIDTHS) {
      if (w > meta.width) continue;
      try {
        sizes.push(await convertOne(abs, relDir, base, w));
      } catch (err) {
        log(`  ERROR ${rel} @${w}px: ${err.message}`);
      }
    }
    map[rel] = { base, dir: relDir, original: rel, originalSize: { width: meta.width, height: meta.height }, sizes };
    processed++;
    log(`  OK ${rel} -> ${sizes.length} tamaños`);
  }

  fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
  log(`\nAñadidos ${processed} archivos webp al mapeo. Total mapeo: ${Object.keys(map).length}`);
}

main().catch((err) => { console.error('FATAL:', err); process.exit(1); });