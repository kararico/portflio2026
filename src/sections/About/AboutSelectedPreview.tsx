'use client';

import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { Project } from '@/types/project';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { getProjectThumbnail, resolveImageSrc } from '@/utils/projectImage';
import styles from './AboutSelectedPreview.module.scss';

interface AboutSelectedPreviewProps {
  project: Project | null;
  anchorEntry: HTMLElement | null;
  containerRef: React.RefObject<HTMLElement | null>;
}

type PreviewLayer = 'a' | 'b';

interface LayerState {
  a: Project | null;
  b: Project | null;
}

type PreviewAnimation =
  | { type: 'enter'; toLayer: PreviewLayer }
  | { type: 'cross'; fromLayer: PreviewLayer; toLayer: PreviewLayer }
  | null;

const ENTER_DURATION = 0.6;
const EXIT_DURATION = 0.4;
const PREVIEW_ORIGIN = 'center center';

function clampPreviewTop(trackHeight: number, frameHeight: number, anchorCenterY: number, trackTop: number) {
  const targetTop = anchorCenterY - trackTop - frameHeight / 2;
  const maxTop = Math.max(0, trackHeight - frameHeight);
  return Math.max(0, Math.min(maxTop, targetTop));
}

function animatePreviewIn(element: HTMLElement) {
  gsap.killTweensOf(element);
  gsap.fromTo(
    element,
    { scale: 0, opacity: 1, transformOrigin: PREVIEW_ORIGIN },
    {
      scale: 1,
      opacity: 1,
      duration: ENTER_DURATION,
      ease: 'power3.out',
      transformOrigin: PREVIEW_ORIGIN,
      overwrite: 'auto',
    },
  );
}

function animatePreviewOut(element: HTMLElement, onComplete?: () => void) {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 0,
    opacity: 1,
    duration: EXIT_DURATION,
    ease: 'power3.in',
    transformOrigin: PREVIEW_ORIGIN,
    overwrite: 'auto',
    onComplete,
  });
}

function resetPreviewLayer(element: HTMLElement | null) {
  if (!element) return;
  gsap.killTweensOf(element);
  gsap.set(element, { scale: 0, opacity: 1, transformOrigin: PREVIEW_ORIGIN });
}

function renderLayerImage(project: Project) {
  return (
    <Image
      src={resolveImageSrc(getProjectThumbnail(project))}
      alt={`${project.title} — ${project.client}, ${project.year}`}
      fill
      sizes="(min-width: 1024px) 320px, 0px"
      className={styles.image}
    />
  );
}

export default function AboutSelectedPreview({
  project,
  anchorEntry,
  containerRef,
}: AboutSelectedPreviewProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const prevSlugRef = useRef<string | null>(null);
  const activeLayerRef = useRef<PreviewLayer | null>(null);
  const pendingAnimationRef = useRef<PreviewAnimation>(null);
  const exitGenerationRef = useRef(0);
  const [layers, setLayers] = useState<LayerState>({ a: null, b: null });

  const getLayerElement = useCallback((layer: PreviewLayer) => {
    return layer === 'a' ? layerARef.current : layerBRef.current;
  }, []);

  const clearLayers = useCallback(() => {
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    setLayers({ a: null, b: null });
    activeLayerRef.current = null;
    resetPreviewLayer(layerA);
    resetPreviewLayer(layerB);
  }, []);

  const updatePosition = useCallback(
    (animate = true) => {
      const track = trackRef.current;
      const frame = frameRef.current;
      if (!track || !frame || !anchorEntry || !project) return;

      const trackRect = track.getBoundingClientRect();
      const anchorRect = anchorEntry.getBoundingClientRect();
      const frameHeight = frame.offsetHeight;
      const anchorCenterY = anchorRect.top + anchorRect.height / 2;
      const top = clampPreviewTop(trackRect.height, frameHeight, anchorCenterY, trackRect.top);

      if (animate) {
        gsap.to(frame, {
          top,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        return;
      }

      gsap.set(frame, { top });
    },
    [anchorEntry, project],
  );

  useLayoutEffect(() => {
    registerGsapPlugins();

    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    if (!layerA || !layerB) return;

    if (!project || !anchorEntry) {
      pendingAnimationRef.current = null;

      const activeLayer = activeLayerRef.current;
      if (activeLayer) {
        const activeElement = getLayerElement(activeLayer);
        if (activeElement) {
          const exitGeneration = ++exitGenerationRef.current;
          animatePreviewOut(activeElement, () => {
            if (exitGenerationRef.current !== exitGeneration) return;
            clearLayers();
          });
        }
      }

      prevSlugRef.current = null;
      return;
    }

    exitGenerationRef.current += 1;

    const prevSlug = prevSlugRef.current;
    if (prevSlug === project.slug) {
      updatePosition(true);
      return;
    }

    const isFirstEnter = prevSlug === null;
    prevSlugRef.current = project.slug;

    if (isFirstEnter) {
      gsap.killTweensOf([layerA, layerB]);
      resetPreviewLayer(layerA);
      resetPreviewLayer(layerB);
      pendingAnimationRef.current = { type: 'enter', toLayer: 'a' };
      activeLayerRef.current = 'a';
      setLayers({ a: project, b: null });
      return;
    }

    const fromLayer = activeLayerRef.current ?? 'a';
    const toLayer: PreviewLayer = fromLayer === 'a' ? 'b' : 'a';
    pendingAnimationRef.current = { type: 'cross', fromLayer, toLayer };
    activeLayerRef.current = toLayer;
    setLayers((current) => ({ ...current, [toLayer]: project }));
  }, [project, anchorEntry, clearLayers, getLayerElement, updatePosition]);

  useLayoutEffect(() => {
    const animation = pendingAnimationRef.current;
    if (!animation) return;

    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    if (!layerA || !layerB) return;

    if (animation.type === 'enter') {
      if (!layers[animation.toLayer]) return;
      pendingAnimationRef.current = null;
      animatePreviewIn(getLayerElement(animation.toLayer)!);
    } else {
      if (!layers[animation.toLayer]) return;
      pendingAnimationRef.current = null;

      const fromElement = getLayerElement(animation.fromLayer);
      const toElement = getLayerElement(animation.toLayer);

      resetPreviewLayer(toElement);
      if (fromElement) animatePreviewOut(fromElement);
      if (toElement) animatePreviewIn(toElement);
    }

    requestAnimationFrame(() => updatePosition(true));
  }, [layers, getLayerElement, updatePosition]);

  useLayoutEffect(() => {
    if (!project || !anchorEntry) return;

    const onScroll = () => updatePosition(true);
    const onResize = () => updatePosition(false);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    const resizeObserver = new ResizeObserver(() => updatePosition(false));
    const container = containerRef.current;
    const track = trackRef.current;

    if (container) resizeObserver.observe(container);
    if (track) resizeObserver.observe(track);
    resizeObserver.observe(anchorEntry);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, [project, anchorEntry, containerRef, updatePosition]);

  const hasPreview = layers.a !== null || layers.b !== null;

  return (
    <div
      ref={trackRef}
      className={styles.previewTrack}
      data-about-selected-preview-track
      data-preview-active={hasPreview ? 'true' : undefined}
      aria-hidden={!hasPreview}
    >
      <div
        ref={frameRef}
        className={styles.preview}
        data-about-selected-preview
        aria-hidden={!hasPreview}
      >
        <div ref={layerARef} className={styles.imageLayer} data-about-selected-preview-layer="a">
          {layers.a ? renderLayerImage(layers.a) : null}
        </div>
        <div ref={layerBRef} className={styles.imageLayer} data-about-selected-preview-layer="b">
          {layers.b ? renderLayerImage(layers.b) : null}
        </div>
      </div>
    </div>
  );
}
