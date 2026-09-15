#!/usr/bin/env node
/**
 * generate_srcset_map.js
 * Scans _optimized/ directory and generates a JS module with
 * srcset availability data for use at runtime.
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const OPT_DIR = path.join(ROOT, 'assets/imagenes/_optimized');
const OUT_PATH = path.join(ROOT, 'assets/js/image-srcset-map.js');

const WIDTHS = [400, 800, 1200];

function walk(dir, baseDir, results) {
  results = results || [];
  baseDir = baseDir || dir;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_optimized') continue;
      walk(full, baseDir, results);
    } else if (e.isFile()) {
      const ext = path.extname(e.name).toLowerCase();
      if (ext === '.webp') {
        const rel = path.relative(ROOT, full).replace(/\\/g, '/');
        results.push(rel);
      }
    }
  }
  return results;
}

function main() {
  const files = walk(OPT_DIR);
  const map = {};

  for (const f of files) {
    const match = f.match(/_optimized\/(.+?)\/(.+?)-(\d+)\.webp$/);
    if (!match) continue;

    const dir = match[1];
    const name = match[2];
    const width = parseInt(match[3], 10);
    const key = `${dir}/${name}`;

    if (!map[key]) {
      map[key] = { dir, name, sizes: [] };
    }
    map[key].sizes.push(width);
  }

  // Sort sizes
  for (const key of Object.keys(map)) {
    map[key].sizes.sort((a, b) => a - b);
  }

  const js = `/**
 * image-srcset-map.js (auto-generado)
 * Mapa de srcsets disponibles para <picture>/<source>.
 * No editar a mano; regenerar con: node generate_srcset_map.js
 */
const SRCSET_MAP = ${JSON.stringify(map, null, 2)};

const SRCSET_WIDTHS = [400, 800, 1200];

/**
 * Devuelve el srcset para una imagen.
 * @param {string} relPath - ej: 'assets/imagenes/PlantaElectrica/PlantaEnergia.webp'
 * @returns {string|null} srcset string o null
 */
function getSrcset(relPath) {
  if (!relPath) return null;
  const base = relPath.replace(/\.[^.]+$/, '').replace(/^assets\/imagenes\//, '');
  const entry = SRCSET_MAP[base];
  if (!entry || !entry.sizes || entry.sizes.length === 0) return null;
  return entry.sizes.map(w => \`assets/imagenes/_optimized/\${entry.dir}/\${entry.name}-\${w}.webp \${w}w\`).join(', ');
}

/**
 * Devuelve la URL de fallback (optimización más grande disponible).
 * @param {string} relPath
 * @returns {string}
 */
function getFallbackSrc(relPath) {
  if (!relPath) return relPath;
  const base = relPath.replace(/\.[^.]+$/, '').replace(/^assets\/imagenes\//, '');
  const entry = SRCSET_MAP[base];
  if (entry && entry.sizes && entry.sizes.length > 0) {
    const maxW = entry.sizes[entry.sizes.length - 1];
    return \`assets/imagenes/_optimized/\${entry.dir}/\${entry.name}-\${maxW}.webp\`;
  }
  return relPath;
}

/**
 * Devuelve un tag <picture> completo.
 * @param {string} relPath - ej: 'assets/imagenes/Taladros/Taladro.webp'
 * @param {object} attrs - { alt, width, height, loading }
 * @returns {string}
 */
function buildPicture(relPath, attrs) {
  attrs = attrs || {};
  const srcset = getSrcset(relPath);
  const fallback = getFallbackSrc(relPath);
  const alt = attrs.alt ? ' alt="' + escapeAttr(attrs.alt) + '"' : '';
  const w = attrs.width ? ' width="' + attrs.width + '"' : '';
  const h = attrs.height ? ' height="' + attrs.height + '"' : '';
  const ld = attrs.loading ? ' loading="' + attrs.loading + '"' : '';
  const imgTag = '<img src="' + fallback + '"' + alt + w + h + ld + '>';
  if (srcset) {
    return '<picture><source srcset="' + srcset + '" type="image/webp">' + imgTag + '</picture>';
  }
  return '<img src="' + fallback + '"' + alt + w + h + ld + '>';
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SRCSET_MAP, getSrcset, getFallbackSrc, buildPicture };
}
`;

  fs.writeFileSync(OUT_PATH, js, 'utf8');
  console.log('Generado:', OUT_PATH);
  console.log('Entradas:', Object.keys(map).length);
}

main();
