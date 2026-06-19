/**
 * 프로젝트 placeholder SVG 생성 (텍스트 없는 순수 gradient)
 * npm run generate:images
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'images', 'projects');

const PROJECTS = [
  { slug: 'mlb-korea', detailCount: 4, c1: '#141414', c2: '#404040' },
  { slug: 'discovery-expedition', detailCount: 3, c1: '#243442', c2: '#4a8a96' },
  { slug: 'starbucks-employee-platform', detailCount: 3, c1: '#0d3d2a', c2: '#1e3932' },
  { slug: 'starbucks-siren119', detailCount: 3, c1: '#1a4d35', c2: '#2d6a4f' },
  { slug: 'wconcept-us', detailCount: 4, c1: '#0a0a0a', c2: '#4a4a4a' },
  { slug: 'casamia', detailCount: 2, c1: '#6b5a45', c2: '#b8a088' },
  { slug: 'bullsone', detailCount: 6, c1: '#1a1a2e', c2: '#4a4a6a' },
  { slug: 'goodpeople', detailCount: 7, c1: '#994433', c2: '#cc8866' },
];

function svg(width, height, c1, c2, index = 0) {
  const shift = index * 8;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="${10 + shift}%" y1="0%" x2="${90 - shift}%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
</svg>`;
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

for (const project of PROJECTS) {
  const dir = path.join(OUT, project.slug);

  write(path.join(dir, 'hero.svg'), svg(1920, 1080, project.c1, project.c2, 0));
  write(path.join(dir, 'mobile.svg'), svg(800, 1200, project.c2, project.c1, 0));

  for (let i = 0; i < project.detailCount; i++) {
    write(
      path.join(dir, `detail-0${i + 1}.svg`),
      svg(1600, 1000, project.c1, project.c2, i + 1),
    );
  }
}

console.log(`Generated clean placeholders for ${PROJECTS.length} projects`);
