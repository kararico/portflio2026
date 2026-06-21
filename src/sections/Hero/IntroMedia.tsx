'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { heroStoryConfig } from '@/data/heroStory';
import { getHomeShowcaseSlides } from '@/data/projects';
import { resolveImageSrc } from '@/utils/projectImage';
import {
  hideShowcaseBufferLayer,
  killShowcaseAnimations,
  preloadShowcaseImage,
  readLayerOpacity,
  runShowcaseTransition,
  safeKillShowcaseTransition,
  showShowcaseActiveLayer,
  startKenBurnsDrift,
  waitForDomImageReady,
} from './introMediaShowcaseAnimation';
import styles from './IntroMedia.module.scss';

/** 전환 검증 로그 — 확인 후 false로 변경 */
const SHOWCASE_TRANSITION_LOG = process.env.NODE_ENV === 'development';

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

type ShowcaseLayer = 0 | 1;

export default function IntroMedia() {
  const slides = useMemo(() => getHomeShowcaseSlides(), []);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { intervalMs } = heroStoryConfig.showcaseSlider;

  /** 현재 화면에 보이는 슬라이드 인덱스 — 순서 SSOT */
  const currentIndexRef = useRef(0);
  /** crossfade 완료 후에만 갱신 — 전환 중 outgoing 유지 */
  const [displayLayer, setDisplayLayer] = useState<ShowcaseLayer>(0);
  const [layerIndices, setLayerIndices] = useState<[number, number]>([0, 0]);
  const displayLayerRef = useRef<ShowcaseLayer>(0);
  const layerIndicesRef = useRef<[number, number]>([0, 0]);
  const isAdvancingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const layerRefs = useRef<[HTMLDivElement | null, HTMLDivElement | null]>([null, null]);
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null);
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstPaintRef = useRef(true);
  const scheduleNextSlideRef = useRef<(delayMs?: number) => void>(() => {});

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new window.Image();
      img.src = resolveImageSrc(slide.src);
    });
  }, [slides]);

  const clearSlideTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const logTransition = useCallback(
    (
      phase: 'start' | 'complete',
      outgoingLayer: ShowcaseLayer,
      incomingLayer: ShowcaseLayer,
    ) => {
      if (!SHOWCASE_TRANSITION_LOG) return;

      const layerEls = layerRefs.current;
      console.log('[IntroMedia transition]', {
        phase,
        currentIndex: currentIndexRef.current,
        displayLayer: displayLayerRef.current,
        incomingLayer,
        outgoingLayer,
        layer0Index: layerIndicesRef.current[0],
        layer1Index: layerIndicesRef.current[1],
        layer0Opacity: readLayerOpacity(layerEls[0]),
        layer1Opacity: readLayerOpacity(layerEls[1]),
        isAdvancing: isAdvancingRef.current,
      });
    },
    [],
  );

  const finishTransition = useCallback(
    (incomingLayer: ShowcaseLayer, incomingImg: HTMLImageElement) => {
      const layerEls = layerRefs.current;
      const outgoingLayer: ShowcaseLayer = incomingLayer === 0 ? 1 : 0;
      const outgoingEl = layerEls[outgoingLayer];
      const outgoingImg = outgoingEl?.querySelector<HTMLImageElement>('[data-showcase-image]');

      if (outgoingEl && outgoingImg) {
        hideShowcaseBufferLayer(outgoingEl, outgoingImg);
      }

      displayLayerRef.current = incomingLayer;
      setDisplayLayer(incomingLayer);
      transitionTimelineRef.current = null;
      isAdvancingRef.current = false;

      if (!prefersReducedMotion) {
        kenBurnsTweenRef.current = startKenBurnsDrift(incomingImg, intervalMs);
      }

      logTransition('complete', outgoingLayer, incomingLayer);
      scheduleNextSlideRef.current(intervalMs);
    },
    [intervalMs, logTransition, prefersReducedMotion],
  );

  const abortAdvance = useCallback(
    (previousIndex: number) => {
      currentIndexRef.current = previousIndex;
      isAdvancingRef.current = false;
      scheduleNextSlideRef.current(intervalMs);
    },
    [intervalMs],
  );

  const runCrossfade = useCallback(
    (outgoingLayer: ShowcaseLayer, incomingLayer: ShowcaseLayer) => {
      if (transitionTimelineRef.current) return;

      const layerEls = layerRefs.current;
      const outgoingLayerEl = layerEls[outgoingLayer];
      const incomingLayerEl = layerEls[incomingLayer];
      const outgoingImg = outgoingLayerEl?.querySelector<HTMLImageElement>('[data-showcase-image]');
      const incomingImg = incomingLayerEl?.querySelector<HTMLImageElement>('[data-showcase-image]');

      if (!outgoingLayerEl || !incomingLayerEl || !outgoingImg || !incomingImg) {
        abortAdvance(
          (currentIndexRef.current - 1 + slides.length) % slides.length,
        );
        return;
      }

      kenBurnsTweenRef.current?.kill();
      logTransition('start', outgoingLayer, incomingLayer);

      if (prefersReducedMotion) {
        hideShowcaseBufferLayer(outgoingLayerEl, outgoingImg);
        showShowcaseActiveLayer(incomingLayerEl, incomingImg);
        finishTransition(incomingLayer, incomingImg);
        return;
      }

      transitionTimelineRef.current = runShowcaseTransition(
        outgoingImg,
        incomingImg,
        outgoingLayerEl,
        incomingLayerEl,
        () => {
          finishTransition(incomingLayer, incomingImg);
        },
      );
    },
    [abortAdvance, finishTransition, logTransition, prefersReducedMotion, slides.length],
  );

  const advanceSlide = useCallback(() => {
    if (
      isAdvancingRef.current ||
      transitionTimelineRef.current ||
      slides.length <= 1
    ) {
      return;
    }

    clearSlideTimer();
    isAdvancingRef.current = true;

    const previousIndex = currentIndexRef.current;
    const nextIndex = (previousIndex + 1) % slides.length;
    currentIndexRef.current = nextIndex;

    const outgoingLayer = displayLayerRef.current;
    const incomingLayer: ShowcaseLayer = outgoingLayer === 0 ? 1 : 0;
    const nextSrc = resolveImageSrc(slides[nextIndex].src);

    preloadShowcaseImage(nextSrc)
      .then(() => {
        if (!isAdvancingRef.current) return;

        const nextLayerIndices: [number, number] =
          incomingLayer === 0
            ? [nextIndex, layerIndicesRef.current[1]]
            : [layerIndicesRef.current[0], nextIndex];

        layerIndicesRef.current = nextLayerIndices;
        setLayerIndices(nextLayerIndices);

        const incomingLayerEl = layerRefs.current[incomingLayer];
        const incomingImg = incomingLayerEl?.querySelector<HTMLImageElement>(
          '[data-showcase-image]',
        );

        if (!incomingLayerEl || !incomingImg) {
          abortAdvance(previousIndex);
          return;
        }

        hideShowcaseBufferLayer(incomingLayerEl, incomingImg);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!isAdvancingRef.current) return;

            waitForDomImageReady(incomingImg, nextSrc)
              .then(() => {
                if (!isAdvancingRef.current || transitionTimelineRef.current) return;
                runCrossfade(outgoingLayer, incomingLayer);
              })
              .catch(() => {
                abortAdvance(previousIndex);
              });
          });
        });
      })
      .catch(() => {
        abortAdvance(previousIndex);
      });
  }, [abortAdvance, clearSlideTimer, runCrossfade, slides]);

  const scheduleNextSlide = useCallback(
    (delayMs: number = intervalMs) => {
      clearSlideTimer();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        advanceSlide();
      }, delayMs);
    },
    [advanceSlide, clearSlideTimer, intervalMs],
  );

  scheduleNextSlideRef.current = scheduleNextSlide;

  useEffect(() => {
    if (slides.length <= 1) return undefined;

    scheduleNextSlide(intervalMs);

    const onVisibilityChange = () => {
      clearSlideTimer();
      if (document.visibilityState === 'visible' && !isAdvancingRef.current) {
        scheduleNextSlide(intervalMs);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearSlideTimer();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [clearSlideTimer, intervalMs, scheduleNextSlide, slides.length]);

  useLayoutEffect(() => {
    if (!isFirstPaintRef.current) return;

    const layerEls = layerRefs.current;
    const layer0 = layerEls[0];
    const layer1 = layerEls[1];
    const img0 = layer0?.querySelector<HTMLImageElement>('[data-showcase-image]');
    const img1 = layer1?.querySelector<HTMLImageElement>('[data-showcase-image]');

    if (!layer0 || !layer1 || !img0 || !img1) return;

    showShowcaseActiveLayer(layer0, img0);

    if (prefersReducedMotion) {
      hideShowcaseBufferLayer(layer1, img1);
    } else {
      hideShowcaseBufferLayer(layer1, img1);
      kenBurnsTweenRef.current = startKenBurnsDrift(img0, intervalMs);
    }

    isFirstPaintRef.current = false;
  }, [intervalMs, prefersReducedMotion]);

  useEffect(() => {
    const layerEls = layerRefs.current;
    const images = layerEls
      .map((layer) => layer?.querySelector<HTMLElement>('[data-showcase-image]'))
      .filter((img): img is HTMLElement => Boolean(img));

    return () => {
      kenBurnsTweenRef.current?.kill();
      safeKillShowcaseTransition(
        transitionTimelineRef.current,
        layerRefs.current,
        displayLayerRef.current,
      );
      transitionTimelineRef.current = null;
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
              layerRefs.current[layer as ShowcaseLayer] = node;
            }}
            className={styles.imageLayer}
            data-showcase-layer={layer}
            data-showcase-active={isDisplayed ? 'true' : 'false'}
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
