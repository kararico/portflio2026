'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Project } from '@/types/project';
import { getProjectHeroCandidates } from '@/utils/projectImage';
import styles from './ProjectVisual.module.scss';

interface ProjectVisualProps {
  project: Project;
  priority?: boolean;
  isMobile?: boolean;
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzU2JyB2aWV3Qm94PScwIDAgMTAwIDU2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWUnLz48L3N2Zz4=';

function probeImageSources(sources: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    let index = 0;

    const tryNext = () => {
      if (index >= sources.length) {
        resolve(null);
        return;
      }

      const probe = new window.Image();
      probe.onload = () => resolve(sources[index]);
      probe.onerror = () => {
        index += 1;
        tryNext();
      };
      probe.src = sources[index];
    };

    tryNext();
  });
}

export default function ProjectVisual({ project, priority = false, isMobile = false }: ProjectVisualProps) {
  const candidates = useMemo(
    () => getProjectHeroCandidates(project, isMobile),
    [project, isMobile],
  );
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedSrc(null);

    probeImageSources(candidates).then((resolved) => {
      if (!cancelled) setResolvedSrc(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [candidates]);

  const handleError = useCallback(() => {
    setResolvedSrc(null);
  }, []);

  return (
    <div className={styles.frame} data-project-slug={project.slug}>
      <div className={styles.inner} data-works-image-inner>
        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt={`${project.title} — ${project.client}, ${project.year}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className={styles.image}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            onError={handleError}
            unoptimized={resolvedSrc.endsWith('.svg')}
          />
        ) : (
          <div
            className={styles.placeholder}
            data-slug={project.slug}
            role="img"
            aria-label={`${project.title} preview`}
          />
        )}
      </div>
    </div>
  );
}
