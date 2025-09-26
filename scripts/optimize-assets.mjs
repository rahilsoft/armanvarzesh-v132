// Optimize raster/vector assets across apps
import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { optimize as svgo } from 'svgo';

const ROOT = process.cwd();
const TARGET_GLOBS = [
  'apps/**/assets/**/*.{png,jpg,jpeg,webp,svg}',
  'apps/**/src/assets/**/*.{png,jpg,jpeg,webp,svg}',
  'apps/**/public/**/*.{png,jpg,jpeg,webp,svg}',
];

const MAX_WIDTH = 2000; // px
const JPEG_QUALITY = 76;
const PNG_QUALITY = 80; // quantize equivalent

function isRaster(f) { return /\.(png|jpg|jpeg|webp)$/i.test(f); }
function isSVG(f) { return /\.svg$/i.test(f); }

async function optimizeRaster(inFile) {
  const buf = await fs.readFile(inFile);
  const img = sharp(buf, { failOn: 'truncated' });
  const meta = await img.metadata();
  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    const newW = MAX_WIDTH;
    const newH = Math.round((meta.height || newW) * (newW / meta.width));
    pipeline = pipeline.resize(newW, newH);
  }
  const ext = path.extname(inFile).toLowerCase();
  if (ext === '.png') pipeline = pipeline.png({ quality: PNG_QUALITY, palette: true });
  else if (ext === '.jpg' || ext === '.jpeg') pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  else if (ext === '.webp') pipeline = pipeline.webp({ quality: JPEG_QUALITY });
  const out = await pipeline.toBuffer();
  if (out.length < buf.length) {
    await fs.writeFile(inFile, out);
    return buf.length - out.length;
  }
  return 0;
}

async function optimizeSVG(inFile) {
  const txt = await fs.readFile(inFile, 'utf-8');
  const res = svgo(txt, {
    multipass: true,
    plugins: ['preset-default', 'removeXMLNS', 'removeDimensions'],
  });
  if (res?.data && res.data.length <= txt.length) {
    await fs.writeFile(inFile, res.data, 'utf-8');
    return Buffer.byteLength(txt) - Buffer.byteLength(res.data);
  }
  return 0;
}

(async () => {
  const files = await globby(TARGET_GLOBS, { gitignore: true });
  let saved = 0, count = 0;
  for (const f of files) {
    try {
      const full = path.resolve(ROOT, f);
      let s = 0;
      if (isRaster(f)) s = await optimizeRaster(full);
      else if (isSVG(f)) s = await optimizeSVG(full);
      saved += s; count++;
    } catch (e) { /* ignore individual failures */ }
  }
  const kb = Math.round(saved / 1024);
  console.log(`[optimize-assets] ${count} files processed, saved ~${kb} KB`);
})().catch(e => { console.error(e); process.exit(1); });
