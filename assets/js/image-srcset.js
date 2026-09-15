// image-srcset.js
// Utility para generar srcset y <picture> tags a partir de imágenes optimizadas
// Las versiones optimizadas viven en assets/imagenes/_optimized/<carpeta>/<nombre>-{400,800,1200}.webp
(function() {
  'use strict';

  var WIDTHS = [400, 800, 1200];

  /**
   * Obtiene el srcset para una imagen a partir de su ruta relativa.
   * Ej: 'assets/imagenes/PlantaElectrica/PlantaEnergia.webp'
   * Retorna: 'assets/imagenes/_optimized/PlantaElectrica/PlantaEnergia-400.webp 400w, ...'
   * o null si no hay versiones optimizadas.
   */
  function getSrcset(relPath) {
    if (!relPath) return null;

    var base = relPath.replace(/\.[^.]+$/, '');
    var optimizedBase = base.replace(/^assets\/imagenes\//, 'assets/imagenes/_optimized/');

    var parts = [];
    for (var i = 0; i < WIDTHS.length; i++) {
      var w = WIDTHS[i];
      var candidate = optimizedBase + '-' + w + '.webp';
      if (imgExists(candidate)) {
        parts.push(candidate + ' ' + w + 'w');
      }
    }

    return parts.length > 0 ? parts.join(', ') : null;
  }

  /**
   * Obtiene la URL de fallback (la versión optimizada más grande disponible).
   * Si no hay optimizadas, retorna la original.
   */
  function getFallbackSrc(relPath) {
    if (!relPath) return relPath;

    var base = relPath.replace(/\.[^.]+$/, '');
    var optimizedBase = base.replace(/^assets\/imagenes\//, 'assets/imagenes/_optimized/');

    for (var i = WIDTHS.length - 1; i >= 0; i--) {
      var w = WIDTHS[i];
      var candidate = optimizedBase + '-' + w + '.webp';
      if (imgExists(candidate)) {
        return candidate;
      }
    }

    return relPath;
  }

  /**
   * Genera un <picture> HTML string para una imagen.
   * @param {string} relPath - Ruta relativa desde root: 'assets/imagenes/...'
   * @param {object} attrs - Atributos adicionales: { alt, width, height, loading }
   */
  function buildPicture(relPath, attrs) {
    attrs = attrs || {};
    var srcset = getSrcset(relPath);
    var fallback = getFallbackSrc(relPath);

    var alt = attrs.alt ? ' alt="' + escapeAttr(attrs.alt) + '"' : '';
    var width = attrs.width ? ' width="' + attrs.width + '"' : '';
    var height = attrs.height ? ' height="' + attrs.height + '"' : '';
    var loading = attrs.loading ? ' loading="' + attrs.loading + '"' : '';

    var imgTag = '<img src="' + fallback + '"' + alt + width + height + loading + '>';

    if (srcset) {
      return '<picture><source srcset="' + srcset + '" type="image/webp">' + imgTag + '</picture>';
    }

    return '<img src="' + fallback + '"' + alt + width + height + loading + '>';
  }

  function imgExists(src) {
    var img = new Image();
    img.src = src;
    return img.complete && img.naturalWidth > 0;
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSrcset, getFallbackSrc, buildPicture };
  } else {
    window.ImgSrcset = { getSrcset, getFallbackSrc, buildPicture };
  }
})();
