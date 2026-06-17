'use client';

import Image from 'next/image';
import { useCallback, type CSSProperties, type KeyboardEvent } from 'react';
import type { Project } from '@/types/project';
import { useDetailImageViewer } from '@/components/DetailImageViewer/DetailImageViewerContext';
import { getProjectHeroObjectPosition, resolveImageSrc } from '@/utils/projectImage';
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
  /** false면 클릭 뷰어 비활성 (Next project 썸네일 등) */
  viewable?: boolean;
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

export default function DetailImage({
  src,
  alt,
  slug,
  priority = false,
  variant = 'editorial',
  layout = 'large',
  project,
  viewable = true,
}: DetailImageProps) {
  const { openViewer } = useDetailImageViewer();
  const resolvedSrc = resolveImageSrc(src);

  const handleOpenViewer = useCallback(
    (event: { stopPropagation: () => void }) => {
      if (!viewable || !resolvedSrc) return;
      event.stopPropagation();
      openViewer({ src: resolvedSrc, alt });
    },
    [viewable, resolvedSrc, alt, openViewer],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!viewable || !resolvedSrc) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openViewer({ src: resolvedSrc, alt });
    },
    [viewable, resolvedSrc, alt, openViewer],
  );

  const frameStyle: CSSProperties | undefined =
    variant === 'hero' && project
      ? ({ '--hero-position': getProjectHeroObjectPosition(project) } as CSSProperties)
      : undefined;

  return (
    <div
      className={frameClassName(variant, layout)}
      data-project-slug={slug}
      data-shared-hero-target={variant === 'hero' ? 'true' : undefined}
      data-detail-image-frame={viewable ? 'true' : undefined}
      data-detail-image-requested-src={src}
      data-detail-image-resolved-src={resolvedSrc}
      style={frameStyle}
      role={viewable ? 'button' : undefined}
      tabIndex={viewable ? 0 : undefined}
      onClick={viewable ? handleOpenViewer : undefined}
      onKeyDown={viewable ? handleKeyDown : undefined}
    >
      <div
        className={styles.inner}
        data-detail-media-inner
        data-gallery-inner={variant === 'editorial' ? true : undefined}
      >
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes={imageSizes(variant, layout)}
          className={styles.image}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          placeholder="empty"
          unoptimized={resolvedSrc.endsWith('.svg')}
        />
      </div>
    </div>
  );
}
