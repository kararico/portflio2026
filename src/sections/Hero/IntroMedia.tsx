'use client';

import { useEffect, useState } from 'react';
import { heroStoryConfig } from '@/data/heroStory';
import { getProjectBySlug } from '@/data/projects';
import { getImageCandidates } from '@/utils/projectImage';
import styles from './IntroMedia.module.scss';

const slides = heroStoryConfig.sliderSlugs
  .map((slug) => getProjectBySlug(slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

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

function IntroSlideImage({ src, alt }: { src: string; alt: string }) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setResolvedSrc(null);

    probeImageSources(getImageCandidates(src)).then((resolved) => {
      if (!cancelled) setResolvedSrc(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!resolvedSrc) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolvedSrc} alt={alt} className={styles.image} decoding="async" />
  );
}

export default function IntroMedia() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduced || slides.length <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, heroStoryConfig.sliderIntervalMs);

    return () => window.clearInterval(id);
  }, [reduced]);

  if (slides.length === 0) return null;

  return (
    <div className={styles.media} data-intro-media>
      {slides.map((project, index) => (
        <div
          key={`${project.slug}-${index}`}
          className={styles.slide}
          data-slide-index={index}
          data-active={index === activeIndex ? 'true' : 'false'}
          aria-hidden={index !== activeIndex}
        >
          <IntroSlideImage src={project.thumbnail} alt={project.title} />
        </div>
      ))}
    </div>
  );
}
