'use client';

import Link from 'next/link';
import { useCallback, useId, useMemo, useState, type MouseEvent } from 'react';
import { siteConfig } from '@/data/site';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
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
  const panelId = useId();
  const { metaLabels, mobileInfoLabels } = siteConfig.works;
  const { openProject, isTransitioning } = useProjectTransition();
  const indexNumber = String(index + 1).padStart(2, '0');
  const isReversed = index % 2 === 1;
  const titleLines = splitTitleLines(project.title);

  const keyWorkItems = useMemo(() => {
    const fromDetail = project.projectDetail?.contributions;
    if (fromDetail?.length) return fromDetail.slice(0, 5);
    return project.responsibilities.slice(0, 5);
  }, [project]);

  const techStackItems = useMemo(() => {
    const fromDetail = project.projectDetail?.techStack;
    if (fromDetail?.length) return fromDetail;
    return project.stack;
  }, [project]);

  const handleToggleMeta = useCallback(() => {
    setMetaOpen((prev) => !prev);
  }, []);

  const handleVisualClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isTransitioning) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const sourceEl =
        event.currentTarget.querySelector<HTMLElement>('[data-works-image-inner]') ??
        event.currentTarget;
      openProject(project.slug, sourceEl);
    },
    [isTransitioning, openProject, project.slug],
  );

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

          <div className={styles.projectInfo}>
            <button
              type="button"
              className={`${styles.infoToggle} ${metaOpen ? styles.infoToggleOpen : ''}`}
              onClick={handleToggleMeta}
              aria-expanded={metaOpen}
              aria-controls={panelId}
              data-cursor-style="default"
            >
              <span className={styles.infoToggleLabel}>{mobileInfoLabels.toggle}</span>
              <span className={styles.infoToggleIcon} aria-hidden="true">
                {metaOpen ? '−' : '+'}
              </span>
            </button>

            <div
              id={panelId}
              className={`${styles.infoPanel} ${metaOpen ? styles.infoPanelOpen : ''}`}
            >
              <div className={styles.infoPanelInner}>
                <dl
                  className={styles.meta}
                  ref={metaRef}
                  data-works-meta
                >
                  <div className={styles.metaRow}>
                    <dt>{metaLabels.client}</dt>
                    <dd>{project.client}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt>{metaLabels.type}</dt>
                    <dd>{project.platform}</dd>
                  </div>
                  <div className={styles.metaRow}>
                    <dt>{metaLabels.contribution}</dt>
                    <dd>{project.contribution}</dd>
                  </div>

                  {keyWorkItems.length > 0 ? (
                    <div className={`${styles.metaBlock} ${styles.metaBlockMobile}`}>
                      <dt className={styles.metaBlockLabel}>{mobileInfoLabels.keyWork}</dt>
                      <dd>
                        <ul className={styles.metaList}>
                          {keyWorkItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}

                  {techStackItems.length > 0 ? (
                    <div className={`${styles.metaBlock} ${styles.metaBlockMobile}`}>
                      <dt className={styles.metaBlockLabel}>{mobileInfoLabels.techStack}</dt>
                      <dd>
                        <ul className={styles.stackList}>
                          {techStackItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/work/${project.slug}`}
          className={styles.visualLink}
          ref={visualRef}
          data-works-visual
          data-project-slug={project.slug}
          data-cursor-style="view"
          aria-label={`View ${project.title} project`}
          onClick={handleVisualClick}
        >
          <ProjectVisual project={project} priority={priority} />
        </Link>
      </div>

      <div className={styles.divider} aria-hidden="true" />
    </article>
  );
}
