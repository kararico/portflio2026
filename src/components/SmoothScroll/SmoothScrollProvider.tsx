'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { LenisContext } from '@/contexts/LenisContext';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { consumePathnameScrollIntent } from '@/utils/scrollRestoration';
import { resetScrollToPosition, resetScrollToTop } from '@/utils/scrollReset';
import {
  bindLenisToScrollTrigger,
} from '@/utils/scroll/bindScrollTrigger';
import { ensureNativeScrollEnvironment, teardownNativeScrollEnvironment } from '@/utils/scroll/initNativeScroll';
import { shouldUseNativeScroll } from '@/utils/scroll/scrollEnvironment';
import { bindViewportWidthSync } from '@/utils/viewport/syncViewportWidth';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

registerGsapPlugins();

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const isFirstRouteRef = useRef(true);

  useEffect(() => {
    registerGsapPlugins();
    const unbindViewportWidth = bindViewportWidthSync();

    if (shouldUseNativeScroll()) {
      ensureNativeScrollEnvironment();
      refreshScrollTrigger();
      return () => {
        unbindViewportWidth();
        teardownNativeScrollEnvironment();
      };
    }

    const lenisInstance = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    const unbindScrollTrigger = bindLenisToScrollTrigger(lenisInstance);

    const onTick = (time: number) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      refreshScrollTrigger();
    };
    window.addEventListener('resize', onResize);

    return () => {
      unbindViewportWidth();
      window.removeEventListener('resize', onResize);
      unbindScrollTrigger();
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
