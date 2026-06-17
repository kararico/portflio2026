'use client';

import { useEffect, useRef } from 'react';
import { assetPath } from '@/utils/assetPath';
import styles from './DetailImageViewer.module.scss';

interface DetailImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function DetailImageViewer({ src, alt, onClose }: DetailImageViewerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      className={styles.viewer}
      data-detail-image-viewer
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.backdrop}
        aria-label="Close image viewer"
        onClick={onClose}
      />
      <figure className={styles.figure}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath(src)}
          alt={alt}
          className={styles.image}
          data-detail-image-viewer-src={src}
          decoding="async"
        />
      </figure>
      <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
        <span className={styles.closeIcon} aria-hidden="true" />
      </button>
    </div>
  );
}
