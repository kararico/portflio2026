/**
 * Work Detail Hero 경로 디버그 — node scripts/debug-hero-paths.mjs [slug]
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const VISUAL_MAIN_BASE = '/images/products/visual-main';
const IMAGE_BASE = '/images/projects';

const VISUAL_MAIN_HERO_FILES = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-main-bg.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'hodoo-english': 'hodoo-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  starbucks: 'st-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'st-main-bg.png',
};

function getVisualMainHeroPath(slug) {
  const file = VISUAL_MAIN_HERO_FILES[slug];
  if (!file) return null;
  return `${VISUAL_MAIN_BASE}/${file}`;
}

function getImageCandidates(src) {
  if (src.endsWith('.png') || src.endsWith('.webp')) return [src];
  if (src.endsWith('.jpg')) return [src, src.replace(/\.jpg$/, '.svg')];
  if (src.endsWith('.svg')) return [src.replace(/\.svg$/, '.jpg'), src];
  return [src];
}

function isVisualMainHeroPath(src) {
  return src.includes('/visual-main/');
}

function getProjectDetailHeroFallbackSrc(project) {
  const visualMain = getVisualMainHeroPath(project.slug);
  if (visualMain) return visualMain;
  if (project.thumbnail) return project.thumbnail;
  return project.images.hero;
}

function getProjectDetailHeroCandidates(project) {
  const visualMain = getVisualMainHeroPath(project.slug)
    ? [getVisualMainHeroPath(project.slug)]
    : [];

  const productCandidates = [];
  if (project.thumbnail) productCandidates.push(...getImageCandidates(project.thumbnail));
  if (project.images.mobile && project.images.mobile !== project.thumbnail) {
    productCandidates.push(...getImageCandidates(project.images.mobile));
  }

  const otherCandidates = [];
  if (project.heroImage?.src) otherCandidates.push(...getImageCandidates(project.heroImage.src));
  if (!isVisualMainHeroPath(project.images.hero)) {
    otherCandidates.push(...getImageCandidates(project.images.hero));
  }
  otherCandidates.push(...getImageCandidates(`${IMAGE_BASE}/${project.slug}/hero.svg`));

  const seen = new Set();
  return [...visualMain, ...productCandidates, ...otherCandidates].filter((path) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

// Minimal parse: extract slug/thumbnail/hero from projects.ts seeds
const projectsPath = join(process.cwd(), 'src/data/projects.ts');
const source = readFileSync(projectsPath, 'utf8');

const slugArg = process.argv[2] ?? 'mlb-korea';
const slugBlocks = source.split(/slug:\s*'/).slice(1);

const projects = slugBlocks.map((block) => {
  const slug = block.split("'")[0];
  const thumbnailMatch = block.match(/thumbnail:\s*'([^']+)'/);
  const heroMatch = block.match(/hero:\s*'([^']+)'/);
  const mobileMatch = block.match(/mobile:\s*'([^']+)'/);
  const heroImageSrcMatch = block.match(/heroImage:[\s\S]*?src:\s*'([^']+)'/);

  const buildHero = getVisualMainHeroPath(slug) ?? `${IMAGE_BASE}/${slug}/hero.svg`;

  return {
    slug,
    thumbnail: thumbnailMatch?.[1],
    images: {
      hero: heroMatch?.[1] ?? buildHero,
      mobile: mobileMatch?.[1],
    },
    heroImage: heroImageSrcMatch ? { src: heroImageSrcMatch[1] } : undefined,
  };
});

const project = projects.find((p) => p.slug === slugArg);
if (!project) {
  console.error(`Project not found: ${slugArg}`);
  process.exit(1);
}

console.log(`\n=== Hero paths: ${project.slug} ===`);
console.log('images.hero (data):     ', project.images.hero);
console.log('visual-main mapped:     ', getVisualMainHeroPath(project.slug));
console.log('primary src:            ', getProjectDetailHeroFallbackSrc(project));
console.log('candidate list:');
getProjectDetailHeroCandidates(project).forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
console.log('');
