import type { HeroImagePosition, Project } from '@/types/project';
import { assetPath } from '@/utils/assetPath';

const IMAGE_BASE = '/images/projects';
const VISUAL_MAIN_BASE = '/images/products/visual-main';
const HOME_HERO_BASE = '/images/products/home-main';

const HERO_POSITION_MAP: Record<HeroImagePosition, string> = {
  center: 'center center',
  top: 'center top',
  bottom: 'center bottom',
  left: 'left center',
  right: 'right center',
};

/**
 * Work Detail Hero — visual-main 대표 이미지 slug 매핑
 * 경로: public/images/products/visual-main/{file}
 */
const VISUAL_MAIN_HERO_FILES: Record<string, string> = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-main-bg.png',
  guud: 'guud-main-bg.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'hodoo-english': 'hodoo-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  starbucks: 'st-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'st-main-bg.png',
};

/** Home 중앙 Hero — home-main slug 매핑 (파일명: *-main-bg.png) */
const HOME_HERO_FILES: Record<string, string> = {
  bullsone: 'bs-main-bg.png',
  casamia: 'casa-main-bg.png',
  'discovery-expedition': 'dc-main-bg.png',
  goodpeople: 'gp-main-bg.png',
  guud: 'guud-main-bg.png',
  'hyundai-ezwel': 'hd-main-bg.png',
  'hodoo-english': 'hodoo-main-bg.png',
  'mlb-korea': 'mlb-main-bg.png',
  'starbucks-employee-platform': 'st-main-bg.png',
  'starbucks-siren119': 'st-main-bg.png',
};

export function getVisualMainHeroPath(slug: string): string | null {
  const file = VISUAL_MAIN_HERO_FILES[slug];
  if (!file) return null;
  return assetPath(`${VISUAL_MAIN_BASE}/${file}`);
}

export function getVisualMainHeroCandidates(slug: string): string[] {
  const path = getVisualMainHeroPath(slug);
  return path ? [path] : [];
}

export function buildHomeHeroPath(slug: string): string {
  const file = HOME_HERO_FILES[slug];
  if (!file) {
    return assetPath(`${IMAGE_BASE}/${slug}/hero.svg`);
  }
  return assetPath(`${HOME_HERO_BASE}/${file}`);
}

/** Home 중앙 Hero 슬라이더 — homeHero 전용 (thumbnail · visual-main 미사용) */
export function getProjectHomeHero(project: Project): string {
  return project.homeHero;
}

export function getProjectHomeHeroCandidates(project: Project): string[] {
  return getImageCandidates(getProjectHomeHero(project));
}

/** Hero cover crop 중심 — CSS object-position 값 */
export function getProjectHeroObjectPosition(project: Project): string {
  const heroImage = project.heroImage;
  if (!heroImage) return 'center';
  if (heroImage.objectPosition) return heroImage.objectPosition;
  if (heroImage.position) return HERO_POSITION_MAP[heroImage.position] ?? 'center';
  return 'center';
}

function isVisualMainHeroPath(src: string): boolean {
  return src.includes('/visual-main/');
}

/** Work Detail Hero fallback — visual-main · images.hero 전용 (thumbnail 제외) */
export function getProjectDetailHeroFallbackSrc(project: Project): string {
  if (isVisualMainHeroPath(project.images.hero)) {
    return project.images.hero;
  }
  const visualMain = getVisualMainHeroPath(project.slug);
  if (visualMain) return visualMain;
  if (project.heroImage?.src) return project.heroImage.src;
  if (!isVisualMainHeroPath(project.images.hero)) {
    return project.images.hero;
  }
  return assetPath(`${IMAGE_BASE}/${project.slug}/hero.svg`);
}

/** Work Detail Hero 최종 1순위 src (probe 없이 데이터 기준) */
export function getProjectDetailHeroPrimarySrc(project: Project): string {
  return getProjectDetailHeroFallbackSrc(project);
}

/**
 * Work Detail Hero 이미지 후보
 * 1. visual-main/{file}-main-bg.png
 * 2. images.hero · heroImage.src · projects/{slug}/hero
 */
export function getProjectDetailHeroCandidates(project: Project): string[] {
  const visualMain = getVisualMainHeroCandidates(project.slug);

  const otherCandidates: string[] = [];
  if (project.heroImage?.src) {
    otherCandidates.push(...getImageCandidates(project.heroImage.src));
  }
  if (project.images.hero) {
    otherCandidates.push(...getImageCandidates(project.images.hero));
  }
  otherCandidates.push(
    ...getImageCandidates(assetPath(`${IMAGE_BASE}/${project.slug}/hero.svg`)),
  );

  const seen = new Set<string>();
  return [...visualMain, ...otherCandidates].filter((path) => {
    if (seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

export function buildProjectImages(slug: string, detailCount = 3): Project['images'] {
  return {
    hero: getVisualMainHeroPath(slug) ?? assetPath(`${IMAGE_BASE}/${slug}/hero.svg`),
    detail: Array.from({ length: detailCount }, (_, i) =>
      assetPath(`${IMAGE_BASE}/${slug}/detail-0${i + 1}.svg`),
    ),
    mobile: assetPath(`${IMAGE_BASE}/${slug}/mobile.svg`),
  };
}

/** JPG 우선, 없으면 SVG fallback */
export function getImageCandidates(src: string): string[] {
  let paths: string[];

  if (src.endsWith('.jpg')) {
    paths = [src, src.replace(/\.jpg$/, '.svg')];
  } else if (src.endsWith('.svg')) {
    paths = [src.replace(/\.svg$/, '.jpg'), src];
  } else if (src.endsWith('.png') || src.endsWith('.webp')) {
    paths = [src];
  } else {
    paths = [src];
  }

  return paths.map(assetPath);
}

export function getProjectHeroSrc(project: Project, isMobile = false): string {
  if (isMobile && project.images.mobile) {
    return project.images.mobile;
  }
  return project.images.hero;
}

export function getProjectHeroCandidates(project: Project, isMobile = false): string[] {
  return getImageCandidates(getProjectHeroSrc(project, isMobile));
}

/** Home floating thumbnail — project.thumbnail 전용 */
export function getProjectThumbnail(project: Project): string {
  return project.thumbnail;
}

/** Works ProjectVisual — thumbnail 우선, 없으면 hero */
export function getProjectVisualCandidates(project: Project, isMobile = false): string[] {
  const primary =
    isMobile && project.images.mobile
      ? project.images.mobile
      : getProjectThumbnail(project);
  return getImageCandidates(primary);
}

/** Gallery 섹션용 이미지 목록 (detail 우선, 없으면 hero) */
export function getProjectGalleryImages(project: Project): string[] {
  if (project.images.detail && project.images.detail.length > 0) {
    return project.images.detail;
  }
  return [project.images.hero];
}
