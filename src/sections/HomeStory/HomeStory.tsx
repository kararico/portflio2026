'use client';

import { useRef, useLayoutEffect } from 'react';
import About from '@/sections/About/About';
import Hero from '@/sections/Hero/Hero';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { initHomeStoryAnimation } from './homeStoryAnimation';
import styles from './HomeStory.module.scss';

export default function HomeStory() {
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
