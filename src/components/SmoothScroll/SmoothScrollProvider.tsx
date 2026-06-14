'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { LenisContext } from '@/contexts/LenisContext';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import { gsap, registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { consumePathnameScrollIntent } from '@/utils/scrollRestoration';
import { resetScrollToPosition, resetScrollToTop } from '@/utils/scrollReset';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

// Lenis 초기화 전에 ScrollTrigger 등록 (Hero useLayoutEffect보다 먼저 실행)
registerGsapPlugins();

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const isFirstRouteRef = useRef(true);

  useEffect(() => {
    registerGsapPlugins();

    if (prefersReducedMotion()) {
      refreshScrollTrigger();
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    lenisInstance.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => refreshScrollTrigger();
    window.addEventListener('resize', onResize);

    refreshScrollTriggerDelayed(50);

    return () => {
      window.removeEventListener('resize', onResize);
      gsap.ticker.remove(onTick);
      lenisInstance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (isFirstRouteRef.current) {
      isFirstRouteRef.current = false;
      return;
    }

    if (document.documentElement.hasAttribute('data-project-transition')) {
      return;
    }

    const instance = lenisRef.current;
    const { action, scrollY } = consumePathnameScrollIntent();

    if (action === 'skip') {
      refreshScrollTriggerDelayed(100);
      return;
    }

    if (action === 'restore') {
      resetScrollToPosition(instance, scrollY);
      refreshScrollTriggerDelayed(120);
      return;
    }

    if (action === 'top') {
      resetScrollToTop(instance);
      refreshScrollTriggerDelayed(100);
      return;
    }

    resetScrollToTop(instance);
    refreshScrollTriggerDelayed(100);
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
