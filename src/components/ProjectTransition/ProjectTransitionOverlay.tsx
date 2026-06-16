'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { applyOverlayImageRect, type SourceRect } from '@/animations/projectSharedTransition';
import styles from './ProjectTransitionOverlay.module.scss';

interface ProjectTransitionOverlayProps {
  imageRef: RefObject<HTMLImageElement | null>;
  imageSrc: string;
  rect: SourceRect;
  objectPosition?: string;
  onReady?: () => void;
}

export default function ProjectTransitionOverlay({
  imageRef,
  imageSrc,
  rect,
  objectPosition = 'center',
  onReady,
}: ProjectTransitionOverlayProps) {
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useLayoutEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    el.src = imageSrc;
    applyOverlayImageRect(el, rect, objectPosition);

    const notify = () => onReadyRef.current?.();

    if (el.complete && el.naturalWidth > 0) {
      notify();
      return;
    }

    el.onload = notify;
    el.onerror = notify;

    return () => {
      el.onload = null;
      el.onerror = null;
    };
  }, [imageRef, imageSrc, rect, objectPosition]);

  return (
    <div className={styles.overlay} data-project-transition-overlay aria-hidden="true">
      <div className={styles.backdrop} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={imageSrc}
        alt=""
        className={styles.sharedImage}
        data-project-transition-image
        decoding="sync"
      />
    </div>
  );
}
