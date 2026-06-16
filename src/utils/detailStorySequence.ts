import type { Project } from '@/types/project';
import { getEditorialStoryLayout, type EditorialStoryRow } from '@/utils/detailEditorialLayout';

export type DetailStorySection =
  | { type: 'hero' }
  | { type: 'row'; row: EditorialStoryRow }
  | { type: 'detail' };

/** Hero → case study detail → editorial image rows (varied rhythm) */
export function getDetailStorySections(project: Project): DetailStorySection[] {
  const { rows } = getEditorialStoryLayout(project);
  const [intro, banner, mid, duo] = rows;

  return [
    { type: 'hero' },
    { type: 'detail' },
    { type: 'row', row: intro },
    { type: 'row', row: banner },
    { type: 'row', row: duo },
    { type: 'row', row: mid },
  ];
}
