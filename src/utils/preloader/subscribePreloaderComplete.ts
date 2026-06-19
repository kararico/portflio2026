/** Preloader fade-out 완료 후 scroll unlock / DOM 제거 시 1회 콜백 */
export function subscribePreloaderComplete(onComplete: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const root = document.documentElement;
  let done = false;
  let rootObserver: MutationObserver | null = null;
  let bodyObserver: MutationObserver | null = null;

  const complete = () => {
    if (done) return;
    done = true;
    rootObserver?.disconnect();
    bodyObserver?.disconnect();
    onComplete();
  };

  const tryComplete = () => {
    const preloaderEl = document.querySelector('[data-preloader]');
    if (!root.hasAttribute('data-preloader-active') && !preloaderEl) {
      complete();
    }
  };

  if (!root.hasAttribute('data-preloader-active') && !document.querySelector('[data-preloader]')) {
    complete();
    return () => {};
  }

  rootObserver = new MutationObserver(tryComplete);
  rootObserver.observe(root, {
    attributes: true,
    attributeFilter: ['data-preloader-active', 'data-preloader-exiting'],
  });

  bodyObserver = new MutationObserver(tryComplete);
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    done = true;
    rootObserver?.disconnect();
    bodyObserver?.disconnect();
  };
}
