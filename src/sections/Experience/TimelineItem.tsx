import Link from 'next/link';
import type { CareerEntry } from '@/types/career';
import { siteConfig } from '@/data/site';
import styles from './Experience.module.scss';

interface TimelineItemProps {
  entry: CareerEntry;
  index: number;
}

export default function TimelineItem({ entry, index }: TimelineItemProps) {
  const { projectsLabel, stackLabel } = siteConfig.experience;

  return (
    <article
      className={styles.item}
      data-timeline-item
      data-career-id={entry.id}
    >
      <div className={styles.periodCol}>
        <time className={styles.period} dateTime={entry.period} data-reveal-item>
          {entry.period}
        </time>
        <span className={styles.index} aria-hidden="true" data-reveal-item>
          {String(index + 1).padStart(2, '0')}
        </span>
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
            {entry.projects.map((project) => (
              <li key={project.title} data-reveal-item>
                {project.slug ? (
                  <Link
                    href={`/work/${project.slug}`}
                    className={styles.projectLink}
                    data-cursor-style="small"
                  >
                    {project.title}
                  </Link>
                ) : (
                  <span>{project.title}</span>
                )}
              </li>
            ))}
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
