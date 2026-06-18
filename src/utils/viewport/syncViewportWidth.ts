/** 리사이즈 시 문서 scrollWidth가 clientWidth와 어긋나지 않도록 뷰포트 너비 CSS 변수 동기화 */
export function syncViewportWidth(): void {
  if (typeof window === 'undefined') return;

  const doc = document.documentElement;
  const width = doc.clientWidth;

  doc.style.setProperty('--viewport-width', `${width}px`);

  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }
}

export function bindViewportWidthSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  syncViewportWidth();

  const onResize = () => syncViewportWidth();

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  const vv = window.visualViewport;
  vv?.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    vv?.removeEventListener('resize', onResize);
  };
}
