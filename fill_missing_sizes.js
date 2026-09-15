#!/usr/bin/env node
/**
 * fill_missing_sizes.js
 * Creates 800px and 1200px WebP versions for images
 * in _optimized/ that only have 400px versions.
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = '/home/masterenherramientas/master-herramientas';
const OPT_DIR = path.join(ROOT, 'assets/imagenes/_optimized');
const WIDTHS = [800, 1200];

async function main() {
  console.log('Filling missing sizes...\n');
  let created = 0;

  const dirs = fs.readdirSync(OPT_DIR).filter(d => {
    return fs.statSync(path.join(OPT_DIR, d)).isDirectory() && d !== '_optimized';
  });

  for (const dir of dirs) {
    const dirPath = path.join(OPT_DIR, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-400.webp'));

    for (const f of files) {
      const base = f.replace('-400.webp', '');
      const has800 = path.join(dirPath, `${base}-800.webp`);
      const has1200 = path.join(dirPath, `${base}-1200.webp`);
      if (fs.existsSync(has800) && fs.existsSync(has1200)) continue;

      // Find source image (try multiple locations)
      const srcCandidates = [];
      const nameWithSpace = base.replace(/-/g, ' ');

      for (const suffix of ['.png', '.jpg', '.jpeg', '.webp']) {
        const p1 = path.join(ROOT, 'assets/imagenes', dir, base + suffix);
        const p2 = path.join(ROOT, 'assets/imagenes', dir, nameWithSpace + suffix);
        if (fs.existsSync(p1)) srcCandidates.push(p1);
        if (fs.existsSync(p2)) srcCandidates.push(p2);
      }

      // Also try as WebP with the base name
      const pWebp = path.join(ROOT, 'assets/imagenes', dir, base + '.webp');
      const pWebpSpace = path.join(ROOT, 'assets/imagenes', dir, nameWithSpace + '.webp');
      if (fs.existsSync(pWebp)) srcCandidates.push(pWebp);
      if (fs.existsSync(pWebpSpace)) srcCandidates.push(pWebpSpace);

      let srcFile = null;
      for (const candidate of srcCandidates) {
        try {
          const meta = await sharp(candidate).metadata();
          if (meta.width >= 400) {
            srcFile = candidate;
            break;
          }
        } catch (e) { /* skip */ }
      }

      // Last resort: use 400 version itself (will look slightly soft when upscaled)
      if (!srcFile) {
        srcFile = path.join(dirPath, f);
      }

      for (const w of WIDTHS) {
        const outFile = path.join(dirPath, `${base}-${w}.webp`);
        if (fs.existsSync(outFile)) continue;

        try {
          const srcMeta = await sharp(srcFile).metadata();
          const targetW = Math.min(w, srcMeta.width);
          if (targetW <= 400) continue;
          const targetH = Math.round((srcMeta.height * targetW) / srcMeta.width);

          await sharp(srcFile)
            .resize(targetW, targetH, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80, smartSubsample: true })
            .toFile(outFile);

          const size = fs.statSync(outFile).size;
          console.log(`  Created: ${dir}/${base}-${w}.webp (${Math.round(size/1024)}KB)`);
          created++;
        } catch (err) {
          console.error(`  ERROR: ${dir}/${base}-${w}.webp: ${err.message}`);
        }
      }
    }
  }

  console.log(`\nCreated: ${created} new files`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
