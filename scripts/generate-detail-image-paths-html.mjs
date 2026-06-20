/**
 * Work Detail 이미지 경로 참조 HTML 생성
 * node scripts/generate-detail-image-paths-html.mjs
 */
import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const SITE_BASE = 'https://kararico.github.io/portflio2026';

const VISUAL_MAIN = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-img.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'hodoo-english': 'hodoo-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'st-main-bg.png',
  'wconcept-us': 'wc-main-bg.png',
};

const DETAIL_PREFIX = {
  bullsone: 'bullsone',
  casamia: 'casa',
  'discovery-expedition': 'dc',
  goodpeople: 'gp',
  'hyundai-ezwel': 'hd',
  'mlb-korea': 'mlb',
  'starbucks-employee-platform': 'st',
  'starbucks-siren119': 'st',
  'wconcept-us': 'wc',
};

const THUMBNAIL = {
  bullsone: 'bs-img.png',
  casamia: 'casa-img.png',
  'discovery-expedition': 'ds-img.png',
  goodpeople: 'gp-img.png',
  'hyundai-ezwel': 'hd-img.png',
  'mlb-korea': 'mlb-img.png',
  'starbucks-employee-platform': 'starbuck-img.png',
  'starbucks-siren119': 'starbuck119-img.png',
  'wconcept-us': 'wc-img.png',
};

function path(p) {
  return BASE_PATH ? `${BASE_PATH}${p}` : p;
}

function fullUrl(p) {
  return `${SITE_BASE}${path(p)}`;
}

function fileExists(webPath) {
  const disk = join(PUBLIC, webPath.replace(/^\//, ''));
  return existsSync(disk);
}

function detailPaths(slug, count) {
  const prefix = DETAIL_PREFIX[slug];
  if (!prefix) return [];
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `/images/products/detail-main/${slug}/${prefix}-detail-${num}.png`;
  });
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function row(label, webPath, zone, component) {
  const exists = fileExists(webPath);
  const status = exists ? 'exists' : 'missing';
  return {
    html: `
    <tr class="${status}">
      <td><span class="zone zone-${zone}">${zone}</span></td>
      <td>${escapeHtml(label)}</td>
      <td><code>${escapeHtml(path(webPath))}</code></td>
      <td><a href="${escapeHtml(fullUrl(webPath))}" target="_blank" rel="noopener">${escapeHtml(fullUrl(webPath))}</a></td>
      <td><span class="badge badge-${status}">${exists ? '파일 있음' : '파일 없음'}</span></td>
      <td class="component">${escapeHtml(component)}</td>
    </tr>`,
    exists,
  };
}

function listDetailMainFolders() {
  const base = join(PUBLIC, 'images', 'products', 'detail-main');
  if (!existsSync(base)) return [];

  return readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const dir = join(base, entry.name);
      const files = readdirSync(dir)
        .filter((f) => f.endsWith('.png'))
        .sort();
      return { slug: entry.name, files };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

const detailMainFolders = listDetailMainFolders();

const PROJECT_META = [
  { slug: 'mlb-korea', title: 'MLB Korea' },
  { slug: 'discovery-expedition', title: 'Discovery Expedition' },
  { slug: 'starbucks-employee-platform', title: 'Starbucks Partner Hub' },
  { slug: 'starbucks-siren119', title: 'Starbucks Siren119' },
  { slug: 'hyundai-ezwel', title: 'Hyundai EZWEL' },
  { slug: 'wconcept-us', title: 'W Concept US' },
  { slug: 'casamia', title: 'Casamia' },
  { slug: 'bullsone', title: 'Bullsone' },
  { slug: 'goodpeople', title: 'Goodpeople' },
];

const PROJECTS = PROJECT_META.map((p) => ({
  ...p,
  detailCount:
    detailMainFolders.find((f) => f.slug === p.slug)?.files.length ??
    (DETAIL_PREFIX[p.slug] ? 3 : 0),
}));

const folderTreeHtml = detailMainFolders.length
  ? `<ul class="folder-tree">
${detailMainFolders
  .map(
    (folder) => `  <li>
    <strong><code>detail-main/${folder.slug}/</code></strong>
    <ul>${folder.files.map((f) => `<li><code>${f}</code></li>`).join('')}</ul>
  </li>`,
  )
  .join('\n')}
</ul>`
  : '<p class="muted">detail-main 폴더가 비어 있습니다.</p>';

const allRows = [];

const projectSections = PROJECTS.map((p, idx) => {
  const heroPath = `/images/products/visual-main/${VISUAL_MAIN[p.slug]}`;
  const gallery = detailPaths(p.slug, p.detailCount);
  const mobilePath = gallery[Math.min(gallery.length, 3) - 1] ?? gallery[0];
  const thumbPath = `/images/products/${THUMBNAIL[p.slug]}`;
  const nextSlug = PROJECTS[(idx + 1) % PROJECTS.length].slug;
  const nextThumb = `/images/products/${THUMBNAIL[nextSlug]}`;

  const rowItems = [
    row('Hero (우측 대표 이미지)', heroPath, 'visual-main', 'WorkDetailHero → DetailImage variant="hero"'),
    row('Viewer (Hero 클릭 시)', heroPath, 'visual-main', 'DetailImageViewer'),
    ...gallery.map((g, i) =>
      row(`Gallery detail[${i}]`, g, 'detail-main', `WorkDetailStory editorial row — images.detail[${i}]`),
    ),
    row('images.mobile (duo 우측 등)', mobilePath, 'detail-main', 'detailEditorialLayout duoRight fallback'),
    row('Next Project 카드', nextThumb, 'thumbnail', `WorkDetailNext → nextProject.thumbnail (${nextSlug})`),
    row('본문 썸네일 (참고)', thumbPath, 'thumbnail', '상세 본문 외 영역 — Works/Home/Transition용'),
  ];
  allRows.push(...rowItems);

  const rows = rowItems.map((r) => r.html).join('');

  return `
  <section class="project" id="${p.slug}">
    <header>
      <h2>${escapeHtml(p.title)}</h2>
      <p class="slug">slug: <code>${p.slug}</code> · <a href="/work/${p.slug}">/work/${p.slug}</a></p>
    </header>
    <table>
      <thead>
        <tr>
          <th>존</th>
          <th>용도</th>
          <th>경로 (로컬)</th>
          <th>전체 URL (GitHub Pages)</th>
          <th>파일</th>
          <th>컴포넌트</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}).join('\n');

const totalPaths = allRows.length;
const existingPaths = allRows.filter((r) => r.exists).length;
const missingPaths = totalPaths - existingPaths;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Work Detail 이미지 경로 참조</title>
  <style>
    :root {
      --bg: #f5f3ef;
      --text: #111;
      --muted: #666;
      --border: #e8e4dc;
      --exists: #1a5c38;
      --missing: #7c1515;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 2rem clamp(1rem, 4vw, 3rem) 4rem;
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
    .lead { color: var(--muted); max-width: 52rem; margin-bottom: 2rem; }
    .summary {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 2.5rem;
      max-width: 52rem;
    }
    .summary h2 { font-size: 1rem; margin: 0 0 0.75rem; }
    .summary ul { margin: 0; padding-left: 1.25rem; }
    .summary code { font-size: 0.9em; }
    .project {
      margin-bottom: 2.5rem;
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    .project header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
      background: #faf9f7;
    }
    .project h2 { margin: 0; font-size: 1.15rem; }
    .slug { margin: 0.35rem 0 0; font-size: 0.875rem; color: var(--muted); }
    table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
    th, td { padding: 0.65rem 0.85rem; text-align: left; vertical-align: top; border-bottom: 1px solid var(--border); }
    th { background: #f2efe9; font-weight: 600; white-space: nowrap; }
    tr.missing td { background: #fdf6f6; }
    code { word-break: break-all; }
    a { color: #1a4d7a; }
    .zone {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .zone-visual-main { background: #e8f0fe; color: #1a4d7a; }
    .zone-detail-main { background: #e8f5e9; color: #1a5c38; }
    .zone-thumbnail { background: #fff3e0; color: #8a5a00; }
    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-exists { background: #e8f5e9; color: var(--exists); }
    .badge-missing { background: #fdecea; color: var(--missing); }
    .component { color: var(--muted); min-width: 10rem; }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .stat {
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      background: #f2efe9;
      font-size: 0.8125rem;
    }
    .stat strong { font-size: 1.1rem; display: block; }
    .folder-tree {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.875rem;
    }
    .folder-tree ul {
      margin: 0.35rem 0 0.75rem;
      padding-left: 1.25rem;
      color: var(--muted);
    }
    .folder-tree li { margin-bottom: 0.35rem; }
    .muted { color: var(--muted); }
    @media (max-width: 900px) {
      table, thead, tbody, th, td, tr { display: block; }
      thead { display: none; }
      tr { border-bottom: 1px solid var(--border); padding: 0.75rem; }
      td { border: none; padding: 0.2rem 0; }
      td::before {
        content: attr(data-label);
        font-weight: 600;
        display: block;
        font-size: 0.7rem;
        color: var(--muted);
        text-transform: uppercase;
        margin-bottom: 0.15rem;
      }
    }
  </style>
</head>
<body>
  <h1>Work Detail 이미지 경로 참조</h1>
  <p class="lead">
    상세 페이지(<code>/work/[slug]</code>)에서 사용하는 이미지 URL 목록입니다.
    데이터 소스: <code>src/utils/projectImage.ts</code>, <code>src/data/projects.ts</code>
  </p>

  <div class="summary">
    <h2>경로 규칙</h2>
    <div class="stats">
      <div class="stat"><strong>${totalPaths}</strong>전체 경로</div>
      <div class="stat"><strong>${existingPaths}</strong>파일 있음</div>
      <div class="stat"><strong>${missingPaths}</strong>파일 없음</div>
      <div class="stat"><strong>${detailMainFolders.length}</strong>detail-main 폴더</div>
    </div>
    <ul>
      <li><strong>Hero / Viewer</strong> — <code>/images/products/visual-main/{file}</code> (<code>images.hero</code>)</li>
      <li><strong>Gallery (본문 이미지)</strong> — <code>/images/products/detail-main/{slug}/{prefix}-detail-0N.png</code> (<code>images.detail[]</code>)</li>
      <li><strong>Next Project</strong> — <code>/images/products/{thumbnail}</code> (다음 프로젝트 <code>thumbnail</code>)</li>
      <li>GitHub Pages base path: <code>${BASE_PATH || '/portflio2026 (배포)'}</code></li>
      <li>생성 시각: ${new Date().toISOString()}</li>
    </ul>
  </div>

  <div class="summary">
    <h2>detail-main 폴더 구조</h2>
    ${folderTreeHtml}
  </div>

  ${projectSections}

</body>
</html>
`;

const out = join(ROOT, 'docs', 'work-detail-image-paths.html');
writeFileSync(out, html, 'utf8');
console.log(`Wrote ${out}`);
