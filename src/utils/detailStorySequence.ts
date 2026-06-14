import type { Project } from '@/types/project';
import { getEditorialStoryLayout, type EditorialStoryRow } from '@/utils/detailEditorialLayout';

export type DetailStorySection =
  | { type: 'hero' }
  | { type: 'row'; row: EditorialStoryRow }
  | { type: 'credits' }
  | { type: 'body' };

/** Hero → 3 image rows → credits → body → duo row (Garden Pizza 순서) */
export function getDetailStorySections(project: Project): DetailStorySection[] {
  const { rows } = getEditorialStoryLayout(project);

  return [
    { type: 'hero' },
    { type: 'row', row: rows[0] },
    { type: 'row', row: rows[1] },
    { type: 'row', row: rows[2] },
    { type: 'credits' },
    { type: 'body' },
    { type: 'row', row: rows[3] },
  ];
}
