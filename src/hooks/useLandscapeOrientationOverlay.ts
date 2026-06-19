'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { gsap } from '@/utils/gsap/registerGsap';
import { shouldShowOrientationOverlay } from '@/utils/viewport/shouldShowOrientationOverlay';

export function useLandscapeOrientationOverlay(): boolean {
  const lenis = useLenis();
  const [isActive, setIsActive] = useState(false);
  const lockedRef = useRef(false);

  const evaluate = useCallback(() => {
    setIsActive(shouldShowOrientationOverlay());
  }, []);

  useEffect(() => {
    evaluate();

    const onViewportChange = () => evaluate();
    const landscapeMq = window.matchMedia('(orientation: landscape)');

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
    landscapeMq.addEventListener('change', onViewportChange);

    return () => {
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
      landscapeMq.removeEventListener('change', onViewportChange);
    };
  }, [evaluate]);

  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;

    const release = () => {
      if (!lockedRef.current) return;
      root.removeAttribute('data-orientation-overlay-active');
      body.style.overflow = '';
      lenis?.start();
      gsap.ticker.wake();
      lockedRef.current = false;
    };

    if (isActive) {
      root.setAttribute('data-orientation-overlay-active', 'true');
      body.style.overflow = 'hidden';
      lenis?.stop();
      gsap.ticker.sleep();
      lockedRef.current = true;
    } else {
      release();
    }

    return release;
  }, [isActive, lenis]);

  return isActive;
}
