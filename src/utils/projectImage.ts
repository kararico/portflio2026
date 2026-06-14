import type { Project } from '@/types/project';

const IMAGE_BASE = '/images/projects';

export function buildProjectImages(slug: string, detailCount = 3): Project['images'] {
  return {
    hero: `${IMAGE_BASE}/${slug}/hero.svg`,
    detail: Array.from(
      { length: detailCount },
      (_, i) => `${IMAGE_BASE}/${slug}/detail-0${i + 1}.svg`,
    ),
    mobile: `${IMAGE_BASE}/${slug}/mobile.svg`,
  };
}

/** JPG 우선, 없으면 SVG fallback */
export function getImageCandidates(src: string): string[] {
  if (src.endsWith('.jpg')) {
    return [src, src.replace(/\.jpg$/, '.svg')];
  }
  if (src.endsWith('.svg')) {
    return [src.replace(/\.svg$/, '.jpg'), src];
  }
  return [src];
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

export function getProjectThumbnail(project: Project): string {
  return project.thumbnail || project.images.hero;
}

/** Gallery 섹션용 이미지 목록 (detail 우선, 없으면 hero) */
export function getProjectGalleryImages(project: Project): string[] {
  if (project.images.detail && project.images.detail.length > 0) {
    return project.images.detail;
  }
  return [project.images.hero];
}
