'use client';

import { useRef, useLayoutEffect, useEffect } from 'react';
import About from '@/sections/About/About';
import Hero from '@/sections/Hero/Hero';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { isTouchDevice } from '@/utils/scroll/scrollEnvironment';
import { subscribePreloaderComplete } from '@/utils/preloader/subscribePreloaderComplete';
import { initHomeStoryAnimation } from './homeStoryAnimation';
import styles from './HomeStory.module.scss';

export default function HomeStory() {
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const aboutCoverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const aboutCover = aboutCoverRef.current;
    if (!root || !aboutCover) return;

    const heroSection = root.querySelector<HTMLElement>('[data-home-intro]');
    const heroStage = root.querySelector<HTMLElement>('[data-intro-sticky]');
    if (!heroSection || !heroStage) return;

    registerGsapPlugins();

    const ctx = initHomeStoryAnimation({
      root,
      heroSection,
      heroStage,
      aboutCover,
    });

    return () => ctx.revert();
  }, []);

  // Preloader 종료 후 layout unlock — 1회 refresh (구 100/400/1000ms delayed 대체)
  useEffect(() => {
    const cancelPreloader = subscribePreloaderComplete(() => {
      refreshScrollTrigger();
    });

    if (!isTouchDevice()) {
      return cancelPreloader;
    }

    const onScroll = () => ScrollTrigger.update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelPreloader();
      window.removeEventListener('scroll', onScroll);
    };
  }, [lenis]);

  return (
    <div className={styles.homeStory} ref={rootRef} data-home-story>
      <div className={styles.heroLayer}>
        <Hero />
      </div>

      <div className={styles.aboutCover} ref={aboutCoverRef} data-about-cover>
        <About />
      </div>
    </div>
  );
}
