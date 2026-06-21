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

export function initShowcaseLayer(img: HTMLElement, visible: boolean) {
  setImageOrigin(img);
  gsap.set(img, {
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : INCOMING_SCALE_FROM,
  });
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
        gsap.set(outgoingImg, { opacity: 0, scale: INCOMING_SCALE_FROM });
        gsap.set(outgoingLayer, { zIndex: 0 });
        gsap.set(incomingImg, { opacity: 1, scale: 1 });
        gsap.set(incomingLayer, { zIndex: 1 });
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

export function waitForImageElement(img: HTMLImageElement): Promise<void> {
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
