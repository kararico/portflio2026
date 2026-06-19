/**
 * detail-main 폴더 실제 파일 수 ↔ projectImage.ts SLUG_DETAIL_COUNT 검증
 * node scripts/sync-detail-main-counts.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DETAIL_MAIN = join(ROOT, 'public', 'images', 'products', 'detail-main');
const SOURCE = join(ROOT, 'src', 'utils', 'projectImage.ts');

const PREFIX = {
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

function countOnDisk(slug) {
  const dir = join(DETAIL_MAIN, slug);
  if (!existsSync(dir)) return 0;
  const prefix = PREFIX[slug];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.png') && (!prefix || f.startsWith(`${prefix}-detail-`)))
    .length;
}

const ts = readFileSync(SOURCE, 'utf8');
const declared = [...ts.matchAll(/(?:'([^']+)'|([a-z-]+)):\s*(\d+)/g)]
  .filter((m) => PREFIX[m[1] ?? m[2]])
  .map((m) => ({ slug: m[1] ?? m[2], count: Number(m[3]) }));

let ok = true;
console.log('\n=== detail-main count sync ===\n');

for (const slug of Object.keys(PREFIX)) {
  const disk = countOnDisk(slug);
  const codeMatch = ts.match(
    new RegExp(`(?:'${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'|${slug}):\\s*(\\d+)`),
  );
  const code = codeMatch ? Number(codeMatch[1]) : null;
  const match = disk === code;
  if (!match) ok = false;
  console.log(`${match ? '✓' : '✗'} ${slug}: disk=${disk}, code=${code ?? '?'}`);
}

console.log(ok ? '\nAll counts in sync.\n' : '\nMismatch — update SLUG_DETAIL_COUNT in projectImage.ts\n');
process.exit(ok ? 0 : 1);
