import type { Project } from '@/types/project';
import { getEditorialStoryLayout, type EditorialStoryRow } from '@/utils/detailEditorialLayout';

export type DetailStorySection =
  | { type: 'hero' }
  | { type: 'row'; row: EditorialStoryRow }
  | { type: 'detail' };

/** Hero → intro row → detail → image rows → duo row */
export function getDetailStorySections(project: Project): DetailStorySection[] {
  const { rows } = getEditorialStoryLayout(project);

  return [
    { type: 'hero' },
    { type: 'row', row: rows[0] },
    { type: 'detail' },
    { type: 'row', row: rows[1] },
    { type: 'row', row: rows[2] },
    { type: 'row', row: rows[3] },
  ];
}
