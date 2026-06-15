'use client';

import { useRef, useLayoutEffect } from 'react';
import { siteConfig } from '@/data/site';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { initHeroIntroAnimation } from './HeroAnimation';
import IntroGallery from './IntroGallery';
import IntroMedia from './IntroMedia';
import styles from './Hero.module.scss';

export default function Hero() {
  const lenis = useLenis();
  const { hero } = siteConfig;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const composition = compositionRef.current;
    if (!composition) return;

    const imageLayer = composition.querySelector<HTMLElement>('[data-hero-image-layer]');
    const frontTitle = composition.querySelector<HTMLElement>('[data-hero-title-front]');
    if (!imageLayer || !frontTitle) return;

    const syncFrontClip = () => {
      const compRect = composition.getBoundingClientRect();
      const imgRect = imageLayer.getBoundingClientRect();
      const top = Math.max(0, imgRect.top - compRect.top);
      const left = Math.max(0, imgRect.left - compRect.left);
      const bottom = Math.max(0, compRect.bottom - imgRect.bottom);
      const right = Math.max(0, compRect.right - imgRect.right);
      frontTitle.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    };

    syncFrontClip();

    const ro = new ResizeObserver(syncFrontClip);
    ro.observe(composition);
    ro.observe(imageLayer);

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncFrontClip);
    };

    window.addEventListener('resize', syncFrontClip);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', syncFrontClip);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      frontTitle.style.clipPath = '';
    };
  }, [lenis]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const composition = compositionRef.current;
    if (!section || !stage || !composition) return;

    registerGsapPlugins();
    const ctx = initHeroIntroAnimation({ section, stage, composition });
    refreshScrollTrigger();

    return () => ctx.revert();
  }, [lenis]);

  return (
    <section
      className={styles.homeIntro}
      ref={sectionRef}
      data-home-intro
      aria-label="Introduction"
    >
      <div className={styles.introSticky} ref={stageRef} data-intro-sticky data-sticky>
        <header className={styles.topRow}>
          <div className={styles.topMeta} data-hero-meta>
            <span className={styles.indexNum}>{hero.index}</span>
            <span className={styles.metaLabel}>{hero.indexLabel}</span>
          </div>
        </header>

        <div className={styles.composition} ref={compositionRef} data-hero-composition>
          <h1
            className={`${styles.heroTitle} ${styles.heroTitleBack}`}
            data-hero-title
            data-hero-title-back
          >
            <span className={styles.titleLine} data-reveal-line>
              {hero.title}
            </span>
          </h1>

          <div className={styles.centerStack} data-hero-center-stack>
            <span className={styles.credential} data-hero-meta data-hero-credential>
              {hero.credential}
            </span>
            <div className={styles.heroImage} data-hero-image-layer>
              <IntroMedia />
            </div>
          </div>

          <div
            className={`${styles.heroTitle} ${styles.heroTitleFront}`}
            aria-hidden="true"
            data-hero-title-front
          >
            <span className={styles.titleLine}>{hero.title}</span>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.meta} data-hero-meta>
            {hero.roles.map((role) => (
              <span key={role} className={styles.metaLine}>
                {role}
              </span>
            ))}
            <span className={styles.metaLine}>{hero.location}</span>
          </div>

          <div className={styles.scrollIndicator} data-hero-meta aria-hidden="true">
            <span>{hero.scrollLabel}</span>
            <span className={styles.scrollArrow}>↓</span>
          </div>
        </footer>

        <div className={styles.introGallery} data-intro-gallery-wrap>
          <IntroGallery />
        </div>
      </div>
    </section>
  );
}
