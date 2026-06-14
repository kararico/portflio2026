'use client';

import { useEffect, useState } from 'react';
import styles from './HeroBackground.module.scss';

interface HeroBackgroundProps {
  /** [primary, secondary?] — full-bleed photo layers */
  images: readonly [string, string?];
}

export default function HeroBackground({ images }: HeroBackgroundProps) {
  const sources = images.filter(Boolean) as string[];
  const [ready, setReady] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setReady(new Set());

    sources.forEach((src) => {
      const probe = new window.Image();
      probe.onload = () => {
        if (cancelled) return;
        setReady((prev) => {
          const next = new Set(prev);
          next.add(src);
          return next;
        });
      };
      probe.src = src;
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tuple of image paths
  }, [images[0], images[1]]);

  const [primary, secondary] = sources;

  return (
    <div className={styles.bg} aria-hidden="true" data-hero-bg>
      {primary && ready.has(primary) && (
        <div className={`${styles.layer} ${styles.layerPrimary}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={primary} alt="" className={styles.image} decoding="async" />
        </div>
      )}
      {secondary && ready.has(secondary) && (
        <div className={`${styles.layer} ${styles.layerSecondary}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={secondary} alt="" className={styles.image} decoding="async" />
        </div>
      )}
    </div>
  );
}
