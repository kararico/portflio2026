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
    outcome: project.objectives,
    keyFeatures: [],
  };
}

export function getProjectKeyFeatures(project: Project): string[] {
  const detail = getProjectDetail(project);
  return detail.keyFeatures ?? [];
}

export function getProjectAchievements(project: Project): Project['achievements'] {
  return project.achievements;
}

/** Hero 좌측 짧은 intro */
export function getDetailHeroIntro(project: Project): string {
  if (project.detailHeroIntro) return project.detailHeroIntro;

  const { overview } = getProjectDetail(project);
  if (overview.length <= 220) return overview;
  return `${overview.slice(0, 217).trim()}…`;
}

export interface DetailHeroMetaItem {
  label: string;
  value: string;
}

/** Hero 하단 메타 스트립 — Client / Role / Period / Platform / Tech Stack */
export function getDetailHeroMetaItems(
  project: Project,
  labels: {
    clientLabel: string;
    roleLabel: string;
    periodLabel: string;
    platformLabel: string;
    stackLabel: string;
  },
): DetailHeroMetaItem[] {
  const detail = getProjectDetail(project);
  const techStack = detail.techStack.join(', ');

  return [
    { label: labels.clientLabel, value: project.client },
    { label: labels.roleLabel, value: detail.role },
    { label: labels.periodLabel, value: project.year },
    { label: labels.platformLabel, value: project.platform ?? 'Web Platform' },
    { label: labels.stackLabel, value: techStack },
  ];
}
