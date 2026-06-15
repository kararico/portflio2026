'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { siteConfig } from '@/data/site';
import type { Project } from '@/types/project';
import { hasKoreanText, splitTitleLines } from '@/utils/projectTitle';
import ProjectVisual from './ProjectVisual';
import styles from './WorksItem.module.scss';

interface WorksItemProps {
  project: Project;
  index: number;
  priority?: boolean;
  entryRef?: (el: HTMLElement | null) => void;
  indexRef?: (el: HTMLElement | null) => void;
  headerRef?: (el: HTMLElement | null) => void;
  metaRef?: (el: HTMLElement | null) => void;
  visualRef?: (el: HTMLElement | null) => void;
}

export default function WorksItem({
  project,
  index,
  priority = false,
  entryRef,
  indexRef,
  headerRef,
  metaRef,
  visualRef,
}: WorksItemProps) {
  const [metaOpen, setMetaOpen] = useState(false);
  const { metaLabels } = siteConfig.works;
  const indexNumber = String(index + 1).padStart(2, '0');
  const isReversed = index % 2 === 1;
  const titleLines = splitTitleLines(project.title);

  const handleToggleMeta = useCallback(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
      setMetaOpen((prev) => !prev);
    }
  }, []);

  return (
    <article
      className={`${styles.entry} ${isReversed ? styles.reversed : ''}`}
      ref={entryRef}
      data-works-entry
      data-project-slug={project.slug}
    >
      <div className={styles.inner}>
        <div className={styles.textCol}>
          <div className={styles.index} ref={indexRef} data-reveal-item data-cursor-style="drag">
            <span className={styles.indexLabel}>{siteConfig.works.indexLabel}</span>
            <span className={styles.indexNumber}>{indexNumber}</span>
          </div>

          <header className={styles.header} ref={headerRef}>
            <h3 className={styles.title} data-reveal-item>
              {titleLines.length > 1
                ? titleLines.map((line) => (
                    <span key={line} className={styles.titleLine}>
                      {line}
                    </span>
                  ))
                : project.title}
            </h3>
            {project.subtitle ? (
              <p
                className={`${styles.subtitle} ${hasKoreanText(project.subtitle) ? styles.subtitleKo : ''}`}
                lang={hasKoreanText(project.subtitle) ? 'ko' : undefined}
                data-reveal-item
              >
                {project.subtitle}
              </p>
            ) : null}
            <p className={styles.role} data-reveal-item>
              {project.role}
            </p>
            <span className={styles.year} data-reveal-item>
              {project.year}
            </span>
          </header>

          <dl
            className={`${styles.meta} ${metaOpen ? styles.metaOpen : ''}`}
            ref={metaRef}
            data-works-meta
          >
            <div className={styles.metaRow}>
              <dt>{metaLabels.client}</dt>
              <dd>{project.client}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>{metaLabels.year}</dt>
              <dd>{project.year}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>{metaLabels.role}</dt>
              <dd>{project.role}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>{metaLabels.contribution}</dt>
              <dd>{project.contribution}</dd>
            </div>
          </dl>

          <button
            type="button"
            className={styles.metaToggle}
            onClick={handleToggleMeta}
            aria-expanded={metaOpen}
            data-cursor-style="default"
          >
            {metaOpen ? 'Hide details' : 'View details'}
          </button>
        </div>

        <Link
          href={`/work/${project.slug}`}
          className={styles.visualLink}
          ref={visualRef}
          data-works-visual
          data-cursor-style="view"
          aria-label={`View ${project.title} project`}
        >
          <ProjectVisual project={project} priority={priority} />
        </Link>
      </div>

      <div className={styles.divider} aria-hidden="true" />
    </article>
  );
}
