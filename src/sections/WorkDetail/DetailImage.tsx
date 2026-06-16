'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import type { Project } from '@/types/project';
import {
  getImageCandidates,
  getProjectDetailHeroCandidates,
  getProjectDetailHeroPrimarySrc,
  getProjectHeroObjectPosition,
  getVisualMainHeroPath,
} from '@/utils/projectImage';
import type { EditorialImageLayout } from '@/utils/detailEditorialLayout';
import styles from './DetailImage.module.scss';

interface DetailImageProps {
  src: string;
  alt: string;
  slug: string;
  priority?: boolean;
  variant?: 'hero' | 'editorial';
  layout?: EditorialImageLayout;
  project?: Project;
}

const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJyBoZWlnaHQ9JzU2JyB2aWV3Qm94PScwIDAgMTAwIDU2JyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyNlZWFlOCc+PC9zdmc+';

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

function frameClassName(variant: DetailImageProps['variant'], layout: EditorialImageLayout): string {
  if (variant === 'hero') {
    return `${styles.frame} ${styles.frameHero}`;
  }

  switch (layout) {
    case 'wide':
    case 'duo':
      return `${styles.frame} ${styles.frameWide}`;
    case 'small':
      return `${styles.frame} ${styles.frameSmall}`;
    case 'next':
      return `${styles.frame} ${styles.frameNext}`;
    case 'tall':
      return `${styles.frame} ${styles.frameTall}`;
    case 'sketch':
      return `${styles.frame} ${styles.frameSketch}`;
    case 'large':
    default:
      return `${styles.frame} ${styles.frameLarge}`;
  }
}

function imageSizes(variant: DetailImageProps['variant'], layout: EditorialImageLayout): string {
  if (variant === 'hero') {
    return '(max-width: 767px) 100vw, 50vw';
  }

  switch (layout) {
    case 'small':
      return '(max-width: 767px) 100vw, 28vw';
    case 'next':
      return '(max-width: 767px) 100vw, 25vw';
    case 'tall':
      return '(max-width: 767px) 100vw, 24vw';
    case 'wide':
    case 'duo':
      return '(max-width: 767px) 100vw, 58vw';
    case 'sketch':
      return '(max-width: 767px) 100vw, 36vw';
    case 'large':
    default:
      return '(max-width: 767px) 100vw, 88vw';
  }
}

function resolveCandidates(
  src: string,
  variant: DetailImageProps['variant'],
  project?: Project,
): string[] {
  if (variant === 'hero' && project) {
    return getProjectDetailHeroCandidates(project);
  }
  return getImageCandidates(src);
}

function resolveInitialSrc(
  src: string,
  priority: boolean,
  variant: DetailImageProps['variant'],
  project?: Project,
): string | null {
  if (priority && variant === 'hero' && project) {
    return getProjectDetailHeroPrimarySrc(project);
  }
  return null;
}

export default function DetailImage({
  src,
  alt,
  slug,
  priority = false,
  variant = 'editorial',
  layout = 'large',
  project,
}: DetailImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(() =>
    resolveInitialSrc(src, priority, variant, project),
  );

  useEffect(() => {
    let cancelled = false;
    const candidates = resolveCandidates(src, variant, project);

    if (priority && variant === 'hero' && project) {
      const visualMain = getVisualMainHeroPath(project.slug);
      if (visualMain) {
        setResolvedSrc(visualMain);
        return () => {
          cancelled = true;
        };
      }

      probeImageSources(candidates).then((resolved) => {
        if (!cancelled && resolved) setResolvedSrc(resolved);
      });
      return () => {
        cancelled = true;
      };
    }

    setResolvedSrc(null);
    probeImageSources(candidates).then((resolved) => {
      if (!cancelled) setResolvedSrc(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [src, priority, variant, project]);

  const handleError = useCallback(() => {
    setResolvedSrc(null);
  }, []);

  const frameStyle: CSSProperties | undefined =
    variant === 'hero' && project
      ? ({ '--hero-position': getProjectHeroObjectPosition(project) } as CSSProperties)
      : undefined;

  return (
    <div
      className={frameClassName(variant, layout)}
      data-project-slug={slug}
      data-shared-hero-target={variant === 'hero' ? 'true' : undefined}
      style={frameStyle}
    >
      <div
        className={styles.inner}
        data-detail-media-inner
        data-gallery-inner={variant === 'editorial' ? true : undefined}
      >
        {resolvedSrc ? (
          <Image
            src={resolvedSrc}
            alt={alt}
            fill
            sizes={imageSizes(variant, layout)}
            className={styles.image}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            placeholder={priority && variant === 'hero' ? 'empty' : 'blur'}
            blurDataURL={priority && variant === 'hero' ? undefined : BLUR_DATA_URL}
            onError={handleError}
            unoptimized={resolvedSrc.endsWith('.svg')}
          />
        ) : (
          <div className={styles.placeholder} role="img" aria-label={alt} />
        )}
      </div>
    </div>
  );
}
