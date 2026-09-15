#!/usr/bin/env node
/**
 * generate_image_map.js
 * Convierte el map.json en un módulo JS embebido (assets/js/image-map.js)
 * para que loader.js y otros módulos puedan usar getSrcset() sin fetch.
 */

const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const MAP_PATH = path.join(ROOT, 'assets/Imagenes/_optimized/map.json');
const OUT_PATH = path.join(ROOT, 'assets/js/image-map.js');

const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

let js = `/**
 * image-map.js (auto-generado)
 * Mapeo de imágenes optimizadas para construir <picture>/<source srcset>.
 * No editar a mano; regenerar con: node generate_image_map.js
 */
const IMAGE_MAP = ${JSON.stringify(map)};

/**
 * Devuelve el srcset para una imagen dada su ruta relativa desde assets/Imagenes.
 * @param {string} rel - ej: 'Andamios/Andamios.png' o 'Andamios/Andamios.webp'
 * @returns {string|null} srcset listo para <source>, o null si no hay mapeo.
 */
function getSrcset(rel) {
  const entry = IMAGE_MAP[rel];
  if (!entry || !entry.sizes || entry.sizes.length === 0) return null;
  return entry.sizes.map(s => 'assets/Imagenes/' + s.rel + ' ' + s.width + 'w').join(', ');
}

/**
 * Devuelve la mejor URL de imagen para una resolución dada (fallback si no hay srcset).
 * @param {string} rel
 * @returns {string|null}
 */
function getImageSrc(rel) {
  const entry = IMAGE_MAP[rel];
  if (!entry) return 'assets/Imagenes/' + rel;
  if (entry.sizes && entry.sizes.length > 0) {
    return 'assets/Imagenes/' + entry.sizes[entry.sizes.length - 1].rel;
  }
  return 'assets/Imagenes/' + rel;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IMAGE_MAP, getSrcset, getImageSrc };
}
`;

fs.writeFileSync(OUT_PATH, js, 'utf8');
console.log('Generado:', OUT_PATH);
console.log('Entradas:', Object.keys(map).length);