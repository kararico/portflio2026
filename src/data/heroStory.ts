/** Septiembre .home-intro scroll phases */
export const heroStoryConfig = {
  sliderSlugs: [
    'mlb-korea',
    'starbucks-employee-platform',
    'wconcept-us',
    'discovery-expedition',
    'casamia',
  ] as const,
  sliderIntervalMs: 3000,
  pinScrollVh: {
    desktop: 250,
    mobile: 180,
  },
  scrollPhases: {
    metaFade: { start: 0, end: 0.15 },
    /** Center media — viewport 밖으로 빠져나감 */
    centerMove: { start: 0, end: 0.28 },
    titleBack: { start: 0.08, end: 0.65 },
    titleFront: { start: 0.12, end: 0.55 },
    /** galleryReveal 타이밍은 centerMove 기준으로 계산 */
    galleryReveal: { end: 0.72 },
    /** galleryCover 슬라이드 제거 — hero와 동일 viewport에서 연속 전환 */
    galleryCover: { start: 0, end: 0.52 },
    aboutCover: { start: 0.72, end: 1.0 },
  },
  galleryReveal: {
    /** viewport 기준 — 카드가 화면 아래에서 올라옴 */
    fromYVh: { desktop: 0.52, mobile: 0.46 },
    bottomCenterFromYVh: { desktop: 0.4, mobile: 0.34 },
    /** centerMove와 동시 시작, 텀 없음 */
    startAtCenterMoveProgress: 0,
    /** centerMove 종료와 동기 — 중앙 카드가 빠질 때 갤러리 자리 잡음 */
    endAtCenterMoveProgress: 1,
    staggerSpread: 0,
    /** stagger 순서 — bottomCenter(중앙 하단)가 첫 번째 */
    order: [
      'bottomCenter',
      'topLeft',
      'midLeft',
      'topRight',
      'midRight',
      'bottomRight',
    ] as const,
  },
  centerMove: {
    /** fallback px — 실제 값은 런타임 viewport 측정으로 덮어씀 */
    y: { desktop: -900, mobile: -560 },
    scale: { desktop: 0.82, mobile: 0.88 },
    exitBuffer: { desktop: 48, mobile: 32 },
  },
  /** Back/Front 타이포 — 스크롤 시 왼쪽으로 drift */
  titleDrift: {
    x: { desktop: -240, mobile: -112 },
  },
  floatingItems: [
    { slug: 'discovery-expedition', slot: 'topLeft' as const, aspect: '4 / 3' },
    { slug: 'wconcept-us', slot: 'topRight' as const, aspect: '3 / 4' },
    { slug: 'casamia', slot: 'midLeft' as const, aspect: '3 / 4' },
    { slug: 'starbucks-employee-platform', slot: 'bottomRight' as const, aspect: '16 / 10' },
    { slug: 'mlb-korea', slot: 'bottomCenter' as const, aspect: '4 / 3' },
    { slug: 'wconcept-us', slot: 'midRight' as const, aspect: '1 / 1' },
  ] as const,
} as const;

export type HeroFloatSlot = (typeof heroStoryConfig.floatingItems)[number]['slot'];

/** centerMove 시작과 동시 — gallery 카드 연속 등장 */
export function getGalleryRevealStart(): number {
  const { start, end } = heroStoryConfig.scrollPhases.centerMove;
  const t = heroStoryConfig.galleryReveal.startAtCenterMoveProgress;
  return start + (end - start) * t;
}

/** gallery float reveal이 끝나는 timeline progress */
export function getGalleryRevealEnd(): number {
  const { start, end } = heroStoryConfig.scrollPhases.centerMove;
  const t = heroStoryConfig.galleryReveal.endAtCenterMoveProgress;
  return start + (end - start) * t;
}
