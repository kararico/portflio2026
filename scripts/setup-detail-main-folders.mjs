/**
 * detail-main/{slug}/ 폴더 생성 및 기존 flat 이미지 마이그레이션
 * node scripts/setup-detail-main-folders.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'public', 'images', 'products', 'detail-main');
const PRODUCTS = join(process.cwd(), 'public', 'images', 'products');

const DETAIL_PREFIX = {
  casamia: 'casa',
  'discovery-expedition': 'dc',
  goodpeople: 'gp',
  'hyundai-ezwel': 'hd',
  bullsone: 'bullsone',
  'mlb-korea': 'mlb',
  'starbucks-employee-platform': 'st',
  'starbucks-siren119': 'st',
  'wconcept-us': 'wc',
};

const PROJECTS = [
  { slug: 'mlb-korea', detailCount: 4, source: 'mlb-img.png' },
  { slug: 'discovery-expedition', detailCount: 3, source: 'ds-img.png' },
  { slug: 'starbucks-employee-platform', detailCount: 3, source: 'starbuck-img.png' },
  {
    slug: 'starbucks-siren119',
    detailCount: 3,
    source: 'starbuck119-img.png',
    fallback: 'starbuck-img.png',
  },
  { slug: 'hyundai-ezwel', detailCount: 3, source: 'hd-img.png' },
  { slug: 'wconcept-us', detailCount: 4, source: 'wc-img.png' },
  { slug: 'casamia', detailCount: 7, source: 'casa-img.png' },
  { slug: 'bullsone', detailCount: 6, source: 'bs-img.png', fallback: 'bullsone-detail-01.png' },
  { slug: 'goodpeople', detailCount: 7, source: 'gp-img.png' },
];

function resolveSource(project) {
  const primary = join(ROOT, project.source);
  if (existsSync(primary)) return primary;

  const fromProducts = join(PRODUCTS, project.source);
  if (existsSync(fromProducts)) return fromProducts;

  if (project.fallback) {
    const fallbackRoot = join(ROOT, project.fallback);
    if (existsSync(fallbackRoot)) return fallbackRoot;
    const fallbackProducts = join(PRODUCTS, project.fallback);
    if (existsSync(fallbackProducts)) return fallbackProducts;
  }

  return null;
}

for (const project of PROJECTS) {
  const prefix = DETAIL_PREFIX[project.slug];
  const dir = join(ROOT, project.slug);
  mkdirSync(dir, { recursive: true });

  const source = resolveSource(project);
  if (!source) {
    console.warn(`⚠ skip ${project.slug}: source not found (${project.source})`);
    continue;
  }

  for (let i = 1; i <= project.detailCount; i += 1) {
    const num = String(i).padStart(2, '0');
    const dest = join(dir, `${prefix}-detail-${num}.png`);
    copyFileSync(source, dest);
    console.log(`✓ ${project.slug}/${prefix}-detail-${num}.png`);
  }
}

// 루트 flat 파일 정리 (폴더 구조로 이전 완료 후)
const flatSources = new Set(PROJECTS.flatMap((p) => [p.source, p.fallback].filter(Boolean)));
for (const file of readdirSync(ROOT, { withFileTypes: true })) {
  if (!file.isFile() || !file.name.endsWith('.png')) continue;
  if (!flatSources.has(file.name)) {
    console.warn(`skip remove (unknown): ${file.name}`);
    continue;
  }
  unlinkSync(join(ROOT, file.name));
  console.log(`removed flat: ${file.name}`);
}

console.log('\nDone. detail-main is now organized by project slug folders.');
