'use client';

import { useRef, useLayoutEffect, useEffect } from 'react';
import About from '@/sections/About/About';
import Hero from '@/sections/Hero/Hero';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
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

    refreshScrollTrigger();

    return () => ctx.revert();
  }, []);

  // Lenis/뷰포트 준비 후 ScrollTrigger 치수 재계산 (실기기 iOS Safari)
  useEffect(() => {
    refreshScrollTriggerDelayed(100);
    refreshScrollTriggerDelayed(400);
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
