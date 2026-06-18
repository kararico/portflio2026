'use client';

import type { TransitionEvent } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PreloaderLogo from './PreloaderLogo';
import { formatPreloaderProgress, usePreloader } from '@/hooks/usePreloader';
import styles from './Preloader.module.scss';

export default function Preloader() {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, '') || '/';
  const isHome = normalizedPath === '/';
  const { progress, isExiting, isVisible, finishExit } = usePreloader({ enabled: isHome });

  useEffect(() => {
    const root = document.documentElement;
    if (!isVisible) {
      root.removeAttribute('data-preloader-active');
      root.removeAttribute('data-preloader-exiting');
      return;
    }

    root.setAttribute('data-preloader-active', 'true');
    if (isExiting) {
      root.setAttribute('data-preloader-exiting', 'true');
    } else {
      root.removeAttribute('data-preloader-exiting');
    }

    return () => {
      root.removeAttribute('data-preloader-active');
      root.removeAttribute('data-preloader-exiting');
    };
  }, [isVisible, isExiting]);

  if (!isVisible) return null;

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'opacity' || !isExiting) return;
    finishExit();
  };

  return (
    <div
      className={`${styles.preloader} ${isExiting ? styles.exiting : ''}`}
      data-preloader
      aria-hidden={isExiting}
      aria-live="polite"
      aria-busy={!isExiting}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.logo}>
        <PreloaderLogo />
      </div>
      <div className={styles.counter}>{formatPreloaderProgress(progress)}</div>
    </div>
  );
}
