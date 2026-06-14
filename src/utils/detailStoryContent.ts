import type { Project } from '@/types/project';

/** Septiembre Garden Pizza — credits 블록 (6줄) */
export function getDetailCredits(project: Project): string[] {
  if (project.detailCredits?.length) return project.detailCredits;

  return [
    `${project.client} · ${project.title}`,
    `${project.role} · Contribution ${project.contribution}`,
    `Year ${project.year}`,
    project.stack.slice(0, 4).join(' · '),
  ];
}

/** Septiembre — 본문 4단락 */
export function getDetailBodyParagraphs(project: Project): string[] {
  if (project.detailBody?.length) return project.detailBody;

  const paragraphs = [project.overview, project.objectives];

  project.achievements.slice(0, 2).forEach((line) => {
    paragraphs.push(line);
  });

  return paragraphs.filter(Boolean);
}

/** Hero 좌측 짧은 intro (Garden Pizza hero 카피 길이) */
export function getDetailHeroIntro(project: Project): string {
  if (project.detailHeroIntro) return project.detailHeroIntro;
  if (project.overview.length <= 220) return project.overview;
  return `${project.overview.slice(0, 217).trim()}…`;
}
