/** 터치 입력 가능 디바이스 (Android / iOS 등) */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches
  );
}

/** Lenis 대신 네이티브 스크롤 사용 — 실기기 터치 환경 */
export function shouldUseNativeScroll(): boolean {
  if (typeof window === 'undefined') return false;
  return isTouchDevice();
}

export function isIosLike(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroidLike(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}
