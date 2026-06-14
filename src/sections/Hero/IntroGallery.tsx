'use client';

import { useEffect, useState } from 'react';
import { heroStoryConfig } from '@/data/heroStory';
import { getProjectBySlug } from '@/data/projects';
import { getImageCandidates } from '@/utils/projectImage';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
import styles from './IntroGallery.module.scss';

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

function usePreloadedSrc(src: string): string | null {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    probeImageSources(getImageCandidates(src)).then((resolved) => {
      if (!cancelled) setResolvedSrc(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [src]);

  return resolvedSrc;
}

function GalleryImage({ src }: { src: string }) {
  const resolvedSrc = usePreloadedSrc(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc ?? getImageCandidates(src)[0]}
      alt=""
      className={styles.image}
      decoding="async"
      loading="eager"
      style={{ opacity: resolvedSrc ? 1 : 0 }}
    />
  );
}

export default function IntroGallery() {
  const { openProject } = useProjectTransition();

  const items = heroStoryConfig.floatingItems
    .map((item, index) => {
      const project = getProjectBySlug(item.slug);
      if (!project) return null;
      return { ...item, project, key: `${item.slug}-${item.slot}-${index}` };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  useEffect(() => {
    heroStoryConfig.floatingItems.forEach((item) => {
      const project = getProjectBySlug(item.slug);
      if (!project) return;
      getImageCandidates(project.thumbnail).forEach((candidate) => {
        const img = new window.Image();
        img.src = candidate;
      });
    });
  }, []);

  return (
    <div className={styles.scene} data-intro-gallery>
      <div className={styles.backdrop} data-gallery-backdrop aria-hidden="true" />
      <div className={styles.inner}>
        {items.map(({ key, slot, aspect, project }) => (
          <figure
            key={key}
            className={styles.item}
            data-hero-float
            data-gallery-item
            data-float={slot}
            data-project-slug={project.slug}
            data-cursor-style="view"
            style={{ aspectRatio: aspect }}
            role="button"
            tabIndex={0}
            onClick={(event) => {
              event.preventDefault();
              openProject(project.slug, event.currentTarget);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              openProject(project.slug, event.currentTarget);
            }}
          >
            <GalleryImage src={project.thumbnail} />
          </figure>
        ))}
      </div>
    </div>
  );
}
