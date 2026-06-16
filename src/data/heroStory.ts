/** Septiembre .home-intro — 단일 Editorial Composition */
export const heroStoryConfig = {
  sliderSlugs: [
    'starbucks-siren119',
    'starbucks-employee-platform',
    'mlb-korea',
    'hyundai-ezwel',
    'discovery-expedition',
  ] as const,
  sliderIntervalMs: 3000,
  pinScrollVh: {
    desktop: 360,
    mobile: 220,
  },
  scrollLerp: 0.06,
  scrollPhases: {
    metaFade: { start: 0, end: 0.1 },
    centerMove: { start: 0, end: 0.3 },
    titleBack: { start: 0.06, end: 0.74 },
    titleFront: { start: 0.1, end: 0.64 },
    galleryReveal: { start: 0, end: 0.84 },
    compositionDrift: { start: 0.5, end: 0.82 },
    aboutCover: { start: 0.78, end: 1.0 },
  },
  galleryReveal: {
    /** 갤러리 시퀀스 내 활성화 시점 (0–1) — center top 트리거 이후 상대 progress */
    activationAt: {
      '2': 0,
      '1': 0.2,
      '3': 0.4,
      '4': 0.6,
      '5': 0.8,
    } as const,
    /** 1번 카드 — @deprecated entrySpanViewport 사용 */
    entrySpan: 0.18,
    /** viewport 하단 밖에서 진입하는 구간 (1번 포함) */
    entrySpanViewport: 0.26,
    /** 활성화 직후 이미지 zoom-out 구간 (시퀀스 progress) */
    zoomSpan: 0.15,
    /** 누적 등장 순서 */
    order: ['2', '1', '3', '4', '5'] as const,
  },
  galleryMotion: {
    defaultScaleFrom: 1.2,
    defaultEntryY: 160,
    /** viewport 진입 — 카드 top이 화면 하단 아래에서 시작 */
    viewportEntryBuffer: { desktop: 120, mobile: 80 },
    /** viewport entry 대상 (1번 포함 — 2~5번과 동일 entrance) */
    viewportEntryPlateIds: ['1', '2', '3', '4', '5'] as const,
  },
  centerMove: {
    y: { desktop: -900, mobile: -560 },
    scale: { desktop: 0.84, mobile: 0.9 },
    exitBuffer: { desktop: 48, mobile: 32 },
  },
  compositionDrift: {
    y: { desktop: -64, mobile: -36 },
  },
  titleDrift: {
    x: { desktop: -200, mobile: -96 },
  },
  /**
   * Editorial gallery — Septiembre project-item-wrapper 패턴
   * 각 플레이트: position:absolute + top/right + --img-w + --img-ratio
   *
   * | id | 위치   | pt     | pr              | img-w  | ratio | slug        |
   * |----|--------|--------|-----------------|--------|-------|-------------|
   * | 1  | 좌상단 | 1%     | 78%             | 18vw   | 0.60  | starbucks   |
   * | 2  | 중앙   | 8%     | 44%             | 19vw   | 1.47  | mlb-korea   |
   * | 3  | 우상단 | 1%     | 10%             | 14vw   | 1.01  | hyundai     |
   * | 4  | 좌하단 | 36%    | 81%             | 14vw   | 1.48  | discovery   |
   * | 5  | 우하단 | 44%    | padding-fluid   | 24vw   | 0.61  | starbucks-ep|
   * galleryWrapper: translateY(-12vh) — 헤더 바로 아래 밀도
   */
  editorialPlates: [
    {
      id: '1' as const,
      slug: 'starbucks-siren119',
      layer: 'between' as const,
      imageScaleFrom: 1.18,
      layout: {
        pt: '1%',
        pr: '78%',
        imgW: '18vw',
        imgRatio: 0.6,
      },
    },
    {
      id: '2' as const,
      slug: 'mlb-korea',
      layer: 'front' as const,
      imageScaleFrom: 1.22,
      layout: {
        pt: '8%',
        pr: '44%',
        imgW: '19vw',
        imgRatio: 1.47,
      },
    },
    {
      id: '3' as const,
      slug: 'hyundai-ezwel',
      layer: 'front' as const,
      imageScaleFrom: 1.2,
      layout: {
        pt: '1%',
        pr: '10%',
        imgW: '14vw',
        imgRatio: 1.01,
      },
    },
    {
      id: '4' as const,
      slug: 'discovery-expedition',
      layer: 'behind' as const,
      imageScaleFrom: 1.25,
      layout: {
        pt: '36%',
        pr: '81%',
        imgW: '14vw',
        imgRatio: 1.48,
      },
    },
    {
      id: '5' as const,
      slug: 'starbucks-employee-platform',
      layer: 'front' as const,
      imageScaleFrom: 1.15,
      layout: {
        pt: '44%',
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
  pr: string;
  imgW: string;
  imgRatio: number;
  computedHeight: string;
}> {
  return heroStoryConfig.editorialPlates.map((plate) => ({
    id: plate.id,
    slug: plate.slug,
    layer: plate.layer,
    pt: plate.layout.pt,
    pr: plate.layout.pr,
    imgW: plate.layout.imgW,
    imgRatio: plate.layout.imgRatio,
    computedHeight: `calc(${plate.layout.imgW} * ${plate.layout.imgRatio})`,
  }));
}
