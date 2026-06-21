import gsap from 'gsap';

export const SHOWCASE_TRANSITION_DURATION_S = 0.9;
export const SHOWCASE_TRANSITION_DURATION_MS = SHOWCASE_TRANSITION_DURATION_S * 1000;
const TRANSITION_EASE = 'power2.out';
const INCOMING_SCALE_FROM = 1.08;
const OUTGOING_SCALE_TO = 1.03;
const KEN_BURNS_SCALE_TO = 1.02;

function setImageOrigin(img: HTMLElement) {
  gsap.set(img, { transformOrigin: 'center center', force3D: true });
}

export function srcMatchesElement(img: HTMLImageElement, expectedSrc: string): boolean {
  if (!expectedSrc) return false;
  return (
    img.currentSrc === expectedSrc ||
    img.src === expectedSrc ||
    img.src.endsWith(expectedSrc) ||
    img.currentSrc.endsWith(expectedSrc)
  );
}

export function initShowcaseLayer(img: HTMLElement, visible: boolean) {
  setImageOrigin(img);
  gsap.set(img, {
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : INCOMING_SCALE_FROM,
  });
}

export function hideShowcaseBufferLayer(layerEl: HTMLElement, imgEl: HTMLElement): void {
  gsap.killTweensOf(imgEl);
  setImageOrigin(imgEl);
  gsap.set(imgEl, { opacity: 0, scale: INCOMING_SCALE_FROM });
  gsap.set(layerEl, { zIndex: 0, visibility: 'hidden' });
}

export function showShowcaseActiveLayer(layerEl: HTMLElement, imgEl: HTMLElement): void {
  gsap.killTweensOf(imgEl);
  setImageOrigin(imgEl);
  gsap.set(imgEl, { opacity: 1, scale: 1 });
  gsap.set(layerEl, { zIndex: 1, visibility: 'visible' });
}

export function runShowcaseTransition(
  outgoingImg: HTMLElement,
  incomingImg: HTMLElement,
  outgoingLayer: HTMLElement,
  incomingLayer: HTMLElement,
  onComplete: () => void,
): gsap.core.Timeline {
  gsap.killTweensOf([outgoingImg, incomingImg]);
  setImageOrigin(outgoingImg);
  setImageOrigin(incomingImg);

  gsap.set(outgoingLayer, { zIndex: 1, visibility: 'visible' });
  gsap.set(incomingLayer, { zIndex: 2, visibility: 'visible' });
  gsap.set(outgoingImg, { opacity: 1, scale: 1 });
  gsap.set(incomingImg, { opacity: 0, scale: INCOMING_SCALE_FROM });

  return gsap
    .timeline({
      onComplete: () => {
        hideShowcaseBufferLayer(outgoingLayer, outgoingImg);
        showShowcaseActiveLayer(incomingLayer, incomingImg);
        onComplete();
      },
    })
    .to(
      outgoingImg,
      {
        opacity: 0,
        scale: OUTGOING_SCALE_TO,
        duration: SHOWCASE_TRANSITION_DURATION_S,
        ease: TRANSITION_EASE,
      },
      0,
    )
    .to(
      incomingImg,
      {
        opacity: 1,
        scale: 1,
        duration: SHOWCASE_TRANSITION_DURATION_S,
        ease: TRANSITION_EASE,
      },
      0,
    );
}

/** kill 시 onComplete 미실행 — active 레이어만 보이도록 안전 복구 */
export function safeKillShowcaseTransition(
  timeline: gsap.core.Timeline | null,
  layerEls: [HTMLDivElement | null, HTMLDivElement | null],
  activeLayer: 0 | 1,
): void {
  if (!timeline) return;

  timeline.kill();

  const activeEl = layerEls[activeLayer];
  const activeImg = activeEl?.querySelector<HTMLImageElement>('[data-showcase-image]');
  const bufferLayer: 0 | 1 = activeLayer === 0 ? 1 : 0;
  const bufferEl = layerEls[bufferLayer];
  const bufferImg = bufferEl?.querySelector<HTMLImageElement>('[data-showcase-image]');

  if (activeEl && activeImg) {
    showShowcaseActiveLayer(activeEl, activeImg);
  }
  if (bufferEl && bufferImg) {
    hideShowcaseBufferLayer(bufferEl, bufferImg);
  }
}

export function startKenBurnsDrift(
  img: HTMLElement,
  holdDurationMs: number,
): gsap.core.Tween | null {
  if (holdDurationMs <= 0) return null;

  gsap.killTweensOf(img);
  setImageOrigin(img);
  gsap.set(img, { opacity: 1, scale: 1 });

  return gsap.to(img, {
    scale: KEN_BURNS_SCALE_TO,
    duration: holdDurationMs / 1000,
    ease: 'none',
  });
}

export function killShowcaseAnimations(elements: HTMLElement[]) {
  gsap.killTweensOf(elements);
}

export function preloadShowcaseImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
    img.src = src;
  });
}

function waitForImageLoad(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${img.src}`));
    };
    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}

/** DOM img src 반영 + load + decode 완료까지 대기 */
export async function waitForDomImageReady(
  img: HTMLImageElement,
  expectedSrc: string,
  maxFrames = 60,
): Promise<void> {
  let frame = 0;

  while (!srcMatchesElement(img, expectedSrc)) {
    if (frame >= maxFrames) {
      throw new Error(`Image src mismatch: expected ${expectedSrc}, got ${img.src}`);
    }
    frame += 1;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }

  await waitForImageLoad(img);

  if (typeof img.decode === 'function') {
    try {
      await img.decode();
    } catch {
      // decode 실패 시 load 완료 상태로 진행
    }
  }
}

/** @deprecated waitForDomImageReady 사용 */
export function waitForImageElement(img: HTMLImageElement): Promise<void> {
  return waitForImageLoad(img);
}

export function readLayerOpacity(layerEl: HTMLDivElement | null): number {
  const img = layerEl?.querySelector<HTMLElement>('[data-showcase-image]');
  if (!img) return -1;
  const value = gsap.getProperty(img, 'opacity');
  return typeof value === 'number' ? value : Number.parseFloat(String(value)) || 0;
}
