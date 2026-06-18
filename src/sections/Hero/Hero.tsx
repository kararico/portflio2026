'use client';

import { useRef, useLayoutEffect, useState } from 'react';
import { siteConfig } from '@/data/site';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { initHeroIntroAnimation } from './HeroAnimation';
import { EditorialPlatesBehind, EditorialPlatesBetween, EditorialPlatesFront } from './IntroGallery';
import IntroMedia from './IntroMedia';
import {
  buildHeroTitleText,
  isHeroTypoRepeat,
  resolveHeroTypoVariant,
  usesHeroExpandTitle,
} from './heroTitleText';
import HeroExpandTitle from './HeroExpandTitle';
import styles from './Hero.module.scss';

type HeroFrontClipMode = 'sync' | 'off' | 'debug';

/** A/B: ?heroClip=off | ?heroClip=debug */
function getHeroFrontClipMode(): HeroFrontClipMode {
  if (typeof window === 'undefined') return 'sync';
  const param = new URLSearchParams(window.location.search).get('heroClip');
  if (param === 'off') return 'off';
  if (param === 'debug') return 'debug';
  return 'sync';
}

export default function Hero() {
  const lenis = useLenis();
  const { hero, position } = siteConfig;
  const [typoVariant, setTypoVariant] = useState(() => resolveHeroTypoVariant());
  const heroTitleText = buildHeroTitleText(typoVariant);
  const useExpandTitle = usesHeroExpandTitle(typoVariant);
  const heroWordTrackClass = isHeroTypoRepeat(typoVariant)
    ? `${styles.heroWordTrack} ${styles.heroWordTrackRepeat}`
    : styles.heroWordTrack;

  useLayoutEffect(() => {
    setTypoVariant(resolveHeroTypoVariant(new URLSearchParams(window.location.search).get('heroTypo')));
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const composition = heroStageRef.current;
    if (!composition) return;

    const imageLayer = composition.querySelector<HTMLElement>('[data-hero-image-layer]');
    const frontTitle = composition.querySelector<HTMLElement>('[data-hero-title-front]');
    if (!imageLayer || !frontTitle) return;

    const clipMode = getHeroFrontClipMode();
    frontTitle.setAttribute('data-hero-clip-mode', clipMode);

    const getClipTarget = () =>
      imageLayer.querySelector<HTMLElement>('[data-intro-media]') ?? imageLayer;

    const getExpandTextSpanRect = (track: HTMLElement, firstLetter: HTMLElement) => {
      if (track.classList.contains('is-expanded')) {
        const trackRect = track.getBoundingClientRect();
        return { left: trackRect.left, right: trackRect.right };
      }

      const left = firstLetter.getBoundingClientRect().left;
      let right = left;
      track
        .querySelectorAll<HTMLElement>(
          '[data-hero-expand-j], [data-hero-expand-w], [data-hero-expand-char-inner]',
        )
        .forEach((el) => {
          const charRect = el.getBoundingClientRect();
          if (charRect.width > 0.5) {
            right = Math.max(right, charRect.right);
          }
        });

      return { left, right };
    };

    const syncFrontClip = () => {
      const mode = getHeroFrontClipMode();
      const titleBack = composition.querySelector<HTMLElement>('[data-hero-title-back]');
      const expandTracks = composition.querySelectorAll<HTMLElement>('[data-hero-expand-track]');
      const isMobileLayout = window.innerWidth < 768;

      if (mode === 'off') {
        frontTitle.style.clipPath = 'none';
        return;
      }

      const clipTarget = getClipTarget();
      const imgRect = clipTarget.getBoundingClientRect();

      if (imgRect.width <= 0 || imgRect.height <= 0) return;

      /** 모바일 — 문자열 중심(첫·끝 글자) = 이미지 중심 (GSAP transform과 무관하게 px 기준) */
      if (isMobileLayout && expandTracks.length > 0 && titleBack) {
        const stageRect = composition.getBoundingClientRect();
        const track = expandTracks[0];
        const firstLetter =
          track.querySelector<HTMLElement>('[data-hero-expand-j]') ??
          track.querySelector<HTMLElement>('[data-hero-expand-char-inner]');
        const lastLetter =
          track.querySelector<HTMLElement>('[data-hero-expand-char]:last-of-type [data-hero-expand-char-inner]') ??
          track.querySelector<HTMLElement>('[data-hero-expand-w]');

        if (firstLetter && lastLetter) {
          const textSpan = getExpandTextSpanRect(track, firstLetter);
          const textWidth = textSpan.right - textSpan.left;

          if (textWidth > 0) {
            const imgCenterX = imgRect.left + imgRect.width / 2;
            const titleRectNow = titleBack.getBoundingClientRect();
            const textOffsetInTitle = textSpan.left - titleRectNow.left;
            const gsapX = Number(gsap.getProperty(titleBack, 'x')) || 0;
            const targetTextLeft = imgCenterX - textWidth / 2;
            const leftPx = Math.round(
              targetTextLeft - textOffsetInTitle - gsapX - stageRect.left,
            );

            titleBack.style.left = `${leftPx}px`;
            frontTitle.style.left = `${leftPx}px`;
          }
        }
      } else {
        if (titleBack) titleBack.style.left = '';
        frontTitle.style.left = '';
      }

      const titleRect = frontTitle.getBoundingClientRect();

      const top = Math.max(0, Math.round(imgRect.top - titleRect.top));
      const left = Math.max(0, Math.round(imgRect.left - titleRect.left));
      const bottom = Math.max(0, Math.round(titleRect.bottom - imgRect.bottom));
      const right = Math.max(0, Math.round(titleRect.right - imgRect.right));

      frontTitle.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;

      if (mode === 'debug') {
        const visibleW = Math.round(titleRect.width - left - right);
        const visibleH = Math.round(titleRect.height - top - bottom);
        const trackRect = expandTracks[0]?.getBoundingClientRect();
        const debug = {
          clipPath: frontTitle.style.clipPath,
          inset: { top, right, bottom, left },
          visible: { width: visibleW, height: visibleH },
          mobileNudge:
            isMobileLayout && trackRect
              ? Math.round(
                  imgRect.left +
                    imgRect.width / 2 -
                    (() => {
                      const track = expandTracks[0];
                      const first =
                        track?.querySelector<HTMLElement>('[data-hero-expand-j]') ??
                        track?.querySelector<HTMLElement>('[data-hero-expand-char-inner]');
                      const last =
                        track?.querySelector<HTMLElement>(
                          '[data-hero-expand-char]:last-of-type [data-hero-expand-char-inner]',
                        ) ?? track?.querySelector<HTMLElement>('[data-hero-expand-w]');
                      if (first && last) {
                        const fl = first.getBoundingClientRect();
                        const lr = last.getBoundingClientRect();
                        return (fl.left + lr.right) / 2;
                      }
                      return (trackRect.left + trackRect.right) / 2;
                    })(),
                )
              : 0,
          imageRect: {
            top: Math.round(imgRect.top),
            bottom: Math.round(imgRect.bottom),
            left: Math.round(imgRect.left),
            right: Math.round(imgRect.right),
            width: Math.round(imgRect.width),
            height: Math.round(imgRect.height),
          },
          titleRect: {
            top: Math.round(titleRect.top),
            bottom: Math.round(titleRect.bottom),
            left: Math.round(titleRect.left),
            right: Math.round(titleRect.right),
            width: Math.round(titleRect.width),
            height: Math.round(titleRect.height),
          },
          trackRect: trackRect
            ? {
                left: Math.round(trackRect.left),
                right: Math.round(trackRect.right),
                width: Math.round(trackRect.width),
              }
            : null,
          clipTarget: clipTarget.getAttribute('data-intro-media') ? 'intro-media' : 'hero-image-layer',
          centerMoveT: document.querySelector('[data-home-story]')?.getAttribute('data-center-move-t'),
        };
        (window as unknown as { __heroClipDebug?: object }).__heroClipDebug = debug;
        frontTitle.setAttribute('data-hero-clip-debug', JSON.stringify(debug.inset));
      }
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
      const back = composition.querySelector<HTMLElement>('[data-hero-title-back]');
      if (back) back.style.left = '';
      frontTitle.style.left = '';
    };
  }, [lenis]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const composition = heroStageRef.current;
    if (!section || !stage || !composition) return;

    registerGsapPlugins();
    const ctx = initHeroIntroAnimation({
      section,
      stage,
      composition,
      useExpandTitle,
    });
    refreshScrollTrigger();

    return () => ctx.revert();
  }, [useExpandTitle]);

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
              {useExpandTitle ? (
                <HeroExpandTitle revealRoot ariaHidden />
              ) : (
                <span
                  className={heroWordTrackClass}
                  data-reveal-line
                  aria-hidden="true"
                >
                  {heroTitleText}
                </span>
              )}
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
              data-hero-typo-variant={typoVariant}
            >
              {useExpandTitle ? (
                <HeroExpandTitle />
              ) : (
                <span className={heroWordTrackClass}>{heroTitleText}</span>
              )}
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
