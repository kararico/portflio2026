'use client';

import Image from 'next/image';
import type { Project } from '@/types/project';
import { getProjectThumbnail, resolveImageSrc } from '@/utils/projectImage';
import styles from './ProjectVisual.module.scss';

interface ProjectVisualProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectVisual({ project, priority = false }: ProjectVisualProps) {
  const resolvedSrc = resolveImageSrc(getProjectThumbnail(project));

  return (
    <div className={styles.frame} data-project-slug={project.slug}>
      <div className={styles.inner} data-works-image-inner>
        <Image
          src={resolvedSrc}
          alt={`${project.title} — ${project.client}, ${project.year}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className={styles.image}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          placeholder="empty"
        />
      </div>
    </div>
  );
}
