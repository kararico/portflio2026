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

/** Hero MLB — translateY 후 viewport 상단 밖으로 충분히 벗어났는지 (progress 무관, rect 기준) */
function isHeroExitedViewport(layer: HTMLElement | null, mobile: boolean): boolean {
  if (!layer) return false;

  const rect = layer.getBoundingClientRect();
  const buffer = mobile
    ? heroStoryConfig.centerMove.exitBuffer.mobile
    : heroStoryConfig.centerMove.exitBuffer.desktop;

  return rect.bottom <= -buffer;
}

/** Hero MLB 중심 Y ↔ viewport 중심 Y 절대 거리(px) */
function getHeroImageCenterDeltaY(heroImageEl: HTMLElement | null): number | null {
  if (!heroImageEl) return null;

  const rect = heroImageEl.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const imageCenterY = rect.top + rect.height / 2;
  const viewportCenterY = window.innerHeight / 2;
  return Math.abs(imageCenterY - viewportCenterY);
}

function isHeroImageNearViewportCenter(
  heroImageEl: HTMLElement | null,
  tolerance: number,
): boolean {
  const delta = getHeroImageCenterDeltaY(heroImageEl);
  return delta !== null && delta <= tolerance;
}

/** 모바일 타이틀 one-way hide — progress 역행 시 hidePeak 유지, MLB 중심이 viewport 중심 근처일 때만 reveal */
interface MobileHeroTitleState {
  hidePeak: number;
}

function applyMobileHeroTitle(
  titleBack: HTMLElement | null,
  titleFront: HTMLElement | null,
  progress: number,
  galleryActive: boolean,
  heroImageEl: HTMLElement | null,
  state: MobileHeroTitleState,
) {
  const { mobileTitleHide } = heroStoryConfig;
  const { revealCenterTolerance, revealCenterSpan } = mobileTitleHide;
  const hiddenY = mobileTitleHide.y;
  const setTitle = (el: HTMLElement | null, opacity: number, y: number) => {
    if (!el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, x: 0, y, opacity });
  };

  if (galleryActive) {
    state.hidePeak = 1;
    setTitle(titleBack, 0, hiddenY);
    setTitle(titleFront, 0, hiddenY);
    return;
  }

  const centerDelta = getHeroImageCenterDeltaY(heroImageEl);

  if (centerDelta !== null && centerDelta <= revealCenterTolerance) {
    state.hidePeak = 0;
    setTitle(titleBack, 1, 0);
    setTitle(titleFront, 1, 0);
    return;
  }

  const hideT = easeOutQuad(phaseProgress(progress, 0, mobileTitleHide.progressEnd));
  state.hidePeak = Math.max(state.hidePeak, hideT);

  let effectivePeak = state.hidePeak;
  if (
    centerDelta !== null &&
    revealCenterSpan > revealCenterTolerance &&
    centerDelta <= revealCenterSpan
  ) {
    const revealT = easeOutQuad(
      1 - phaseProgress(centerDelta, revealCenterTolerance, revealCenterSpan),
    );
    effectivePeak = state.hidePeak * (1 - revealT);
  }

  const opacity = lerpValue(1, 0, effectivePeak);
  const y = lerpValue(0, hiddenY, effectivePeak);
  setTitle(titleBack, opacity, y);
  setTitle(titleFront, opacity, y);
}

function applyDesktopHeroTitle(
  titleBack: HTMLElement | null,
  titleFront: HTMLElement | null,
  progress: number,
  titleDriftX: number,
  phases: typeof heroStoryConfig.scrollPhases,
) {
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
}

function hidePlateState({ anchor, image, scaleFrom, entryY }: PlateAnimState) {
  gsap.set(anchor, { y: entryY, visibility: 'hidden' });
  anchor.removeAttribute('data-plate-active');
  gsap.set(image, { scale: scaleFrom, transformOrigin: 'center center' });
}

function applyPlateSequence(
  plateStates: PlateAnimState[],
  progress: number,
  seqStart: number,
) {
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const { zoomSpan } = heroStoryConfig.galleryReveal;
  const seqSpan = seqEnd - seqStart;

  if (seqSpan <= 0) {
    plateStates.forEach((state) => hidePlateState(state));
    return;
  }

  plateStates.forEach((state) => {
    const { anchor, image, scaleFrom, entryY, activationAt, plateId } = state;
    const entrySpan = getPlateEntrySpan(plateId);

    if (progress < seqStart) {
      hidePlateState(state);
      return;
    }

    const seqT = (progress - seqStart) / seqSpan;

    if (seqT < activationAt) {
      hidePlateState(state);
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
    const heroTitleImage = introMedia ?? heroImageLayer;
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

    let gallerySequenceStartProgress: number | null = null;
    let galleryTriggeredLatched = false;

    const scrollDistance = getScrollDistance();
    const gallerySeqDisabledStart = phases.galleryReveal.end + 1;

    gsap.set(aboutCover, { y: '100vh' });
    if (centerMoveTarget) {
      gsap.set(centerMoveTarget, { y: 0, scale: 1, transformOrigin: 'center center' });
    }
    if (composition) {
      gsap.set(composition, { y: 0 });
    }
    if (subtitle) {
      gsap.set(subtitle, { y: 0, opacity: 1 });
    }
    if (introMedia) gsap.set(introMedia, { transformOrigin: 'center center' });
    if (titleBack) {
      gsap.set(titleBack, mobile
        ? { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1, transformOrigin: 'center center' }
        : { x: 0, transformOrigin: 'center center' });
    }
    if (titleFront) {
      gsap.set(titleFront, mobile
        ? { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1, transformOrigin: 'center center' }
        : { x: 0, transformOrigin: 'center center' });
    }
    if (heroImageLayer) {
      gsap.set(heroImageLayer, { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
    }

    let targetProgress = 0;
    let currentProgress = 0;
    const mobileTitleState: MobileHeroTitleState = { hidePeak: 0 };

    const applyScrollProgress = (progress: number) => {
      const metaT = phaseProgress(progress, phases.metaFade.start, phases.metaFade.end);
      metaItems.forEach((el) => {
        gsap.set(el, { opacity: 1 - metaT, y: lerpValue(0, -18, metaT) });
      });

      const centerT = phaseProgress(progress, phases.centerMove.start, phases.centerMove.end);
      const exitY = getCenterExitY();

      root.setAttribute('data-center-move-t', centerT.toFixed(4));

      if (centerMoveTarget) {
        gsap.set(centerMoveTarget, {
          y: lerpValue(0, exitY, easeOutCubic(centerT)),
          scale: lerpValue(1, centerMoveScale, centerT),
        });
      }
      if (subtitle) {
        gsap.set(subtitle, { y: lerpValue(0, exitY, easeOutCubic(centerT)) });
      }

      const heroExitLayer = heroImageLayer ?? galleryTriggerCard;
      const heroExited = isHeroExitedViewport(heroExitLayer, mobile);

      /** Gallery — Hero MLB가 viewport 밖으로 나간 뒤에만 시작 (top<=1px 트리거 사용 안 함) */
      if (heroExited) {
        galleryTriggeredLatched = true;
        if (gallerySequenceStartProgress === null) {
          gallerySequenceStartProgress = progress;
        }
      }

      if (
        gallerySequenceStartProgress !== null &&
        progress < gallerySequenceStartProgress - 0.005
      ) {
        galleryTriggeredLatched = false;
        gallerySequenceStartProgress = null;
      }

      const galleryActive = galleryTriggeredLatched;

      if (mobile) {
        applyMobileHeroTitle(
          titleBack,
          titleFront,
          progress,
          galleryActive,
          heroTitleImage,
          mobileTitleState,
        );
      } else {
        applyDesktopHeroTitle(titleBack, titleFront, progress, titleDriftX, phases);
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

      if (heroImageLayer) {
        if (heroExited) {
          gsap.set(heroImageLayer, {
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
          });
        } else {
          gsap.set(heroImageLayer, {
            opacity: 1,
            visibility: 'visible',
            pointerEvents: 'auto',
          });
        }
      }

      if (!galleryActive || gallerySequenceStartProgress === null) {
        applyPlateSequence(plateStates, progress, gallerySeqDisabledStart);
        root.removeAttribute('data-gallery-active');
      } else {
        applyPlateSequence(plateStates, progress, gallerySequenceStartProgress);
        root.setAttribute('data-gallery-active', 'true');
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.has('heroDiag')) {
          const snapEl = (selector: string) => {
            const el = document.querySelector<HTMLElement>(selector);
            if (!el) return null;
            const st = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return {
              selector,
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              opacity: st.opacity,
              visibility: st.visibility,
              transform: st.transform,
              zIndex: st.zIndex,
              clipPath: st.clipPath !== 'none' ? st.clipPath.slice(0, 80) : 'none',
              plateActive: el.getAttribute('data-plate-active'),
            };
          };

          (window as unknown as { __heroDiag?: object }).__heroDiag = {
            progress,
            targetProgress,
            currentProgress,
            centerT,
            exitY,
            heroExited,
            galleryActive,
            gallerySequenceStartProgress,
            heroExitLayerSelector: heroImageLayer
              ? '[data-hero-image-layer]'
              : galleryTriggerCard
                ? '[data-intro-media]|fallback'
                : 'none',
            centerMoveTarget: centerMoveTarget?.getAttribute('data-hero-center-stack')
              ? '[data-hero-center-stack]'
              : 'other',
            root: {
              galleryActive: root.getAttribute('data-gallery-active'),
              scenePinned: root.getAttribute('data-scene-pinned'),
            },
            elements: {
              centerStack: snapEl('[data-hero-center-stack]'),
              heroImageLayer: snapEl('[data-hero-image-layer]'),
              introMedia: snapEl('[data-intro-media]'),
              heroMlbImg: snapEl('[data-hero-image-layer] [data-intro-media] img'),
              composition: snapEl('[data-hero-composition]'),
              homeStory: snapEl('[data-home-story]'),
              titleFront: snapEl('[data-hero-title-front]'),
              plate2: snapEl('[data-hero-float][data-plate-id="2"]'),
              aboutCover: snapEl('[data-about-cover]'),
            },
          };
        }
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
      gallerySequenceStartProgress = null;
      galleryTriggeredLatched = false;
      if (
        mobile &&
        isHeroImageNearViewportCenter(
          heroTitleImage,
          heroStoryConfig.mobileTitleHide.revealCenterTolerance,
        )
      ) {
        mobileTitleState.hidePeak = 0;
      }
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
