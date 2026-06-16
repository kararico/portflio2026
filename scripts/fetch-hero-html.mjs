const slug = process.argv[2] ?? 'mlb-korea';
const base = process.argv[3] ?? 'http://localhost:3030';

const html = await fetch(`${base}/work/${slug}`).then((r) => r.text());

const patterns = ['work-thumbnails', 'visual-main', 'mlb-main-bg', 'mlb-img'];
for (const p of patterns) {
  const count = (html.match(new RegExp(p, 'g')) ?? []).length;
  console.log(`${p}: ${count} occurrence(s)`);
}

const refs = [...html.matchAll(/\/images\/[a-zA-Z0-9_\-./]+/g)].map((m) => m[0]);
const unique = [...new Set(refs)].filter(
  (s) => s.includes('mlb') || s.includes('visual-main') || s.includes('work-thumb'),
);
console.log('\nRelevant image paths in HTML:');
unique.forEach((u) => console.log(' ', u));
