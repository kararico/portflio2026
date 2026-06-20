import type { Project } from '@/types/project';
import { getProjectGalleryImages } from '@/utils/projectImage';

export type EditorialSlotType =
  | 'planLeft'
  | 'tallRight'
  | 'bannerOverlap'
  | 'gridTopLeft'
  | 'gridTopRight'
  | 'gridBottomLeft'
  | 'gridBottomRight';

export type EditorialRowId = 'intro' | 'banner' | 'grid';

export interface EditorialLayoutItem {
  slot: EditorialSlotType;
  sources: string[];
  alts: string[];
}

export interface EditorialStoryRow {
  id: EditorialRowId;
  items: EditorialLayoutItem[];
  overlap?: boolean;
}

export interface EditorialStoryLayout {
  rows: EditorialStoryRow[];
}

function layoutItem(
  slot: EditorialSlotType,
  sources: string[],
  projectTitle: string,
  labelPrefix: string,
): EditorialLayoutItem {
  return {
    slot,
    sources,
    alts: sources.map((_, index) => `${projectTitle} — ${labelPrefix} ${index + 1}`),
  };
}

function pick(details: string[], ...indices: number[]): string {
  for (const index of indices) {
    if (index >= 0 && index < details.length) return details[index];
  }
  return details[0] ?? '';
}

/** Editorial story layout — Hero + detail[0~6] 각 1회 사용 */
export function getEditorialStoryLayout(project: Project): EditorialStoryLayout {
  const details = getProjectGalleryImages(project);
  const title = project.title;

  const d0 = pick(details, 0);
  const d1 = pick(details, 1, 0);
  const d2 = pick(details, 2, 1, 0);
  const d3 = pick(details, 3, 2, 0);
  const d4 = pick(details, 4, 3, 0);
  const d5 = pick(details, 5, 4, 0);
  const d6 = pick(details, 6, 5, 0);

  return {
    rows: [
      {
        id: 'intro',
        items: [
          layoutItem('planLeft', [d0], title, 'plan'),
          layoutItem('tallRight', [d1], title, 'detail'),
        ],
      },
      {
        id: 'banner',
        overlap: true,
        items: [layoutItem('bannerOverlap', [d2], title, 'feature')],
      },
      {
        id: 'grid',
        items: [
          layoutItem('gridTopLeft', [d3], title, 'grid'),
          layoutItem('gridTopRight', [d4], title, 'grid'),
          layoutItem('gridBottomLeft', [d5], title, 'grid'),
          layoutItem('gridBottomRight', [d6], title, 'grid'),
        ],
      },
    ],
  };
}

/** @deprecated getEditorialStoryLayout 사용 */
export function getEditorialLayout(project: Project): EditorialLayoutItem[] {
  return getEditorialStoryLayout(project).rows.flatMap((row) => row.items);
}

export type EditorialImageLayout = 'large' | 'wide' | 'small' | 'sketch' | 'tall' | 'duo' | 'next';

export function slotToImageLayout(slot: EditorialSlotType): EditorialImageLayout {
  switch (slot) {
    case 'planLeft':
    case 'gridTopLeft':
    case 'gridTopRight':
    case 'gridBottomLeft':
    case 'gridBottomRight':
      return 'large';
    case 'tallRight':
      return 'tall';
    case 'bannerOverlap':
      return 'wide';
    default:
      return 'large';
  }
}
