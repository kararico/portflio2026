'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { applyOverlayImageRect, type SourceRect } from '@/animations/projectSharedTransition';
import styles from './ProjectTransitionOverlay.module.scss';

interface ProjectTransitionOverlayProps {
  imageRef: RefObject<HTMLImageElement | null>;
  imageSrc: string;
  rect: SourceRect;
  onReady?: () => void;
}

export default function ProjectTransitionOverlay({
  imageRef,
  imageSrc,
  rect,
  onReady,
}: ProjectTransitionOverlayProps) {
  const rectAppliedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useLayoutEffect(() => {
    const el = imageRef.current;
    if (!el || rectAppliedRef.current) return;

    rectAppliedRef.current = true;
    applyOverlayImageRect(el, rect);

    const notify = () => onReadyRef.current?.();
    if (el.complete && el.naturalWidth > 0) {
      notify();
    } else {
      el.onload = notify;
      el.onerror = notify;
    }

    return () => {
      rectAppliedRef.current = false;
    };
  }, [imageRef, rect]);

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
