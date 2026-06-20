import sharp from 'sharp';
import { join } from 'node:path';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f5f3ef"/>
  <rect x="80" y="520" width="1040" height="1" fill="#e8e4dc"/>
  <text x="80" y="260" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="#111111">Jungwon Heo</text>
  <text x="80" y="340" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#666666">Web Publisher &amp; UI Engineer</text>
  <text x="80" y="560" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#999999" letter-spacing="4">PORTFOLIO 2026</text>
</svg>`;

const output = join(process.cwd(), 'public', 'og-image.jpg');

const info = await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(output);

console.log(`Generated ${output} (${info.width}x${info.height})`);
