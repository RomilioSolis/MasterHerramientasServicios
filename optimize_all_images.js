#!/usr/bin/env node
/**
 * optimize_all_images.js
 * 1. Convierte todas las imágenes PNG/JPG a WebP optimizado
 * 2. Genera 3 tamaños (400, 800, 1200) en _optimized/
 * 3. Actualiza equipos.json y HTML files para usar WebP
 * 4. Genera srcset para loader.js streaming cards
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const IMG_DIR = path.join(ROOT, 'assets/imagenes');
const OPT_DIR = path.join(IMG_DIR, '_optimized');
const DATA_DIR = path.join(ROOT, 'assets/data');
const COMP_DIR = path.join(ROOT, 'components/equipos');

const WIDTHS = [400, 800, 1200];
const QUALITY = 80;

let converted = 0;
let skipped = 0;
let errors = 0;

function log(msg) { console.log(msg); }

async function ensureDir(p) {
  if (!fs.existsSync(p)) await fs.promises.mkdir(p, { recursive: true });
}

// Get dimensions of an image
async function getDims(file) {
  const meta = await sharp(file).metadata();
  return { width: meta.width, height: meta.height };
}

// Sanitize filename for use as WebP name (preserve spaces for dir structure matching)
function toWebpPath(originalPath) {
  return originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

// Convert single image to WebP and create optimized sizes
async function convertImage(srcAbs, relPath) {
  const webpRel = toWebpPath(relPath);
  const webpAbs = path.join(IMG_DIR, webpRel);

  // Skip if WebP already exists and is smaller
  if (fs.existsSync(webpAbs)) {
    const srcStat = fs.statSync(srcAbs);
    const webpStat = fs.statSync(webpAbs);
    if (webpStat.size < srcStat.size * 0.5) {
      log(`  SKIP (WebP exists, much smaller): ${relPath}`);
      skipped++;
      return webpRel;
    }
  }

  await ensureDir(path.dirname(webpAbs));

  const dims = await getDims(srcAbs);

  // Convert main WebP
  await sharp(srcAbs)
    .webp({ quality: QUALITY, smartSubsample: true })
    .toFile(webpAbs);

  converted++;
  log(`  CONVERTED: ${relPath} -> ${webpRel} (${Math.round(fs.statSync(webpAbs).size / 1024)}KB from ${Math.round(fs.statSync(srcAbs).size / 1024)}KB)`);

  // Create optimized sizes
  for (const w of WIDTHS) {
    if (w > dims.width) continue;
    const optRel = `_optimized/${path.dirname(webpRel).replace(/^\.\//, '')}/${path.basename(webpRel, '.webp')}-${w}.webp`;
    const optAbs = path.join(IMG_DIR, optRel);
    await ensureDir(path.dirname(optAbs));

    const targetW = Math.min(w, dims.width);
    const targetH = Math.round((dims.height * targetW) / dims.width);

    await sharp(srcAbs)
      .resize(targetW, targetH, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, smartSubsample: true })
      .toFile(optAbs);
  }

  return webpRel;
}

// Update equipos.json to use WebP
async function updateEquiposJson() {
  const jsonPath = path.join(DATA_DIR, 'equipos.json');
  if (!fs.existsSync(jsonPath)) return;

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  let updated = 0;

  for (const eq of data) {
    if (eq.imagen && /\.(png|jpg|jpeg)$/i.test(eq.imagen)) {
      const oldName = eq.imagen;
      eq.imagen = toWebpPath(eq.imagen);
      updated++;
      log(`  JSON: ${oldName} -> ${eq.imagen}`);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  log(`  Updated ${updated} image references in equipos.json`);
}

// Update individual HTML files to use WebP
async function updateHtmlFiles() {
  if (!fs.existsSync(COMP_DIR)) return;
  const files = fs.readdirSync(COMP_DIR).filter(f => f.endsWith('.html'));
  let updated = 0;

  for (const file of files) {
    const filePath = path.join(COMP_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace .png and .jpg/.jpeg references with .webp in src attributes
    const before = content;
    content = content.replace(/src="([^"]*\.(png|jpg|jpeg))"/gi, (match, src) => {
      return `src="${src.replace(/\.(png|jpg|jpeg)$/i, '.webp')}"`;
    });

    if (content !== before) {
      fs.writeFileSync(filePath, content, 'utf8');
      updated++;
      log(`  HTML updated: ${file}`);
    }
  }
  log(`  Updated ${updated} HTML files`);
}

// Main
async function main() {
  log('=== Image Optimization Script ===\n');

  // Find all PNG and JPG images (not in _optimized)
  const images = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === '_optimized') continue;
        walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
          images.push(full);
        }
      }
    }
  }
  walk(IMG_DIR);

  log(`Found ${images.length} non-WebP images to convert\n`);

  for (const abs of images) {
    const rel = path.relative(IMG_DIR, abs);
    try {
      await convertImage(abs, rel);
    } catch (err) {
      console.error(`  ERROR converting ${rel}:`, err.message);
      errors++;
    }
  }

  log('');

  // Update data files
  log('Updating data references...');
  await updateEquiposJson();
  await updateHtmlFiles();

  log(`
=== Summary ===
Converted: ${converted}
Skipped: ${skipped}
Errors: ${errors}
=== Done ===`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
