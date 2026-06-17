'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import type { Project } from '@/types/project';
import { siteConfig } from '@/data/site';
import { useLenis } from '@/hooks/useLenis';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
import DetailImage from './DetailImage';
import styles from './WorkDetail.module.scss';

interface WorkDetailNextProps {
  nextProject: Project;
}

export default function WorkDetailNext({ nextProject }: WorkDetailNextProps) {
  const lenis = useLenis();
  const { isTransitioning } = useProjectTransition();
  const { nextProjectLabel, backToTopLabel } = siteConfig.detail;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isTransitioning) event.preventDefault();
  };

  const handleBackToTop = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.nextProject} data-detail-next>
      <div className={styles.nextProjectRow}>
        <Link
          href={`/work/${nextProject.slug}`}
          className={styles.nextProjectLink}
          data-cursor-style="view"
          onClick={handleNavClick}
        >
          <div className={styles.nextProjectImg} data-detail-next-media>
            <DetailImage
              src={nextProject.thumbnail}
              alt={`Next project — ${nextProject.title}`}
              slug={nextProject.slug}
              variant="editorial"
              layout="next"
              viewable={false}
            />
          </div>

          <div className={styles.nextProjectInfo} data-detail-next-info>
            <span className={styles.nextHighlight}>{nextProjectLabel}</span>
            <span className={styles.nextTitle}>{nextProject.title}</span>
            <div className={styles.nextMeta}>
              <span className={styles.nextYear}>{nextProject.year}</span>
            </div>
          </div>
        </Link>

        <div className={styles.nextBtWrapper}>
          <button
            type="button"
            className={styles.backToTop}
            data-cursor-style="small"
            onClick={handleBackToTop}
          >
            <span>{backToTopLabel}</span>
            <span className={styles.backToTopArrow} aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
