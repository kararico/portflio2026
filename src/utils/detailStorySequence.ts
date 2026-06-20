import type { Project } from '@/types/project';
import { getEditorialStoryLayout, type EditorialStoryRow } from '@/utils/detailEditorialLayout';

export type DetailStorySection =
  | { type: 'hero' }
  | { type: 'row'; row: EditorialStoryRow }
  | { type: 'detail' };

/** Hero → case study detail → editorial image rows (intro → banner → grid) */
export function getDetailStorySections(project: Project): DetailStorySection[] {
  const { rows } = getEditorialStoryLayout(project);
  const [intro, banner, grid] = rows;

  return [
    { type: 'hero' },
    { type: 'detail' },
    { type: 'row', row: intro },
    { type: 'row', row: banner },
    { type: 'row', row: grid },
  ];
}
