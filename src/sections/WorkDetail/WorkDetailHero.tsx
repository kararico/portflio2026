'use client';

import type { MouseEvent } from 'react';
import type { Project } from '@/types/project';
import { siteConfig } from '@/data/site';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
import {
  getDetailHeroIntro,
  getDetailHeroMetaItems,
} from '@/utils/detailStoryContent';
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
  const heroPrimarySrc = getProjectDetailHeroPrimarySrc(project);
  const metaItems = getDetailHeroMetaItems(project, siteConfig.detail);

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

            {project.subtitle ? (
              <p
                className={styles.heroMetaSubtitle}
                data-detail-hero-reveal
                data-reveal-item
                lang={hasKoreanText(project.subtitle) ? 'ko' : undefined}
              >
                {project.subtitle}
              </p>
            ) : null}

            <p
              className={styles.heroIntro}
              data-detail-hero-reveal
              data-reveal-item
              lang={hasKoreanText(getDetailHeroIntro(project)) ? 'ko' : undefined}
            >
              {getDetailHeroIntro(project)}
            </p>
          </div>

          <dl className={styles.heroMetaStrip} data-detail-hero-reveal>
            {metaItems.map((item) => (
              <div key={item.label} className={styles.heroMetaRow} data-reveal-item>
                <dt className={styles.heroMetaTerm}>{item.label}</dt>
                <dd className={styles.heroMetaValue}>{item.value}</dd>
              </div>
            ))}
          </dl>
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
