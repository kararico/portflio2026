import Link from 'next/link';
import type { CareerEntry } from '@/types/career';
import { siteConfig } from '@/data/site';
import styles from './Experience.module.scss';

interface TimelineItemProps {
  entry: CareerEntry;
}

function parseCareerPeriod(period: string): { start: string; end?: string } {
  const parts = period.split(/\s*—\s*/);
  if (parts.length < 2) {
    return { start: period.trim() };
  }
  return { start: parts[0].trim(), end: parts.slice(1).join(' — ').trim() };
}

export default function TimelineItem({ entry }: TimelineItemProps) {
  const { projectsLabel, stackLabel } = siteConfig.experience;
  const { start: periodStart, end: periodEnd } = parseCareerPeriod(entry.period);

  return (
    <article
      className={styles.item}
      data-timeline-item
      data-career-id={entry.id}
    >
      <div className={styles.periodCol}>
        <time className={styles.period} dateTime={entry.period} data-reveal-item>
          <span className={styles.periodStart}>{periodStart}</span>
          {periodEnd ? (
            <>
              <span className={styles.periodSep} aria-hidden="true">
                —
              </span>
              <span className={styles.periodEnd}>{periodEnd}</span>
            </>
          ) : null}
        </time>
      </div>

      <div
        className={styles.contentCol}
        data-few-projects={entry.projects.length <= 3 ? 'true' : undefined}
      >
        <header className={styles.header}>
          <h3 className={styles.company} data-reveal-item>
            {entry.company}
          </h3>
          <p className={styles.role} data-reveal-item>
            {entry.role}
          </p>
        </header>

        <div className={styles.block}>
          <span className={styles.blockLabel} data-reveal-item>
            {projectsLabel}
          </span>
          <ul className={styles.projectList}>
            {entry.projects.map((project) => {
              const key = project.slug ?? `${entry.id}-${project.name}`;

              return (
                <li key={key} className={styles.projectItem} data-reveal-item>
                  {project.slug ? (
                    <Link
                      href={`/work/${project.slug}`}
                      className={styles.projectLink}
                      data-cursor-style="small"
                    >
                      <span className={styles.projectName}>{project.name}</span>
                      <span className={styles.projectDesc}>{project.description}</span>
                    </Link>
                  ) : (
                    <div className={styles.projectEntry}>
                      <span className={styles.projectName}>{project.name}</span>
                      <span className={styles.projectDesc}>{project.description}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {entry.stack && entry.stack.length > 0 ? (
          <div className={`${styles.block} ${styles.stackBlock}`}>
            <span className={styles.blockLabel} data-reveal-item>
              {stackLabel}
            </span>
            <ul className={styles.stackList}>
              {entry.stack.map((tech) => (
                <li key={tech} data-reveal-item>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
