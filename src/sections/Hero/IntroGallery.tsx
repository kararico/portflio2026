'use client';

import { useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';
import {
  heroStoryConfig,
  getEditorialPlateLayoutLog,
  getEditorialPlateMotionLog,
  type HeroGalleryLayer,
  type EditorialPlateLayout,
} from '@/data/heroStory';
import { getProjectBySlug } from '@/data/projects';
import { getImageCandidates, getProjectThumbnail } from '@/utils/projectImage';
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

function PlateImage({ src, slug }: { src: string; slug: string }) {
  const resolvedSrc = usePreloadedSrc(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={slug}
      src={resolvedSrc ?? getImageCandidates(src)[0]}
      alt=""
      className={styles.image}
      data-hero-plate-image
      decoding="async"
      loading="eager"
      data-thumbnail-src={getImageCandidates(src)[0]}
    />
  );
}

function plateLayoutStyle(layout: EditorialPlateLayout): CSSProperties {
  return {
    top: layout.pt,
    right: layout.pr,
    ['--img-w' as string]: layout.imgW,
    ['--img-ratio' as string]: String(layout.imgRatio),
  };
}

const LAYER_CLASS: Record<HeroGalleryLayer, string> = {
  behind: styles.layerBehind,
  between: styles.layerBetween,
  front: styles.layerFront,
};

interface EditorialPlatesProps {
  layer: HeroGalleryLayer;
}

function EditorialPlates({ layer }: EditorialPlatesProps) {
  const { openProject } = useProjectTransition();

  const plates = heroStoryConfig.editorialPlates
    .filter((item) => item.layer === layer)
    .map((item) => {
      const project = getProjectBySlug(item.slug);
      if (!project) return null;
      return { ...item, project };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!plates.length) return null;

  return (
    <div
      className={`${styles.galleryWrapper} ${LAYER_CLASS[layer]}`}
      data-intro-gallery
      data-editorial-layer={layer}
    >
      {plates.map(({ id, layout, project }) => (
        <div key={id} className={styles.projectItem} data-plate-id={id}>
          <div
            className={styles.plateAnchor}
            data-hero-float
            data-hero-plate
            data-gallery-item
            data-plate-id={id}
            data-editorial-layer={layer}
            data-project-slug={project.slug}
            data-cursor-style="view"
            style={plateLayoutStyle(layout)}
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
            <div className={styles.mediaBox} data-hero-plate-media>
              <PlateImage src={getProjectThumbnail(project)} slug={project.slug} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function useEditorialPreload() {
  useEffect(() => {
    heroStoryConfig.editorialPlates.forEach((item) => {
      const project = getProjectBySlug(item.slug);
      if (!project) return;
      getImageCandidates(getProjectThumbnail(project)).forEach((candidate) => {
        const img = new window.Image();
        img.src = candidate;
      });
    });
  }, []);
}

function useEditorialLayoutDebug() {
  useLayoutEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    console.group('[Hero Editorial Gallery]');
    console.table(getEditorialPlateLayoutLog());
    console.table(getEditorialPlateMotionLog());
    console.groupEnd();
  }, []);
}

/** 타이포 뒤 */
export function EditorialPlatesBehind() {
  useEditorialPreload();
  useEditorialLayoutDebug();
  return <EditorialPlates layer="behind" />;
}

/** 중앙 미디어 ↔ front 타이포 사이 */
export function EditorialPlatesBetween() {
  return <EditorialPlates layer="between" />;
}

/** 타이포 위 */
export function EditorialPlatesFront() {
  return <EditorialPlates layer="front" />;
}

/** @deprecated */
export const IntroGalleryBehind = EditorialPlatesBehind;
export const IntroGalleryBetween = EditorialPlatesBetween;
export const IntroGalleryFront = EditorialPlatesFront;
