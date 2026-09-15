#!/usr/bin/env node
/**
 * optimize_images.js
 * Convierte imágenes a WebP optimizado, generando 3 tamaños (mobile, tablet, desktop)
 * y escribe un JSON de mapeo para usar en <picture>/<source srcset>.
 *
 * Uso: node optimize_images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const IMG_DIR = path.join(ROOT, 'assets/imagenes');
const OUT_DIR = path.join(IMG_DIR, '_optimized'); // evita colisiones con los originales

// Tamaños objetivo (ancho en px). El alto se calcula manteniendo aspect ratio.
const WIDTHS = [400, 800, 1200];
const QUALITY = 80; // WebP quality

// Extensiones a procesar
const SRC_EXTS = ['.jpg', '.jpeg', '.png'];

function log(msg) { console.log(msg); }

async function ensureDir(p) {
  if (!fs.existsSync(p)) await fs.promises.mkdir(p, { recursive: true });
}

// Devuelve {width, height} reales de la imagen
async function getImageDimensions(file) {
  const meta = await sharp(file).metadata();
  return { width: meta.width, height: meta.height };
}

// Convierte una imagen a WebP redimensionada, guardando en OUT_DIR
// Devuelve el path relativo al directorio assets/imagenes (ej: '_optimized/Andamios/Andamios-400.webp')
async function convertOne(srcAbs, relDir, baseName, width) {
  const outRel = path.join('_optimized', relDir, `${baseName}-${width}.webp`);
  const outAbs = path.join(IMG_DIR, outRel);
  await ensureDir(path.dirname(outAbs));

  const srcMeta = await sharp(srcAbs).metadata();
  const targetWidth = Math.min(width, srcMeta.width);
  const targetHeight = Math.round((srcMeta.height * targetWidth) / srcMeta.width);

  await sharp(srcAbs)
    .resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, smartSubsample: true })
    .toFile(outAbs);

  return { rel: outRel, width: targetWidth, height: targetHeight };
}

async function main() {
  log('=== Optimización de imágenes a WebP (sharp) ===\n');

  // Buscar todas las imágenes
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
        if (SRC_EXTS.includes(ext)) files.push(full);
      }
      // ya existentes .webp los ignoramos (se usan como originales)
    }
  }
  walk(IMG_DIR);

  log(`Imágenes encontradas: ${files.length}\n`);

  // Mapeo: ruta relativa (desde assets/imagenes) -> { base, dir, sizes: [{rel,width,height}], original }
  const map = {};
  let processed = 0;
  let skipped = 0;

  for (const abs of files) {
    const rel = path.relative(IMG_DIR, abs); // ej: Andamios/Andamios.png
    const relDir = path.dirname(rel);
    const ext = path.extname(rel).toLowerCase();
    const base = path.basename(rel, ext);

    // Si ya es webp, saltar (se mantiene como original)
    if (ext === '.webp') {
      skipped++;
      continue;
    }

    // Evitar reprocesar si ya está en _optimized
    if (relDir === '_optimized') continue;

    // Obtener dimensiones reales
    let dims;
    try {
      dims = await getImageDimensions(abs);
    } catch (err) {
      log(`  ERROR dimensiones: ${rel} - ${err.message}`);
      continue;
    }

    const sizes = [];
    for (const w of WIDTHS) {
      if (w > dims.width) continue; // no agrandar
      try {
        const info = await convertOne(abs, relDir, base, w);
        sizes.push(info);
      } catch (err) {
        log(`  ERROR convirtiendo ${rel} @${w}px: ${err.message}`);
      }
    }

    map[rel] = {
      base,
      dir: relDir,
      original: rel,
      originalSize: { width: dims.width, height: dims.height },
      sizes,
    };
    processed++;
    log(`  OK ${rel} -> ${sizes.length} tamaños`);
  }

  // Guardar mapeo JSON
  const mapPath = path.join(IMG_DIR, '_optimized', 'map.json');
  await ensureDir(path.dirname(mapPath));
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 2), 'utf8');
  log(`\nMapeo guardado en: ${mapPath}`);
  log(`Procesadas: ${processed} | Saltadas (webp ya existentes): ${skipped}`);
  log('=== Listo ===');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});