'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { heroStoryConfig } from '@/data/heroStory';
import { getHomeShowcaseSlides } from '@/data/projects';
import { resolveImageSrc } from '@/utils/projectImage';
import {
  initShowcaseLayer,
  killShowcaseAnimations,
  preloadShowcaseImage,
  runShowcaseTransition,
  startKenBurnsDrift,
  waitForImageElement,
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
  /** crossfade 완료 후에만 갱신 — 전환 중 outgoing 유지 */
  const [displayLayer, setDisplayLayer] = useState<0 | 1>(0);
  const [layerIndices, setLayerIndices] = useState<[number, number]>([0, 0]);
  const displayLayerRef = useRef<0 | 1>(0);
  const layerIndicesRef = useRef<[number, number]>([0, 0]);
  const isAdvancingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const layerRefs = useRef<[HTMLDivElement | null, HTMLDivElement | null]>([null, null]);
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstPaintRef = useRef(true);

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = resolveImageSrc(slide.src);
    });
  }, [slides]);

  const runCrossfade = useCallback(
    (outgoingLayer: 0 | 1, incomingLayer: 0 | 1) => {
      const layerEls = layerRefs.current;
      const outgoingLayerEl = layerEls[outgoingLayer];
      const incomingLayerEl = layerEls[incomingLayer];
      const outgoingImg = outgoingLayerEl?.querySelector<HTMLImageElement>('[data-showcase-image]');
      const incomingImg = incomingLayerEl?.querySelector<HTMLImageElement>('[data-showcase-image]');

      if (!outgoingLayerEl || !incomingLayerEl || !outgoingImg || !incomingImg) {
        isAdvancingRef.current = false;
        return;
      }

      kenBurnsTweenRef.current?.kill();
      transitionTimelineRef.current?.kill();

      if (prefersReducedMotion) {
        initShowcaseLayer(outgoingImg, false);
        initShowcaseLayer(incomingImg, true);
        displayLayerRef.current = incomingLayer;
        setDisplayLayer(incomingLayer);
        isAdvancingRef.current = false;
        return;
      }

      transitionTimelineRef.current = runShowcaseTransition(
        outgoingImg,
        incomingImg,
        outgoingLayerEl,
        incomingLayerEl,
        () => {
          displayLayerRef.current = incomingLayer;
          setDisplayLayer(incomingLayer);
          kenBurnsTweenRef.current = startKenBurnsDrift(incomingImg, intervalMs);
          isAdvancingRef.current = false;
          transitionTimelineRef.current = null;
        },
      );
    },
    [intervalMs, prefersReducedMotion],
  );

  const advanceSlide = useCallback(() => {
    if (isAdvancingRef.current || slides.length <= 1) return;

    isAdvancingRef.current = true;

    const nextIndex = (currentIndexRef.current + 1) % slides.length;
    currentIndexRef.current = nextIndex;

    const outgoingLayer = displayLayerRef.current;
    const incomingLayer: 0 | 1 = outgoingLayer === 0 ? 1 : 0;
    const nextSrc = resolveImageSrc(slides[nextIndex].src);

    preloadShowcaseImage(nextSrc)
      .then(() => {
        const nextLayerIndices: [number, number] =
          incomingLayer === 0
            ? [nextIndex, layerIndicesRef.current[1]]
            : [layerIndicesRef.current[0], nextIndex];

        layerIndicesRef.current = nextLayerIndices;
        setLayerIndices(nextLayerIndices);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const incomingImg = layerRefs.current[incomingLayer]?.querySelector<HTMLImageElement>(
              '[data-showcase-image]',
            );

            if (!incomingImg) {
              isAdvancingRef.current = false;
              return;
            }

            waitForImageElement(incomingImg)
              .then(() => runCrossfade(outgoingLayer, incomingLayer))
              .catch(() => {
                isAdvancingRef.current = false;
              });
          });
        });
      })
      .catch(() => {
        isAdvancingRef.current = false;
      });

    window.setTimeout(() => {
      if (isAdvancingRef.current) {
        isAdvancingRef.current = false;
      }
    }, fadeDurationMs * 2);
  }, [fadeDurationMs, runCrossfade, slides]);

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
    if (!isFirstPaintRef.current) return;

    const layerEls = layerRefs.current;
    const images = layerEls.map((layer) => layer?.querySelector<HTMLElement>('[data-showcase-image]'));
    if (images.some((img) => !img)) return;

    const imageEls = images as [HTMLElement, HTMLElement];

    if (prefersReducedMotion) {
      initShowcaseLayer(imageEls[0], true);
      initShowcaseLayer(imageEls[1], false);
    } else {
      initShowcaseLayer(imageEls[0], true);
      initShowcaseLayer(imageEls[1], false);
      layerEls[0] && (layerEls[0].style.zIndex = '1');
      layerEls[1] && (layerEls[1].style.zIndex = '0');
      kenBurnsTweenRef.current = startKenBurnsDrift(imageEls[0], intervalMs);
    }

    isFirstPaintRef.current = false;
  }, [intervalMs, prefersReducedMotion]);

  useEffect(() => {
    const images = layerRefs.current
      .map((layer) => layer?.querySelector<HTMLElement>('[data-showcase-image]'))
      .filter((img): img is HTMLElement => Boolean(img));

    return () => {
      kenBurnsTweenRef.current?.kill();
      transitionTimelineRef.current?.kill();
      killShowcaseAnimations(images);
    };
  }, []);

  if (!slides.length) return null;

  const visibleIndex =
    displayLayer === 0 ? layerIndices[0] : layerIndices[1];
  const visibleSlide = slides[visibleIndex];

  return (
    <div className={styles.media} data-intro-media>
      {[0, 1].map((layer) => {
        const slideIndex = layer === 0 ? layerIndices[0] : layerIndices[1];
        const slide = slides[slideIndex];
        const isDisplayed = layer === displayLayer;

        return (
          <div
            key={layer}
            ref={(node) => {
              layerRefs.current[layer as 0 | 1] = node;
            }}
            className={`${styles.imageLayer} ${isDisplayed ? styles.imageLayerActive : ''}`}
            data-showcase-layer={layer}
            aria-hidden={!isDisplayed}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageSrc(slide.src)}
              alt={isDisplayed ? slide.title : ''}
              className={styles.image}
              data-showcase-image
              data-showcase-index={slideIndex}
              decoding="async"
              loading="eager"
            />
          </div>
        );
      })}
      <span className="sr-only">{visibleSlide.title}</span>
    </div>
  );
}
