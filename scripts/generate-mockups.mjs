/**
 * SVG placeholder → JPG 목업 변환 (Next/Image 호환)
 * npm run generate:mockups
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'public', 'images', 'projects');

async function convertSvgToJpg(svgPath, jpgPath) {
  await sharp(svgPath).jpeg({ quality: 88, mozjpeg: true }).toFile(jpgPath);
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('Missing public/images/projects — run npm run generate:images first.');
    process.exit(1);
  }

  let count = 0;

  for (const slug of fs.readdirSync(ROOT)) {
    const dir = path.join(ROOT, slug);
    if (!fs.statSync(dir).isDirectory()) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.svg')) continue;

      const svgPath = path.join(dir, file);
      const jpgPath = path.join(dir, file.replace(/\.svg$/, '.jpg'));

      await convertSvgToJpg(svgPath, jpgPath);
      count += 1;
      console.log(`✓ ${slug}/${file} → ${path.basename(jpgPath)}`);
    }
  }

  console.log(`\nGenerated ${count} mockup JPG(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
