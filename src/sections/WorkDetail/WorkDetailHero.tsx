'use client';

import type { MouseEvent } from 'react';
import type { Project } from '@/types/project';
import { siteConfig } from '@/data/site';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
import { getDetailHeroIntro } from '@/utils/detailStoryContent';
import { getProjectDetailHeroPrimarySrc } from '@/utils/projectImage';
import { hasKoreanText, splitTitleLines } from '@/utils/projectTitle';
import DetailImage from './DetailImage';
import styles from './WorkDetail.module.scss';

interface WorkDetailHeroProps {
  project: Project;
}

export default function WorkDetailHero({ project }: WorkDetailHeroProps) {
  const { closeProject, isTransitioning } = useProjectTransition();
  const { backLabel } = siteConfig.detail;
  const { scrollLabel } = siteConfig.hero;
  const heroPrimarySrc = getProjectDetailHeroPrimarySrc(project);

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isTransitioning) return;
    closeProject(project.slug);
  };

  return (
    <section className={styles.hero} data-detail-hero data-detail-hero-top>
      <button
        type="button"
        className={styles.detailClose}
        data-detail-close
        data-cursor-style="small"
        data-detail-hero-reveal
        aria-label={backLabel}
        onClick={handleBack}
      >
        <span className={styles.detailCloseIcon} aria-hidden="true" />
      </button>

      <div className={styles.heroLayout}>
        <div className={styles.heroLeft}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title} data-detail-hero-reveal data-reveal-item>
              {splitTitleLines(project.title).map((line) => (
                <span key={line} className={styles.titleLine}>
                  {line}
                </span>
              ))}
            </h1>

            <div className={styles.heroMeta} data-detail-hero-reveal data-reveal-item>
              {project.subtitle ? (
                <p
                  className={styles.heroMetaSubtitle}
                  lang={hasKoreanText(project.subtitle) ? 'ko' : undefined}
                >
                  {project.subtitle}
                </p>
              ) : null}
              <p className={styles.heroMetaRole}>{project.role}</p>
              <span className={styles.heroMetaYear}>{project.year}</span>
            </div>

            <p className={styles.heroIntro} data-detail-hero-reveal data-reveal-item>
              {getDetailHeroIntro(project)}
            </p>
          </div>

          <span className={styles.scrollHint} data-detail-hero-reveal aria-hidden="true">
            {scrollLabel}
          </span>
        </div>

        <div className={styles.heroRight} data-cursor-style="view">
          <DetailImage
            src={heroPrimarySrc}
            alt={`${project.title} — hero visual`}
            slug={project.slug}
            project={project}
            priority
            variant="hero"
          />
        </div>
      </div>
    </section>
  );
}
