import { gsap, registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import {
  getAboutProfileRevealProgress,
  notifyAboutProfileRevealFromTimeline,
} from '@/animations/aboutProfileReveal';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { heroStoryConfig, getGalleryRevealStart, getGalleryRevealEnd } from '@/data/heroStory';
import {
  getHeroPinScrollVh,
  getHeroScrollDistanceEnd,
  isHeroMobileLayout,
} from '@/utils/scroll/heroScrollDistance';

export interface HomeStoryAnimationRefs {
  root: HTMLElement;
  heroSection: HTMLElement;
  heroStage: HTMLElement;
  aboutCover: HTMLElement;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile(): boolean {
  return isHeroMobileLayout();
}

function getScrollDistance(): string {
  return getHeroScrollDistanceEnd();
}

function setHeroScrollHeight(root: HTMLElement) {
  const vh = getHeroPinScrollVh();
  root.style.setProperty('--hero-scroll-height', `${vh}vh`);
}

function resolveCenterExitY(
  target: HTMLElement | null,
  stage: HTMLElement,
  mobile: boolean,
): number {
  const fallback = mobile
    ? heroStoryConfig.centerMove.y.mobile
    : heroStoryConfig.centerMove.y.desktop;
  const buffer = mobile
    ? heroStoryConfig.centerMove.exitBuffer.mobile
    : heroStoryConfig.centerMove.exitBuffer.desktop;
  const vhOffset = -(window.innerHeight * (mobile ? 1.08 : 1.12));

  if (!target) return Math.min(fallback, vhOffset);

  const targetRect = target.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const measured = -(targetRect.bottom - stageRect.top + buffer);

  return Math.min(fallback, vhOffset, measured);
}

/** 카드 최종 슬롯 기준 — viewport 아래에서 올라오도록 y offset 계산 */
function resolveGalleryFromY(item: HTMLElement, mobile: boolean): number {
  const minRiseVh = mobile
    ? heroStoryConfig.galleryReveal.fromYVh.mobile
    : heroStoryConfig.galleryReveal.fromYVh.desktop;
  const minRise = window.innerHeight * minRiseVh;
  const buffer = mobile ? 24 : 32;
  const rect = item.getBoundingClientRect();
  const belowViewport = window.innerHeight + buffer - rect.top;
  return Math.max(belowViewport, minRise);
}

export function initHomeStoryAnimation(refs: HomeStoryAnimationRefs): gsap.Context {
  registerGsapPlugins();

  const { root, heroSection, heroStage, aboutCover } = refs;
  const phases = heroStoryConfig.scrollPhases;
  const mobile = isMobile();

  return gsap.context(() => {
    setHeroScrollHeight(root);

    const heroImageLayer = heroSection.querySelector<HTMLElement>('[data-hero-image-layer]');
    const centerStack = heroSection.querySelector<HTMLElement>('[data-hero-center-stack]');
    const centerMoveTarget = centerStack ?? heroImageLayer;
    const introMedia = heroSection.querySelector<HTMLElement>('[data-intro-media]');
    const titleBack = heroSection.querySelector<HTMLElement>('[data-hero-title]');
    const titleFront = heroSection.querySelector<HTMLElement>('[data-hero-title-front]');
    const subtitle = heroSection.querySelector<HTMLElement>('[data-intro-subtitle]');
    const metaItems = heroSection.querySelectorAll<HTMLElement>('[data-hero-meta]');
    const floatItems = heroSection.querySelectorAll<HTMLElement>('[data-hero-float]');
    const galleryBackdrop = heroSection.querySelector<HTMLElement>('[data-gallery-backdrop]');

    const centerMoveDuration = phases.centerMove.end - phases.centerMove.start;
    const centerMoveScale = mobile
      ? heroStoryConfig.centerMove.scale.mobile
      : heroStoryConfig.centerMove.scale.desktop;
    const getCenterExitY = () =>
      resolveCenterExitY(centerMoveTarget, heroStage, mobile);
    const titleDriftX = mobile
      ? heroStoryConfig.titleDrift.x.mobile
      : heroStoryConfig.titleDrift.x.desktop;

    const applyGalleryInitialState = () => {
      floatItems.forEach((item) => {
        const isBottomCenter = item.dataset.float === 'bottomCenter';
        gsap.set(item, { y: 0, xPercent: isBottomCenter ? -50 : 0, opacity: 0 });
      });

      floatItems.forEach((item) => {
        const isBottomCenter = item.dataset.float === 'bottomCenter';
        const fromY = isBottomCenter
          ? Math.max(
              resolveGalleryFromY(item, mobile),
              window.innerHeight *
                (mobile
                  ? heroStoryConfig.galleryReveal.bottomCenterFromYVh.mobile
                  : heroStoryConfig.galleryReveal.bottomCenterFromYVh.desktop),
            )
          : resolveGalleryFromY(item, mobile);

        gsap.set(item, {
          opacity: 0,
          y: fromY,
          xPercent: isBottomCenter ? -50 : 0,
        });
      });
    };

    if (prefersReducedMotion()) {
      gsap.set(aboutCover, { y: 0, clearProps: 'transform' });
      gsap.set(floatItems, { opacity: 1, y: 0, xPercent: 0, clearProps: 'transform' });
      if (centerMoveTarget) gsap.set(centerMoveTarget, { y: 0, scale: 1, clearProps: 'transform' });
      if (galleryBackdrop) gsap.set(galleryBackdrop, { opacity: 1 });
      return;
    }

    const scrollDistance = getScrollDistance();

    applyGalleryInitialState();

    gsap.set(aboutCover, { y: '100vh' });
    if (galleryBackdrop) gsap.set(galleryBackdrop, { opacity: 0 });
    if (centerMoveTarget) {
      gsap.set(centerMoveTarget, { y: 0, scale: 1, opacity: 1, transformOrigin: 'center center' });
    }
    if (subtitle) {
      gsap.set(subtitle, { y: 0, opacity: 1 });
    }
    if (introMedia) gsap.set(introMedia, { transformOrigin: 'center center' });
    if (titleBack) gsap.set(titleBack, { x: 0, transformOrigin: 'center center' });
    if (titleFront) gsap.set(titleFront, { x: 0, transformOrigin: 'center center' });

    const pinTrigger = mobile
      ? ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: scrollDistance,
          invalidateOnRefresh: true,
          onEnter: () => root.setAttribute('data-scene-pinned', 'true'),
          onEnterBack: () => root.setAttribute('data-scene-pinned', 'true'),
          onLeave: () => root.removeAttribute('data-scene-pinned'),
          onLeaveBack: () => root.removeAttribute('data-scene-pinned'),
        })
      : ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: scrollDistance,
          pin: heroStage,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => root.setAttribute('data-scene-pinned', 'true'),
          onEnterBack: () => root.setAttribute('data-scene-pinned', 'true'),
          onLeave: () => root.removeAttribute('data-scene-pinned'),
          onLeaveBack: () => root.removeAttribute('data-scene-pinned'),
        });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: scrollDistance,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    if (metaItems.length) {
      tl.to(
        metaItems,
        {
          opacity: 0,
          y: -18,
          ease: 'none',
          stagger: 0.015,
          duration: phases.metaFade.end - phases.metaFade.start,
        },
        phases.metaFade.start,
      );
    }

    if (centerMoveTarget) {
      tl.to(
        centerMoveTarget,
        {
          y: () => getCenterExitY(),
          scale: centerMoveScale,
          ease: 'none',
          duration: centerMoveDuration,
        },
        phases.centerMove.start,
      );
    }

    if (subtitle) {
      tl.to(
        subtitle,
        {
          y: () => getCenterExitY(),
          ease: 'none',
          duration: centerMoveDuration,
        },
        phases.centerMove.start,
      );
    }

    if (titleBack) {
      tl.to(
        titleBack,
        {
          x: titleDriftX,
          opacity: 0.52,
          ease: 'none',
          duration: phases.titleBack.end - phases.titleBack.start,
        },
        phases.titleBack.start,
      );
    }

    if (titleFront) {
      tl.to(
        titleFront,
        {
          x: titleDriftX,
          opacity: 0.06,
          ease: 'none',
          duration: phases.titleBack.end - phases.titleBack.start,
        },
        phases.titleBack.start,
      );
    }

    const galleryRevealStart = getGalleryRevealStart();
    const galleryRevealDuration = getGalleryRevealEnd() - galleryRevealStart;

    floatItems.forEach((item) => {
      const isBottomCenter = item.dataset.float === 'bottomCenter';

      tl.to(
        item,
        {
          opacity: 1,
          y: 0,
          xPercent: isBottomCenter ? -50 : 0,
          ease: 'none',
          duration: galleryRevealDuration,
        },
        galleryRevealStart,
      );
    });

    tl.fromTo(
      aboutCover,
      { y: '100vh' },
      {
        y: 0,
        ease: 'none',
        duration: phases.aboutCover.end - phases.aboutCover.start,
      },
      phases.aboutCover.start,
    );

    ScrollTrigger.addEventListener('refreshInit', () => {
      setHeroScrollHeight(root);
    });

    const profileRevealProgress = getAboutProfileRevealProgress();
    let profileRevealTriggered = false;

    const profileRevealSt = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: scrollDistance,
      onUpdate: (self) => {
        if (self.progress >= phases.centerMove.start) {
          root.setAttribute('data-gallery-active', 'true');
        } else {
          root.removeAttribute('data-gallery-active');
        }

        if (!profileRevealTriggered && self.progress >= profileRevealProgress) {
          profileRevealTriggered = true;
          notifyAboutProfileRevealFromTimeline();
        }
      },
    });

    requestAnimationFrame(() => {
      if (pinTrigger.isActive) {
        root.setAttribute('data-scene-pinned', 'true');
      }

      if (!profileRevealTriggered && profileRevealSt.progress >= profileRevealProgress) {
        profileRevealTriggered = true;
        notifyAboutProfileRevealFromTimeline();
      }
    });

    refreshScrollTrigger();
  }, root);
}
