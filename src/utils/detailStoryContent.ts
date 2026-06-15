import type { Project, ProjectDetailContent } from '@/types/project';
import { projectDetailsBySlug } from '@/data/projectDetails';

export function getProjectDetail(project: Project): ProjectDetailContent {
  if (project.projectDetail) return project.projectDetail;

  const fromSlug = projectDetailsBySlug[project.slug];
  if (fromSlug) return fromSlug;

  return {
    overview: project.overview,
    role: project.role,
    contributions: project.responsibilities,
    techStack: project.stack,
    outcome: project.achievements[0] ?? project.objectives,
  };
}

/** Hero 좌측 짧은 intro */
export function getDetailHeroIntro(project: Project): string {
  if (project.detailHeroIntro) return project.detailHeroIntro;

  const { overview } = getProjectDetail(project);
  if (overview.length <= 220) return overview;
  return `${overview.slice(0, 217).trim()}…`;
}
