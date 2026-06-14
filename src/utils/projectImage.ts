import type { Project } from '@/types/project';
import { assetPath } from '@/utils/assetPath';

const IMAGE_BASE = '/images/projects';

export function buildProjectImages(slug: string, detailCount = 3): Project['images'] {
  return {
    hero: assetPath(`${IMAGE_BASE}/${slug}/hero.svg`),
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
