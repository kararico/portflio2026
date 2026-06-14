/**
 * Soft displacement map for Profile liquid distortion
 * node scripts/generate-displacement-texture.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'public',
  'textures',
  'displacement-soft.png',
);

const SIZE = 512;

function sample(x, y) {
  const nx = x / SIZE;
  const ny = y / SIZE;
  const r =
    128 +
    36 * Math.sin(nx * Math.PI * 5.5 + ny * Math.PI * 3.2) +
    24 * Math.sin(nx * Math.PI * 11 - ny * Math.PI * 7.5);
  const g =
    128 +
    36 * Math.cos(nx * Math.PI * 4.8 - ny * Math.PI * 6.1) +
    24 * Math.sin(nx * Math.PI * 9 + ny * Math.PI * 12);
  return {
    r: Math.max(0, Math.min(255, Math.round(r))),
    g: Math.max(0, Math.min(255, Math.round(g))),
    b: 128,
  };
}

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const data = Buffer.alloc(SIZE * SIZE * 3);
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 3;
      const { r, g, b } = sample(x, y);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
  }

  await sharp(data, { raw: { width: SIZE, height: SIZE, channels: 3 } }).png().toFile(OUT);

  console.log(`✓ ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
