/**
 * Home(Hero·About) intro reveal — SPA 세션 내 1회만 재생.
 * F5·신규 탭은 모듈 리로드로 false, bfcache 복원 시 pageshow에서 reset.
 */
let homeIntroSessionComplete = false;

export function isHomeIntroSessionComplete(): boolean {
  return homeIntroSessionComplete;
}

export function markHomeIntroSessionComplete(): void {
  homeIntroSessionComplete = true;
}

export function resetHomeIntroSession(): void {
  homeIntroSessionComplete = false;
}

if (typeof window !== 'undefined') {
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) resetHomeIntroSession();
  });
}
