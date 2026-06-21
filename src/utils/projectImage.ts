import type { HeroImagePosition, Project } from '@/types/project';
import { assetPath } from '@/utils/assetPath';

export const VISUAL_MAIN_BASE = '/images/products/visual-main';
export const DETAIL_MAIN_BASE = '/images/products/detail-main';
const HOME_HERO_BASE = '/images/products/home-main';
const PRODUCTS_THUMB_BASE = '/images/products';

const HERO_POSITION_MAP: Record<HeroImagePosition, string> = {
  center: 'center center',
  top: 'center top',
  bottom: 'center bottom',
  left: 'left center',
  right: 'right center',
};

/** Work Detail Hero — visual-main/{file} */
const SLUG_VISUAL_MAIN: Record<string, string> = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-img.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'starbuck119-img.png',
  'wconcept-us': 'wc-main-bg.png',
};

/** Work Detail Gallery — detail-main/{slug}/{prefix}-detail-0N.png */
const SLUG_DETAIL_PREFIX: Record<string, string> = {
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

/** detail-main/{slug}/ 내 Gallery 이미지 수 — 에셋 폴더와 동기화 */
const SLUG_DETAIL_COUNT: Record<string, number> = {
  bullsone: 7,
  casamia: 7,
  'discovery-expedition': 7,
  goodpeople: 7,
  'hyundai-ezwel': 7,
  'mlb-korea': 7,
  'starbucks-employee-platform': 7,
  'starbucks-siren119': 7,
  'wconcept-us': 7,
};

export function getDetailMainCount(slug: string): number {
  return SLUG_DETAIL_COUNT[slug] ?? 3;
}

/** Home floating 카드 썸네일 — /images/products/{file} */
const SLUG_THUMBNAIL: Record<string, string> = {
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

/** projects.ts seed — home-main 파일명 */
const SLUG_HOME_MAIN: Record<string, string> = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-main-bg.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'starbuck119-img.png',
  'wconcept-us': 'wc-main-bg.png',
};

/** Home Hero 쇼케이스 — home-main 파일명 SSOT (폴더 기준) */
export const HOME_SHOWCASE_FILES = [
  'casa-main-bg.png',
  'dc-main-bg.png',
  'gp-main-bg.png',
  'hd-main-bg.png',
  'hodoo-main-bg.png',
  'mlb-main-bg.png',
  'st-main-bg.png',
] as const;

export const HOME_MAIN_FILE_SLUG: Partial<Record<(typeof HOME_SHOWCASE_FILES)[number], string>> = {
  'casa-main-bg.png': 'casamia',
  'dc-main-bg.png': 'discovery-expedition',
  'gp-main-bg.png': 'goodpeople',
  'hd-main-bg.png': 'hyundai-ezwel',
  'hodoo-main-bg.png': 'hodoo-english',
  'mlb-main-bg.png': 'mlb-korea',
  'st-main-bg.png': 'starbucks-employee-platform',
};

export function buildHomeMainPath(file: string): string {
  return assetPath(`${HOME_HERO_BASE}/${file}`);
}

export function getVisualMainHeroPath(slug: string): string | null {
  const file = SLUG_VISUAL_MAIN[slug];
  if (!file) return null;
  return assetPath(`${VISUAL_MAIN_BASE}/${file}`);
}

export function buildDetailMainPath(slug: string, index: number): string {
  const prefix = SLUG_DETAIL_PREFIX[slug];
  if (!prefix) {
    throw new Error(`Missing detail-main prefix for slug: ${slug}`);
  }
  const num = String(index).padStart(2, '0');
  return assetPath(`${DETAIL_MAIN_BASE}/${slug}/${prefix}-detail-${num}.png`);
}

export function buildProductThumbnailPath(slug: string): string {
  const file = SLUG_THUMBNAIL[slug];
  if (!file) return assetPath(`${PRODUCTS_THUMB_BASE}/mlb-img.png`);
  return assetPath(`${PRODUCTS_THUMB_BASE}/${file}`);
}

export function buildProjectImages(slug: string, detailCount = getDetailMainCount(slug)): Project['images'] {
  const prefix = SLUG_DETAIL_PREFIX[slug];
  const hero = getVisualMainHeroPath(slug);

  if (!hero || !prefix) {
    throw new Error(`Missing visual-main or detail-main mapping for slug: ${slug}`);
  }

  return {
    hero,
    detail: Array.from({ length: detailCount }, (_, i) => buildDetailMainPath(slug, i + 1)),
    mobile: buildDetailMainPath(slug, Math.min(detailCount, 3)),
  };
}

export function buildHomeHeroPath(slug: string): string {
  const file = SLUG_HOME_MAIN[slug];
  if (!file) {
    throw new Error(`Missing home-main mapping for slug: ${slug}`);
  }
  return assetPath(`${HOME_HERO_BASE}/${file}`);
}

export function getVisualMainHeroCandidates(slug: string): string[] {
  const path = getVisualMainHeroPath(slug);
  return path ? [path] : [];
}

export function getProjectHomeHero(project: Project): string {
  return project.homeHero;
}

export function getProjectHeroObjectPosition(project: Project): string {
  const heroImage = project.heroImage;
  if (!heroImage) return 'center';
  if (heroImage.objectPosition) return heroImage.objectPosition;
  if (heroImage.position) return HERO_POSITION_MAP[heroImage.position] ?? 'center';
  return 'center';
}

/** Work Detail Hero — images.hero 단일 경로 */
export function getProjectDetailHeroFallbackSrc(project: Project): string {
  if (project.heroImage?.src) return project.heroImage.src;
  return project.images.hero;
}

export function getProjectDetailHeroPrimarySrc(project: Project): string {
  return getProjectDetailHeroFallbackSrc(project);
}

export function getProjectDetailHeroCandidates(project: Project): string[] {
  return [assetPath(getProjectDetailHeroPrimarySrc(project))];
}

/** 선언 경로 그대로 사용 (fallback 없음) */
export function getImageCandidates(src: string): string[] {
  return [assetPath(src)];
}

export function resolveImageSrc(src: string): string {
  return assetPath(src);
}

export function getProjectThumbnail(project: Project): string {
  return project.thumbnail;
}

/** Works / Home 카드 — thumbnail 전용 */
export function getProjectVisualCandidates(project: Project): string[] {
  return [assetPath(getProjectThumbnail(project))];
}

export function classifyImageZone(src: string): 'thumbnail' | 'visual-main' | 'detail-main' | 'home-main' | 'other' {
  if (src.includes('/visual-main/')) return 'visual-main';
  if (src.includes('/detail-main/')) return 'detail-main';
  if (src.includes('/home-main/')) return 'home-main';
  if (src.includes('/images/products/') && !src.includes('/visual-main/') && !src.includes('/detail-main/') && !src.includes('/home-main/')) {
    return 'thumbnail';
  }
  return 'other';
}

/** Gallery — images.detail만 사용 */
export function getProjectGalleryImages(project: Project): string[] {
  return project.images.detail ?? [];
}
