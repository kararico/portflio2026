import { isTouchDevice } from '@/utils/scroll/scrollEnvironment';

/** 태블릿(768px) 미만 — 가로 모드에서도 짧은 변으로 모바일 판별 */
const MOBILE_MAX_SHORT_EDGE = 767;

/**
 * 모바일 터치 디바이스 + 가로 모드일 때만 orientation overlay 표시.
 * Desktop·Tablet(짧은 변 ≥ 768px) 제외.
 */
export function shouldShowOrientationOverlay(): boolean {
  if (typeof window === 'undefined') return false;
  if (!isTouchDevice()) return false;

  const { innerWidth, innerHeight } = window;
  const shortEdge = Math.min(innerWidth, innerHeight);
  const isLandscape = innerWidth > innerHeight;

  return isLandscape && shortEdge <= MOBILE_MAX_SHORT_EDGE;
}
