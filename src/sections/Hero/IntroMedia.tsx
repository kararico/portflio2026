'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { heroStoryConfig } from '@/data/heroStory';
import { getHomeShowcaseSlides } from '@/data/projects';
import { resolveImageSrc } from '@/utils/projectImage';
import styles from './IntroMedia.module.scss';

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener('change', sync);
    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  return prefersReducedMotion;
}

export default function IntroMedia() {
  const slides = useMemo(() => getHomeShowcaseSlides(), []);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { intervalMs, fadeDurationMs } = heroStoryConfig.showcaseSlider;

  const [layerIndices, setLayerIndices] = useState<[number, number]>([0, 0]);
  const [activeLayer, setActiveLayer] = useState(0);
  const layerIndicesRef = useRef<[number, number]>([0, 0]);
  const activeLayerRef = useRef(0);

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = resolveImageSrc(slide.src);
    });
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1 || prefersReducedMotion) return undefined;

    const intervalId = window.setInterval(() => {
      const currentLayer = activeLayerRef.current;
      const nextLayer = currentLayer === 0 ? 1 : 0;
      const currentIndex =
        currentLayer === 0 ? layerIndicesRef.current[0] : layerIndicesRef.current[1];
      const nextIndex = (currentIndex + 1) % slides.length;

      const nextIndices: [number, number] =
        nextLayer === 0
          ? [nextIndex, layerIndicesRef.current[1]]
          : [layerIndicesRef.current[0], nextIndex];

      layerIndicesRef.current = nextIndices;
      activeLayerRef.current = nextLayer;
      setLayerIndices(nextIndices);
      setActiveLayer(nextLayer);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [slides.length, intervalMs, prefersReducedMotion]);

  if (!slides.length) return null;

  const visibleIndex = activeLayer === 0 ? layerIndices[0] : layerIndices[1];
  const visibleSlide = slides[visibleIndex];

  return (
    <div
      className={styles.media}
      data-intro-media
      style={{ ['--fade-duration' as string]: `${fadeDurationMs}ms` }}
    >
      {[0, 1].map((layer) => {
        const slide = slides[layer === 0 ? layerIndices[0] : layerIndices[1]];
        const isActive = layer === activeLayer;

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={layer}
            src={resolveImageSrc(slide.src)}
            alt={isActive ? slide.title : ''}
            aria-hidden={!isActive}
            className={`${styles.image} ${styles.imageLayer} ${isActive ? styles.imageLayerActive : ''}`}
            decoding="async"
            loading={layer === 0 ? 'eager' : 'lazy'}
          />
        );
      })}
      <span className="sr-only">{visibleSlide.title}</span>
    </div>
  );
}
