'use client';

import { useRef, useLayoutEffect } from 'react';
import { siteConfig } from '@/data/site';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { initHeroIntroAnimation } from './HeroAnimation';
import { EditorialPlatesBehind, EditorialPlatesBetween, EditorialPlatesFront } from './IntroGallery';
import IntroMedia from './IntroMedia';
import styles from './Hero.module.scss';

const HERO_WORD_REPEAT = 14;

function buildHeroWordLine(phrase: string) {
  return Array.from({ length: HERO_WORD_REPEAT }, () => phrase).join('  ');
}

export default function Hero() {
  const lenis = useLenis();
  const { hero, position } = siteConfig;
  const heroWordLine = buildHeroWordLine(hero.indexLabel.toUpperCase());

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const composition = heroStageRef.current;
    if (!composition) return;

    const imageLayer = composition.querySelector<HTMLElement>('[data-hero-image-layer]');
    const frontTitle = composition.querySelector<HTMLElement>('[data-hero-title-front]');
    if (!imageLayer || !frontTitle) return;

    const syncFrontClip = () => {
      const titleRect = frontTitle.getBoundingClientRect();
      const imgRect = imageLayer.getBoundingClientRect();
      const top = Math.max(0, imgRect.top - titleRect.top);
      const left = Math.max(0, imgRect.left - titleRect.left);
      const bottom = Math.max(0, titleRect.bottom - imgRect.bottom);
      const right = Math.max(0, titleRect.right - imgRect.right);
      frontTitle.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    };

    syncFrontClip();

    const ro = new ResizeObserver(syncFrontClip);
    ro.observe(frontTitle);
    ro.observe(imageLayer);

    const onTick = () => syncFrontClip();
    gsap.ticker.add(onTick);

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncFrontClip);
    };

    window.addEventListener('resize', syncFrontClip);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      gsap.ticker.remove(onTick);
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
    const composition = heroStageRef.current;
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

        <div className={styles.composition}>
          <div className={styles.credentialSlot}>
            <span className={styles.credential} data-hero-meta data-hero-credential>
              {hero.credential}
            </span>
          </div>

          <div
            className={styles.heroStage}
            ref={heroStageRef}
            data-hero-composition
          >
            <EditorialPlatesBehind />

            <h1
              className={`${styles.heroTitle} ${styles.heroTitleBack}`}
              data-hero-title
              data-hero-title-back
            >
              <span className="sr-only">{hero.title}</span>
              <span className={styles.heroWordTrack} data-reveal-line aria-hidden="true">
                {heroWordLine}
              </span>
            </h1>

            <div className={styles.centerStack} data-hero-center-stack>
              <div className={styles.heroImage} data-hero-image-layer>
                <IntroMedia />
              </div>
            </div>

            <EditorialPlatesBetween />

            <div
              className={`${styles.heroTitle} ${styles.heroTitleFront}`}
              aria-hidden="true"
              data-hero-title-front
            >
              <span className={styles.heroWordTrack}>{heroWordLine}</span>
            </div>

            <EditorialPlatesFront />
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.meta} data-hero-meta>
            {position.heroRoles.map((role) => (
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
      </div>
    </section>
  );
}
