/**
 * Hero / project 대표 JPG 생성 (SVG flat gradient 대체)
 * npm run generate:hero-photos
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'projects');

const HERO_PROJECTS = [
  { slug: 'mlb-korea', tone: [28, 28, 32] },
  { slug: 'starbucks-employee-platform', tone: [18, 42, 34] },
  { slug: 'wconcept-us', tone: [22, 22, 26] },
  { slug: 'discovery-expedition', tone: [30, 38, 48] },
  { slug: 'casamia', tone: [48, 42, 36] },
  { slug: 'bullsone', tone: [26, 26, 46] },
  { slug: 'goodpeople', tone: [52, 32, 28] },
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildNoiseBuffer(width, height, seed) {
  const rand = seededRandom(seed);
  const buf = Buffer.alloc(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    const n = 72 + rand() * 184;
    buf[i * 3] = n;
    buf[i * 3 + 1] = n;
    buf[i * 3 + 2] = n;
  }
  return buf;
}

async function createPhotoJpg(outPath, tone, seed, width, height) {
  const noise = buildNoiseBuffer(width, height, seed);

  await sharp(noise, { raw: { width, height, channels: 3 } })
    .blur(38)
    .tint({ r: tone[0], g: tone[1], b: tone[2] })
    .modulate({ brightness: 0.92, saturation: 0.55 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  for (const [index, project] of HERO_PROJECTS.entries()) {
    const dir = path.join(OUT, project.slug);
    fs.mkdirSync(dir, { recursive: true });

    await createPhotoJpg(
      path.join(dir, 'hero.jpg'),
      project.tone,
      1000 + index * 137,
      1920,
      1080,
    );

    await createPhotoJpg(
      path.join(dir, 'mobile.jpg'),
      project.tone,
      2000 + index * 137,
      900,
      1400,
    );

    console.log(`✓ ${project.slug}/hero.jpg`);
  }

  console.log(`\nGenerated photo JPGs for ${HERO_PROJECTS.length} projects.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
