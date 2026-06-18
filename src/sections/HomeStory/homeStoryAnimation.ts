import { gsap, registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import {
  heroStoryConfig,
  getPlateConfig,
  getPlateActivationAt,
  type HeroPlateId,
} from '@/data/heroStory';
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

function phaseProgress(progress: number, start: number, end: number): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function lerpValue(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** 갤러리 entry/zoom — cubic보다 완만한 quad */
function easeOutQuad(t: number): number {
  return 1 - (1 - t) ** 2;
}

/** GSAP ScrollTrigger scrub(lag) — 프레임 독립 exponential smoothing */
function scrubToward(current: number, target: number, deltaSeconds: number, lagSeconds: number): number {
  if (lagSeconds <= 0) return target;
  const factor = 1 - Math.exp(-deltaSeconds / lagSeconds);
  return current + (target - current) * factor;
}

function measureCenterHandoffY(target: HTMLElement): number {
  const savedY = Number(gsap.getProperty(target, 'y')) || 0;
  gsap.set(target, { y: 0 });
  const top = target.getBoundingClientRect().top;
  gsap.set(target, { y: savedY });
  return -top;
}

function resolveCenterExitY(
  target: HTMLElement | null,
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
  const measured = -(targetRect.bottom + buffer);

  return Math.min(fallback, vhOffset, measured);
}

interface PlateAnimState {
  anchor: HTMLElement;
  image: HTMLElement;
  plateId: HeroPlateId;
  scaleFrom: number;
  entryY: number;
  activationAt: number;
  useViewportEntry: boolean;
}

function usesViewportEntry(plateId: HeroPlateId): boolean {
  return heroStoryConfig.galleryMotion.viewportEntryPlateIds.includes(
    plateId as (typeof heroStoryConfig.galleryMotion.viewportEntryPlateIds)[number],
  );
}

/** 카드 top이 viewport 하단 밖에서 시작하도록 entryY(px) 계산 */
function measureViewportEntryY(anchor: HTMLElement, mobile: boolean): number {
  const { viewportEntryBuffer } = heroStoryConfig.galleryMotion;
  const buffer = mobile ? viewportEntryBuffer.mobile : viewportEntryBuffer.desktop;

  const savedY = gsap.getProperty(anchor, 'y') as number;
  const savedVisibility = gsap.getProperty(anchor, 'visibility') as string;
  gsap.set(anchor, { y: 0, visibility: 'visible' });
  const rect = anchor.getBoundingClientRect();
  gsap.set(anchor, { y: savedY, visibility: savedVisibility });

  return Math.round(window.innerHeight + buffer - rect.top);
}

function remeasurePlateEntryYs(plateStates: PlateAnimState[], mobile: boolean) {
  plateStates.forEach((state) => {
    if (!state.useViewportEntry) return;
    state.entryY = measureViewportEntryY(state.anchor, mobile);
  });
}

function getPlateEntrySpan(plateId: HeroPlateId): number {
  if (usesViewportEntry(plateId)) {
    return heroStoryConfig.galleryReveal.entrySpanViewport;
  }
  return heroStoryConfig.galleryReveal.entrySpan;
}

function buildPlateStates(anchors: NodeListOf<HTMLElement>, mobile: boolean): PlateAnimState[] {
  const { galleryMotion } = heroStoryConfig;

  return Array.from(anchors).flatMap((anchor) => {
    const plateId = anchor.dataset.plateId as HeroPlateId;
    if (!plateId) return [];

    const image = anchor.querySelector<HTMLElement>('[data-hero-plate-image]');
    if (!image) return [];

    const plateConfig = getPlateConfig(plateId);
    const useViewportEntry = usesViewportEntry(plateId);
    return [
      {
        anchor,
        image,
        plateId,
        scaleFrom: plateConfig?.imageScaleFrom ?? galleryMotion.defaultScaleFrom,
        entryY: useViewportEntry
          ? measureViewportEntryY(anchor, mobile)
          : galleryMotion.defaultEntryY,
        activationAt: getPlateActivationAt(plateId),
        useViewportEntry,
      },
    ];
  });
}

function isGalleryTopTriggered(triggerCard: HTMLElement | null): boolean {
  if (!triggerCard) return false;
  return triggerCard.getBoundingClientRect().top <= 1;
}

function applyPlateSequence(
  plateStates: PlateAnimState[],
  progress: number,
  seqStart: number,
) {
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const { zoomSpan } = heroStoryConfig.galleryReveal;
  const seqSpan = seqEnd - seqStart;

  plateStates.forEach(({ anchor, image, scaleFrom, entryY, activationAt, plateId }) => {
    const entrySpan = getPlateEntrySpan(plateId);

    if (progress < seqStart || seqSpan <= 0) {
      gsap.set(anchor, { y: entryY, visibility: 'hidden' });
      anchor.removeAttribute('data-plate-active');
      gsap.set(image, { scale: scaleFrom, transformOrigin: 'center center' });
      return;
    }

    const seqT = (progress - seqStart) / seqSpan;

    if (seqT < activationAt) {
      gsap.set(anchor, { y: entryY, visibility: 'hidden' });
      anchor.removeAttribute('data-plate-active');
      gsap.set(image, { scale: scaleFrom, transformOrigin: 'center center' });
      return;
    }

    const entryT = Math.min((seqT - activationAt) / entrySpan, 1);
    const easedEntry = easeOutQuad(entryT);

    gsap.set(anchor, {
      visibility: 'visible',
      y: lerpValue(entryY, 0, easedEntry),
    });
    anchor.setAttribute('data-plate-active', 'true');

    const zoomT = Math.min((seqT - activationAt) / zoomSpan, 1);
    gsap.set(image, {
      scale: lerpValue(scaleFrom, 1, easeOutQuad(zoomT)),
      transformOrigin: 'center center',
    });
  });
}

export function initHomeStoryAnimation(refs: HomeStoryAnimationRefs): gsap.Context {
  registerGsapPlugins();

  const { root, heroSection, heroStage, aboutCover } = refs;
  const phases = heroStoryConfig.scrollPhases;
  const mobile = isMobile();
  const scrollScrub = mobile ? heroStoryConfig.scrollScrub * 0.82 : heroStoryConfig.scrollScrub;

  return gsap.context(() => {
    setHeroScrollHeight(root);

    const composition = heroSection.querySelector<HTMLElement>('[data-hero-composition]');
    const heroImageLayer = heroSection.querySelector<HTMLElement>('[data-hero-image-layer]');
    const centerStack = heroSection.querySelector<HTMLElement>('[data-hero-center-stack]');
    const introMedia = heroSection.querySelector<HTMLElement>('[data-intro-media]');
    const centerMoveTarget = centerStack ?? heroImageLayer;
    const galleryTriggerCard = heroImageLayer ?? introMedia ?? centerMoveTarget;
    const titleBack = heroSection.querySelector<HTMLElement>('[data-hero-title]');
    const titleFront = heroSection.querySelector<HTMLElement>('[data-hero-title-front]');
    const subtitle = heroSection.querySelector<HTMLElement>('[data-intro-subtitle]');
    const metaItems = heroSection.querySelectorAll<HTMLElement>('[data-hero-meta]');
    const plates = heroSection.querySelectorAll<HTMLElement>('[data-hero-float]');
    const plateStates = buildPlateStates(plates, mobile);
    remeasurePlateEntryYs(plateStates, mobile);
    plateStates.forEach(({ anchor, image, scaleFrom, entryY }) => {
      gsap.set(anchor, { y: entryY, visibility: 'hidden' });
      gsap.set(image, { scale: scaleFrom, transformOrigin: 'center center' });
    });

    const centerMoveScale = mobile
      ? heroStoryConfig.centerMove.scale.mobile
      : heroStoryConfig.centerMove.scale.desktop;
    const titleDriftX = mobile
      ? heroStoryConfig.titleDrift.x.mobile
      : heroStoryConfig.titleDrift.x.desktop;
    const compositionDriftY = mobile
      ? heroStoryConfig.compositionDrift.y.mobile
      : heroStoryConfig.compositionDrift.y.desktop;
    const getCenterExitY = () => resolveCenterExitY(centerMoveTarget, mobile);
    let centerHandoffY = 0;
    const remeasureCenterHandoffY = () => {
      if (!centerMoveTarget) return;
      centerHandoffY = measureCenterHandoffY(centerMoveTarget);
    };
    remeasureCenterHandoffY();

    let gallerySequenceStartProgress: number | null = null;

    const scrollDistance = getScrollDistance();

    gsap.set(aboutCover, { y: '100vh' });
    if (centerMoveTarget) {
      gsap.set(centerMoveTarget, { y: 0, scale: 1, opacity: 1, transformOrigin: 'center center' });
    }
    if (composition) {
      gsap.set(composition, { y: 0 });
    }
    if (subtitle) {
      gsap.set(subtitle, { y: 0, opacity: 1 });
    }
    if (introMedia) gsap.set(introMedia, { transformOrigin: 'center center' });
    if (titleBack) gsap.set(titleBack, { x: 0, transformOrigin: 'center center' });
    if (titleFront) gsap.set(titleFront, { x: 0, transformOrigin: 'center center' });

    let targetProgress = 0;
    let currentProgress = 0;

    const applyScrollProgress = (progress: number) => {
      const metaT = phaseProgress(progress, phases.metaFade.start, phases.metaFade.end);
      metaItems.forEach((el) => {
        gsap.set(el, { opacity: 1 - metaT, y: lerpValue(0, -18, metaT) });
      });

      const galleryTriggered = isGalleryTopTriggered(galleryTriggerCard);

      const centerT = phaseProgress(progress, phases.centerMove.start, phases.centerMove.end);
      const exitY = getCenterExitY();
      const centerEndY = Math.max(exitY, centerHandoffY);

      if (centerMoveTarget) {
        gsap.set(centerMoveTarget, {
          y: lerpValue(0, centerEndY, easeOutCubic(centerT)),
          scale: lerpValue(1, centerMoveScale, centerT),
          opacity: 1,
        });
      }
      if (heroImageLayer) {
        gsap.set(heroImageLayer, {
          opacity: galleryTriggered ? 0 : 1,
          visibility: galleryTriggered ? 'hidden' : 'visible',
          pointerEvents: galleryTriggered ? 'none' : 'auto',
        });
      }
      if (subtitle) {
        gsap.set(subtitle, { y: lerpValue(0, centerEndY, easeOutCubic(centerT)) });
      }

      const titleT = phaseProgress(progress, phases.titleBack.start, phases.titleBack.end);
      if (titleBack) {
        gsap.set(titleBack, {
          x: lerpValue(0, titleDriftX, titleT),
          opacity: lerpValue(1, 0.58, titleT),
        });
      }
      if (titleFront) {
        gsap.set(titleFront, {
          x: lerpValue(0, titleDriftX, titleT),
          opacity: lerpValue(1, 0.08, titleT),
        });
      }

      const driftT = phaseProgress(
        progress,
        phases.compositionDrift.start,
        phases.compositionDrift.end,
      );
      if (composition) {
        gsap.set(composition, { y: lerpValue(0, compositionDriftY, driftT) });
      }

      const aboutT = phaseProgress(progress, phases.aboutCover.start, phases.aboutCover.end);
      gsap.set(aboutCover, { y: `${lerpValue(100, 0, aboutT)}vh` });

      if (!galleryTriggered) {
        gallerySequenceStartProgress = null;
        applyPlateSequence(plateStates, progress, phases.galleryReveal.end + 1);
        root.removeAttribute('data-gallery-active');
      } else {
        if (gallerySequenceStartProgress === null) {
          gallerySequenceStartProgress = progress;
        }
        applyPlateSequence(plateStates, progress, gallerySequenceStartProgress);
        root.setAttribute('data-gallery-active', 'true');
      }
    };

    applyScrollProgress(0);

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

    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: scrollDistance,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetProgress = self.progress;
      },
    });

    const onTick = (_time: number, deltaTime: number) => {
      const deltaSeconds = deltaTime / 1000;
      const next = scrubToward(currentProgress, targetProgress, deltaSeconds, scrollScrub);
      if (Math.abs(next - currentProgress) < 0.000015) return;

      currentProgress = next;
      applyScrollProgress(currentProgress);
    };

    gsap.ticker.add(onTick);

    ScrollTrigger.addEventListener('refreshInit', () => {
      setHeroScrollHeight(root);
      remeasurePlateEntryYs(plateStates, mobile);
      remeasureCenterHandoffY();
      gallerySequenceStartProgress = null;
      currentProgress = targetProgress;
      applyScrollProgress(currentProgress);
    });

    requestAnimationFrame(() => {
      if (pinTrigger.isActive) {
        root.setAttribute('data-scene-pinned', 'true');
      }
    });

    refreshScrollTrigger();

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, root);
}
