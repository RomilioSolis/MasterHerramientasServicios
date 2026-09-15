#!/usr/bin/env node
/**
 * convert_to_picture.js
 * Convierte tags <img> estáticos en components/equipos/*.html a <picture> con <source srcset>
 * usando el mapeo de imágenes optimizadas. Mantiene el <img> original como fallback.
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const COMP_DIR = path.join(ROOT, 'components/equipos');
const MAP_PATH = path.join(ROOT, 'assets/Imagenes/_optimized/map.json');

function log(msg) { console.log(msg); }

// Parsear src="assets/Imagenes/..." a ruta relativa desde assets/Imagenes
function parseSrc(src) {
  const m = src.match(/^assets\/Imagenes\/(.+)$/);
  return m ? m[1] : null;
}

// Construir el <picture> para una imagen
function buildPicture(imgTag, mapEntry) {
  const srcMatch = imgTag.match(/src="([^"]+)"/);
  if (!srcMatch) return imgTag;
  const src = srcMatch[1];
  const rel = parseSrc(src);
  if (!rel || !mapEntry || !mapEntry.sizes || mapEntry.sizes.length === 0) {
    return imgTag;
  }

  // Construir srcset
  const srcset = mapEntry.sizes
    .map(s => `assets/Imagenes/${s.rel} ${s.width}w`)
    .join(', ');

  // Extraer atributos del img original (excepto src)
  let rest = imgTag.replace(/src="[^"]*"/, '').trim();
  // Quitar loading="lazy" del img y ponerlo en el picture si se desea; lo dejamos en img

  const picture =
    `<picture>\n` +
    `  <source srcset="${srcset}" type="image/webp">\n` +
    `  ${imgTag}\n` +
    `</picture>`;
  return picture;
}

function main() {
  const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  const files = fs.readdirSync(COMP_DIR).filter(f => f.endsWith('.html'));
  let totalConverted = 0;

  for (const file of files) {
    const filePath = path.join(COMP_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    let count = 0;

    // Encontrar todos los <img ...> que no estén dentro de <picture>
    // Usamos un regex que capture <img ... /> o <img ...>
    const imgRegex = /<img\b[^>]*?src="([^"]+)"[^>]*?\/?>/g;
    const matches = [...content.matchAll(imgRegex)];

    for (const match of matches) {
      const fullTag = match[0];
      const src = match[1];
      const rel = parseSrc(src);
      if (!rel) continue;

      // Evitar convertir si ya está dentro de un <picture> (detectamos por contexto)
      // Para simplificar, procesamos todos y luego evitamos anidamiento doble
      const mapEntry = map[rel];
      if (!mapEntry || !mapEntry.sizes || mapEntry.sizes.length === 0) continue;

      // Verificar que no esté ya dentro de <picture>
      const before = content.slice(0, match.index);
      if (/<picture>\s*$/.test(before.replace(/\s/g, ''))) continue;

      const newTag = buildPicture(fullTag, mapEntry);
      if (newTag !== fullTag) {
        content = content.replace(fullTag, newTag);
        changed = true;
        count++;
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      log(`  ${file}: ${count} imágenes convertidas a <picture>`);
      totalConverted += count;
    }
  }

  log(`\nTotal convertidos: ${totalConverted}`);
}

main();