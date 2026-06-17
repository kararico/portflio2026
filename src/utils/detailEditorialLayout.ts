import type { Project } from '@/types/project';
import { getProjectGalleryImages } from '@/utils/projectImage';

export type EditorialSlotType =
  | 'planLeft'
  | 'tallRight'
  | 'bannerOverlap'
  | 'greenhouseLeft'
  | 'ceilingRight'
  | 'duoLeft'
  | 'duoRight';

export type EditorialRowId = 'intro' | 'banner' | 'mid' | 'duo';

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

/** Garden Pizza 스타일 비대칭 editorial row 구성 */
export function getEditorialStoryLayout(project: Project): EditorialStoryLayout {
  const details = getProjectGalleryImages(project);
  const mobile = project.images.mobile;
  const title = project.title;

  const d0 = pick(details, 0);
  const d1 = pick(details, 1, 0);
  const d2 = pick(details, 2, 1, 0);

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
        id: 'mid',
        items: [
          layoutItem('greenhouseLeft', [d2], title, 'interior'),
          layoutItem('ceilingRight', [d1], title, 'detail'),
        ],
      },
      {
        id: 'duo',
        items: [
          layoutItem('duoLeft', [d0], title, 'detail'),
          layoutItem('duoRight', [mobile ?? d2], title, 'detail'),
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
      return 'sketch';
    case 'tallRight':
    case 'ceilingRight':
      return 'tall';
    case 'bannerOverlap':
    case 'greenhouseLeft':
    case 'duoLeft':
    case 'duoRight':
      return 'wide';
    default:
      return 'large';
  }
}
