/** Septiembre .home-intro — 단일 Editorial Composition */
export const heroStoryConfig = {
  /** Home Hero 중앙 카드 — 시안 기준 MLB 고정 */
  centerMediaSlug: 'mlb-korea' as const,
  pinScrollVh: {
    desktop: 360,
    mobile: 220,
  },
  /** ScrollTrigger scrub lag(초) — 낮을수록 스크롤에 밀착 */
  scrollScrub: 0.42,
  scrollPhases: {
    metaFade: { start: 0, end: 0.15 },
    centerMove: { start: 0, end: 0.38 },
    titleBack: { start: 0.08, end: 0.65 },
    titleFront: { start: 0.12, end: 0.55 },
    galleryReveal: { start: 0.22, end: 0.78 },
    compositionDrift: { start: 0.58, end: 0.85 },
    aboutCover: { start: 0.72, end: 1.0 },
  },
  /** 모바일 Hero 타이포 — progress 기반 one-way hide, MLB 중심이 viewport 중심 근처일 때 reveal */
  mobileTitleHide: {
    progressEnd: 0.12,
    y: -20,
    /** Hero MLB 중심 ↔ viewport 중심 거리(px) — 이내면 타이틀 fully visible + hidePeak reset */
    revealCenterTolerance: 48,
    /** tolerance ~ span 구간에서 이미지 위치 기반 fade-in */
    revealCenterSpan: 140,
  },
  /**
   * 모바일 Hero→Gallery overlap — heroExited(-32px) 전에 gallery latch
   * Hero MLB bottom이 viewport 높이 × ratio 이하일 때 reveal (Hero still partially visible)
   */
  mobileGalleryReveal: {
    /** Hero image bottom ≤ innerHeight × ratio → galleryActive (overlap) */
    heroBottomViewportRatio: 0.22,
    /** scroll up 시 latch 해제 — threshold + px */
    hysteresisPx: 48,
    /** galleryActive 전 plate2만 선행 reveal 시작 progress */
    plate2PreRevealProgress: 0.045,
    /** plate2 entry 구간 단축 (× entrySpanViewport) */
    plate2EntrySpanScale: 0.48,
    /** gallery 구간 scrub lag(초) — dead zone 체감 완화 */
    scrollScrub: 0.14,
  },
  galleryReveal: {
    /** 갤러리 시퀀스 내 활성화 시점 (0–1) — center top 트리거 이후 상대 progress */
    activationAt: {
      '2': 0,
      '1': 0.18,
      '3': 0.38,
      '4': 0.58,
      '5': 0.78,
    } as const,
    /** 1번 카드 — @deprecated entrySpanViewport 사용 */
    entrySpan: 0.22,
    /** viewport 하단 밖에서 진입하는 구간 */
    entrySpanViewport: 0.32,
    /** 활성화 직후 이미지 zoom-out 구간 (시퀀스 progress) */
    zoomSpan: 0.32,
    /** 누적 등장 순서 */
    order: ['2', '1', '3', '4', '5'] as const,
  },
  galleryMotion: {
    defaultScaleFrom: 1.06,
    defaultEntryY: 160,
    /** viewport 진입 — 카드 top이 화면 하단 아래에서 시작 */
    viewportEntryBuffer: { desktop: 56, mobile: 40 },
    /** viewport 하단 밖에서 진입 — 모든 gallery plate 동일 처리 */
    viewportEntryPlateIds: ['1', '2', '3', '4', '5'] as const,
  },
  centerMove: {
    y: { desktop: -900, mobile: -560 },
    scale: { desktop: 0.84, mobile: 0.9 },
    exitBuffer: { desktop: 48, mobile: 32 },
  },
  compositionDrift: {
    y: { desktop: -24, mobile: -14 },
  },
  titleDrift: {
    x: { desktop: -72, mobile: -36 },
  },
  /** 로드 시 intro 등장 타이밍 */
  heroIntro: {
    delayAfterReveal: 0.65,
    /** Preloader JW → Hero 확장 handoff */
    delayAfterRevealExpand: 0,
    composition: { duration: 1.15, y: 16, ease: 'power2.out' as const },
    title: { stagger: 0.05, y: 22, duration: 1.25, ease: 'power2.out' as const },
    titleFront: { duration: 1.1, ease: 'power2.out' as const, overlap: 0.78 },
    /** JW → JUNGWON HEO — 글자 단위 마스크 확장 (single variant) */
    titleExpand: {
      hold: 0.2,
      wKernEm: -0.5,
      wKernReleaseDuration: 0.5,
      charDuration: 0.11,
      charStagger: 0.045,
      charEase: 'none' as const,
      revealEase: 'power2.out' as const,
      initialLetterSpacingEm: -0.09,
      finalLetterSpacingEm: -0.03,
      letterSpacingDuration: 0.4,
      letterSpacingAt: 0.75,
      uppercaseAt: 0.92,
    },
    meta: { stagger: 0.04, y: 8, duration: 0.95, ease: 'power2.out' as const, overlap: 0.52 },
  },
  /**
   * Editorial gallery — Septiembre project-item-wrapper 패턴
   * 각 플레이트: position:absolute + top + left/right + --img-w + --img-ratio
   *
   * | id | 위치   | pt (중앙 카드 기준)              | 좌/우             | img-w  | ratio |
   * |----|--------|----------------------------------|-------------------|--------|-------|
   * | 1  | 좌상단 | center-top (상단 정렬)           | left: fluid       | 21.6vw | 0.60  |
   * | 2  | 중앙   | center-top                       | 50% - img-w/2     | 26vw   | 1.47  |
   * | 3  | 우상단 | center-top + 3vh                 | right: fluid      | 14vw   | 1.01  |
   * | 4  | 좌하단 | center-bottom - plate-h          | left: fluid       | 14vw   | 1.48  |
   * | 5  | 우하단 | center-bottom - plate-h          | right: fluid      | 24vw   | 0.61  |
   */
  editorialPlates: [
    {
      id: '1' as const,
      slug: 'starbucks-siren119',
      layer: 'between' as const,
      imageScaleFrom: 1.07,
      layout: {
        pt: 'var(--hero-plate-center-pt)',
        pl: 'var(--padding-fluid)',
        imgW: '21.6vw',
        imgRatio: 0.6,
      },
    },
    {
      id: '2' as const,
      slug: 'mlb-korea',
      layer: 'front' as const,
      imageScaleFrom: 1.08,
      layout: {
        pt: 'var(--hero-plate-center-pt)',
        pr: 'calc(50% - var(--img-w) / 2)',
        imgW: '26vw',
        imgRatio: 1.47,
      },
    },
    {
      id: '3' as const,
      slug: 'hyundai-ezwel',
      layer: 'front' as const,
      imageScaleFrom: 1.07,
      layout: {
        pt: 'calc(var(--hero-plate-center-pt) + 3vh)',
        pr: 'var(--padding-fluid)',
        imgW: '14vw',
        imgRatio: 1.01,
      },
    },
    {
      id: '4' as const,
      slug: 'discovery-expedition',
      layer: 'behind' as const,
      imageScaleFrom: 1.08,
      layout: {
        pt: 'calc(var(--hero-plate-center-pt) + var(--hero-plate-center-h) - 14vw * 1.48)',
        pl: 'var(--padding-fluid)',
        imgW: '14vw',
        imgRatio: 1.48,
      },
    },
    {
      id: '5' as const,
      slug: 'starbucks-employee-platform',
      layer: 'front' as const,
      imageScaleFrom: 1.06,
      layout: {
        pt: 'calc(var(--hero-plate-center-pt) + var(--hero-plate-center-h) - 24vw * 0.61)',
        pr: 'var(--padding-fluid)',
        imgW: '24vw',
        imgRatio: 0.61,
      },
    },
  ] as const,
} as const;

/** @deprecated editorialPlates 사용 */
export const floatingItems = heroStoryConfig.editorialPlates;

export type HeroPlateId = (typeof heroStoryConfig.editorialPlates)[number]['id'];
export type HeroGalleryLayer = (typeof heroStoryConfig.editorialPlates)[number]['layer'];
export type EditorialPlateLayout = (typeof heroStoryConfig.editorialPlates)[number]['layout'];

/** @deprecated HeroPlateId 사용 */
export type HeroFloatSlot = HeroPlateId;

export function getGalleryRevealStart(): number {
  return heroStoryConfig.scrollPhases.galleryReveal.start;
}

export function getGalleryRevealEnd(): number {
  return heroStoryConfig.scrollPhases.galleryReveal.end;
}

export function getPlateConfig(plateId: HeroPlateId) {
  return heroStoryConfig.editorialPlates.find((plate) => plate.id === plateId);
}

export function getPlateActivationAt(plateId: HeroPlateId): number {
  return heroStoryConfig.galleryReveal.activationAt[plateId];
}

/** @deprecated getPlateActivationAt 사용 */
export function getGalleryItemRevealStart(plateId: HeroPlateId, baseStart?: number): number {
  const seqStart = baseStart ?? 0;
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const seqSpan = seqEnd - seqStart;
  return seqStart + getPlateActivationAt(plateId) * seqSpan;
}

export function getGalleryItemMotionEnd(plateId: HeroPlateId, baseStart?: number): number {
  const seqStart = baseStart ?? 0;
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const seqSpan = seqEnd - seqStart;
  const activation = getPlateActivationAt(plateId);
  const motionEnd = activation + heroStoryConfig.galleryReveal.entrySpan;
  return seqStart + Math.min(motionEnd, 1) * seqSpan;
}

/** @deprecated getGalleryItemMotionEnd 사용 */
export function getGalleryItemZoomEnd(plateId: HeroPlateId, baseStart?: number): number {
  const seqStart = baseStart ?? 0;
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const seqSpan = seqEnd - seqStart;
  const activation = getPlateActivationAt(plateId);
  const zoomEnd = activation + heroStoryConfig.galleryReveal.zoomSpan;
  return seqStart + Math.min(zoomEnd, 1) * seqSpan;
}

/** 개발·디버그용 — 플레이트 활성화 + entry/zoom 구간 */
export function getEditorialPlateMotionLog(seqStart = 0): Array<{
  id: HeroPlateId;
  slug: string;
  activationAt: number;
  activationProgress: number;
  entryEndProgress: number;
  zoomEndProgress: number;
  entryY: number | 'viewport';
  imageScaleFrom: number;
  imageScaleTo: number;
}> {
  const seqEnd = heroStoryConfig.scrollPhases.galleryReveal.end;
  const seqSpan = seqEnd - seqStart;

  return heroStoryConfig.editorialPlates.map((plate) => ({
    id: plate.id,
    slug: plate.slug,
    activationAt: getPlateActivationAt(plate.id),
    activationProgress: seqStart + getPlateActivationAt(plate.id) * seqSpan,
    entryEndProgress: getGalleryItemMotionEnd(plate.id, seqStart),
    zoomEndProgress: getGalleryItemZoomEnd(plate.id, seqStart),
    entryY: 'viewport',
    imageScaleFrom: plate.imageScaleFrom,
    imageScaleTo: 1,
  }));
}

/** 개발·디버그용 — 플레이트 좌표 요약 */
export function getEditorialPlateLayoutLog(): Array<{
  id: HeroPlateId;
  slug: string;
  layer: HeroGalleryLayer;
  pt: string;
  pl?: string;
  pr?: string;
  imgW: string;
  imgRatio: number;
  computedHeight: string;
}> {
  return heroStoryConfig.editorialPlates.map((plate) => ({
    id: plate.id,
    slug: plate.slug,
    layer: plate.layer,
    pt: plate.layout.pt,
    pl: 'pl' in plate.layout ? plate.layout.pl : undefined,
    pr: 'pr' in plate.layout ? plate.layout.pr : undefined,
    imgW: plate.layout.imgW,
    imgRatio: plate.layout.imgRatio,
    computedHeight: `calc(${plate.layout.imgW} * ${plate.layout.imgRatio})`,
  }));
}
