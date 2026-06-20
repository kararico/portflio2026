'use client';

import Image from 'next/image';
import { useCallback, useLayoutEffect, useRef } from 'react';
import type { Project } from '@/types/project';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { getProjectThumbnail, resolveImageSrc } from '@/utils/projectImage';
import styles from './AboutSelectedPreview.module.scss';

interface AboutSelectedPreviewProps {
  project: Project | null;
  anchorEntry: HTMLElement | null;
  containerRef: React.RefObject<HTMLElement | null>;
}

function clampPreviewTop(trackHeight: number, frameHeight: number, anchorCenterY: number, trackTop: number) {
  const targetTop = anchorCenterY - trackTop - frameHeight / 2;
  const maxTop = Math.max(0, trackHeight - frameHeight);
  return Math.max(0, Math.min(maxTop, targetTop));
}

export default function AboutSelectedPreview({
  project,
  anchorEntry,
  containerRef,
}: AboutSelectedPreviewProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const prevSlugRef = useRef<string | null>(null);

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

    const frame = frameRef.current;
    if (!frame) return;

    if (!project || !anchorEntry) {
      gsap.killTweensOf(frame);
      gsap.to(frame, {
        opacity: 0,
        scale: 1.03,
        duration: 0.35,
        ease: 'power2.in',
      });
      prevSlugRef.current = null;
      return;
    }

    const isSwitch = prevSlugRef.current !== null && prevSlugRef.current !== project.slug;
    const isFirst = prevSlugRef.current === null;
    prevSlugRef.current = project.slug;

    gsap.killTweensOf(frame, 'opacity,scale');

    if (isFirst) {
      gsap.set(frame, { opacity: 0, scale: 1.03 });
      gsap.to(frame, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
      });
    } else if (isSwitch) {
      gsap.fromTo(
        frame,
        { opacity: 0.72, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      );
    }

    requestAnimationFrame(() => updatePosition(true));
  }, [project, anchorEntry, updatePosition]);

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

  return (
    <div ref={trackRef} className={styles.previewTrack} data-about-selected-preview-track aria-hidden="true">
      <div
        ref={frameRef}
        className={styles.preview}
        data-about-selected-preview
        aria-hidden={!project}
      >
        {project ? (
          <Image
            key={project.slug}
            src={resolveImageSrc(getProjectThumbnail(project))}
            alt={`${project.title} — ${project.client}, ${project.year}`}
            fill
            sizes="(min-width: 1024px) 320px, 0px"
            className={styles.image}
          />
        ) : null}
      </div>
    </div>
  );
}
