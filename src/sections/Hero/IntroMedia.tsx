'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { heroStoryConfig } from '@/data/heroStory';
import { getHomeShowcaseSlides } from '@/data/projects';
import { resolveImageSrc } from '@/utils/projectImage';
import {
  initShowcaseLayer,
  killShowcaseAnimations,
  runShowcaseTransition,
  startKenBurnsDrift,
} from './introMediaShowcaseAnimation';
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

  /** 현재 화면에 보이는 슬라이드 인덱스 — 순서 SSOT */
  const currentIndexRef = useRef(0);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const [layerIndices, setLayerIndices] = useState<[number, number]>([0, 0]);
  const activeLayerRef = useRef<0 | 1>(0);
  const layerIndicesRef = useRef<[number, number]>([0, 0]);
  const isAdvancingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const layerRefs = useRef<[HTMLDivElement | null, HTMLDivElement | null]>([null, null]);
  const prevActiveLayerRef = useRef<0 | 1>(0);
  const isFirstPaintRef = useRef(true);
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = resolveImageSrc(slide.src);
    });
  }, [slides]);

  const advanceSlide = useCallback(() => {
    if (isAdvancingRef.current || slides.length <= 1) return;

    isAdvancingRef.current = true;

    const nextIndex = (currentIndexRef.current + 1) % slides.length;
    currentIndexRef.current = nextIndex;

    const nextLayer: 0 | 1 = activeLayerRef.current === 0 ? 1 : 0;
    const nextLayerIndices: [number, number] =
      nextLayer === 0
        ? [nextIndex, layerIndicesRef.current[1]]
        : [layerIndicesRef.current[0], nextIndex];

    layerIndicesRef.current = nextLayerIndices;
    activeLayerRef.current = nextLayer;
    setLayerIndices(nextLayerIndices);
    setActiveLayer(nextLayer);

    window.setTimeout(() => {
      isAdvancingRef.current = false;
    }, fadeDurationMs);
  }, [fadeDurationMs, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    const scheduleNext = () => {
      timerRef.current = window.setTimeout(() => {
        advanceSlide();
        scheduleNext();
      }, intervalMs);
    };

    const onVisibilityChange = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (document.visibilityState === 'visible') {
        scheduleNext();
      }
    };

    scheduleNext();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [advanceSlide, intervalMs, slides.length]);

  useLayoutEffect(() => {
    const layerEls = layerRefs.current;
    const images = layerEls.map((layer) => layer?.querySelector<HTMLElement>('[data-showcase-image]'));
    if (images.some((img) => !img)) return;

    const imageEls = images as [HTMLElement, HTMLElement];
    kenBurnsTweenRef.current?.kill();

    if (prefersReducedMotion) {
      killShowcaseAnimations(imageEls);
      imageEls.forEach((img, layer) => {
        initShowcaseLayer(img, layer === activeLayer);
      });
      prevActiveLayerRef.current = activeLayer;
      isFirstPaintRef.current = false;
      return;
    }

    if (isFirstPaintRef.current) {
      initShowcaseLayer(imageEls[0], true);
      initShowcaseLayer(imageEls[1], false);
      layerEls[0] && (layerEls[0].style.zIndex = '1');
      layerEls[1] && (layerEls[1].style.zIndex = '0');
      kenBurnsTweenRef.current = startKenBurnsDrift(imageEls[activeLayer], intervalMs);
      prevActiveLayerRef.current = activeLayer;
      isFirstPaintRef.current = false;
      return;
    }

    const outgoingLayer = prevActiveLayerRef.current;
    const incomingLayer = activeLayer;

    if (outgoingLayer === incomingLayer) return;

    const outgoingLayerEl = layerEls[outgoingLayer];
    const incomingLayerEl = layerEls[incomingLayer];
    if (!outgoingLayerEl || !incomingLayerEl) return;

    runShowcaseTransition(
      imageEls[outgoingLayer],
      imageEls[incomingLayer],
      outgoingLayerEl,
      incomingLayerEl,
    );

    kenBurnsTweenRef.current = startKenBurnsDrift(imageEls[incomingLayer], intervalMs);
    prevActiveLayerRef.current = incomingLayer;
  }, [activeLayer, layerIndices, prefersReducedMotion, intervalMs]);

  useEffect(() => {
    const images = layerRefs.current
      .map((layer) => layer?.querySelector<HTMLElement>('[data-showcase-image]'))
      .filter((img): img is HTMLElement => Boolean(img));

    return () => {
      kenBurnsTweenRef.current?.kill();
      killShowcaseAnimations(images);
    };
  }, []);

  if (!slides.length) return null;

  const visibleIndex = activeLayer === 0 ? layerIndices[0] : layerIndices[1];
  const visibleSlide = slides[visibleIndex];

  return (
    <div className={styles.media} data-intro-media>
      {[0, 1].map((layer) => {
        const slideIndex = layer === 0 ? layerIndices[0] : layerIndices[1];
        const slide = slides[slideIndex];
        const isActive = layer === activeLayer;

        return (
          <div
            key={layer}
            ref={(node) => {
              layerRefs.current[layer as 0 | 1] = node;
            }}
            className={`${styles.imageLayer} ${isActive ? styles.imageLayerActive : ''} ${prefersReducedMotion ? styles.imageLayerInstant : ''}`}
            data-showcase-layer={layer}
            aria-hidden={!isActive}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageSrc(slide.src)}
              alt={isActive ? slide.title : ''}
              className={styles.image}
              data-showcase-image
              data-showcase-index={slideIndex}
              decoding="async"
              loading={layer === 0 ? 'eager' : 'lazy'}
            />
          </div>
        );
      })}
      <span className="sr-only">{visibleSlide.title}</span>
    </div>
  );
}
