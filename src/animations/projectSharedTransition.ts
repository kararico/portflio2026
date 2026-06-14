import gsap from 'gsap';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';

registerGsapPlugins();

export interface SourceRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function readThumbnailRect(sourceEl: HTMLElement): { rect: SourceRect; imageSrc: string } | null {
  const img = sourceEl.querySelector('img');
  if (!img?.src) return null;

  const bounds = img.getBoundingClientRect();
  return {
    imageSrc: img.currentSrc || img.src,
    rect: {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    },
  };
}

export function lockProjectTransition() {
  document.documentElement.setAttribute('data-project-transition', 'active');
  document.body.style.overflow = 'hidden';
}

export function unlockProjectTransition() {
  document.documentElement.removeAttribute('data-project-transition');
  document.body.style.overflow = '';
}

/** router.push 직후 Detail DOM flash 방지 — overlay만 보이게 */
export function hideTransitionMain(): void {
  const main = document.querySelector<HTMLElement>('.scrollContainer > main');
  if (main) {
    gsap.set(main, { opacity: 0, pointerEvents: 'none' });
  }
}

export function revealTransitionMain(): void {
  const main = document.querySelector<HTMLElement>('.scrollContainer > main');
  if (main) {
    gsap.set(main, { opacity: 1, pointerEvents: 'auto', clearProps: 'opacity' });
  }
}

const PAGE_TRANSITION_EASE = 'power2.inOut';

export function getMainTransitionEl(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#main-transition');
}

function getHeaderEl(): HTMLElement | null {
  return document.querySelector<HTMLElement>('#header');
}

/** Septiembre page-leave: detail → home (fadeOut 0.3s) */
export function fadeOutPageTransition(duration = 0.3): Promise<void> {
  const el = getMainTransitionEl();
  const header = getHeaderEl();
  if (!el && !header) return Promise.resolve();

  return new Promise((resolve) => {
    gsap.killTweensOf([el, header].filter(Boolean));
    gsap.to([el, header].filter(Boolean), {
      opacity: 0,
      duration,
      ease: PAGE_TRANSITION_EASE,
      onComplete: resolve,
    });
  });
}

/** Septiembre page-enter: home fadeIn 0.6s */
export function fadeInPageTransition(duration = 0.6): Promise<void> {
  const el = getMainTransitionEl();
  const header = getHeaderEl();
  if (!el && !header) return Promise.resolve();

  gsap.killTweensOf([el, header].filter(Boolean));
  gsap.set([el, header].filter(Boolean), { opacity: 0, pointerEvents: 'none' });

  return new Promise((resolve) => {
    gsap.to([el, header].filter(Boolean), {
      opacity: 1,
      duration,
      ease: PAGE_TRANSITION_EASE,
      onComplete: () => {
        if (el) gsap.set(el, { pointerEvents: 'auto', clearProps: 'opacity' });
        if (header) gsap.set(header, { pointerEvents: 'auto', clearProps: 'opacity' });
        resolve();
      },
    });
  });
}

export function resetPageTransitionVisibility(): void {
  const el = getMainTransitionEl();
  const header = getHeaderEl();
  if (el) {
    gsap.set(el, { opacity: 1, pointerEvents: 'auto', clearProps: 'opacity' });
  }
  if (header) {
    gsap.set(header, { opacity: 1, pointerEvents: 'auto', clearProps: 'opacity' });
  }
  revealTransitionMain();
}

export function applyOverlayImageRect(el: HTMLElement, rect: SourceRect): void {
  gsap.set(el, {
    position: 'fixed',
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    margin: 0,
    opacity: 1,
    objectFit: 'cover',
    objectPosition: 'center',
    zIndex: 100001,
  });
}

export function waitForSharedHeroTarget(slug: string, timeoutMs = 8000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const started = performance.now();

    const find = () => {
      const target = document.querySelector<HTMLElement>(
        `[data-shared-hero-target][data-project-slug="${slug}"]`,
      );
      if (target) {
        resolve(target);
        return;
      }
      if (performance.now() - started > timeoutMs) {
        reject(new Error('Shared hero target not found'));
        return;
      }
      requestAnimationFrame(find);
    };

    find();
  });
}

export function waitForGalleryThumbnail(slug: string, timeoutMs = 8000): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const started = performance.now();

    const find = () => {
      const target = document.querySelector<HTMLElement>(
        `[data-intro-gallery] [data-gallery-item][data-project-slug="${slug}"]`,
      );
      if (target) {
        resolve(target);
        return;
      }
      if (performance.now() - started > timeoutMs) {
        reject(new Error('Gallery thumbnail not found'));
        return;
      }
      requestAnimationFrame(find);
    };

    find();
  });
}

export function readElementRect(el: HTMLElement): SourceRect {
  const bounds = el.getBoundingClientRect();
  return {
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
}

export function readHeroImageRect(slug: string): { rect: SourceRect; imageSrc: string } | null {
  const target = document.querySelector<HTMLElement>(
    `[data-shared-hero-target][data-project-slug="${slug}"]`,
  );
  if (!target) return null;

  const img = target.querySelector('img');
  return {
    rect: readElementRect(target),
    imageSrc: img?.currentSrc || img?.src || '',
  };
}

export async function waitForNextFrame(count = 2): Promise<void> {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

/** Gallery → Detail: 나머지 이미지·타이포 ghost fade (원본 Septiembre) */
export function dimHomeTransitionContext(sourceEl: HTMLElement): void {
  const galleryItems = document.querySelectorAll<HTMLElement>(
    '[data-intro-gallery] [data-gallery-item]',
  );
  galleryItems.forEach((item) => {
    if (item === sourceEl) return;
    gsap.to(item, { opacity: 0.1, duration: 0.55, ease: 'power2.out' });
  });

  const heroLayer = document.querySelectorAll<HTMLElement>(
    '[data-hero-title], [data-hero-title-front], [data-intro-subtitle], [data-hero-meta], [data-hero-image-layer]',
  );
  gsap.to(heroLayer, { opacity: 0.08, duration: 0.6, ease: 'power2.out' });
}

export function restoreHomeTransitionContext(): void {
  const galleryItems = document.querySelectorAll<HTMLElement>(
    '[data-intro-gallery] [data-gallery-item]',
  );
  gsap.set(galleryItems, { opacity: 1, clearProps: 'opacity' });

  const heroLayer = document.querySelectorAll<HTMLElement>(
    '[data-hero-title], [data-hero-title-front], [data-intro-subtitle], [data-hero-meta], [data-hero-image-layer]',
  );
  gsap.set(heroLayer, { opacity: 1, clearProps: 'opacity' });
}

/** overlay를 target과 동일한 rect로 단일 tween (중간 viewport 추정치 없음) */
export function animateOverlayToRect(
  overlayEl: HTMLElement,
  targetEl: HTMLElement,
  duration = 1.08,
): Promise<void> {
  const rect = readElementRect(targetEl);

  return new Promise((resolve) => {
    gsap.killTweensOf(overlayEl);
    gsap.to(overlayEl, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      duration,
      ease: 'power3.inOut',
      onComplete: resolve,
    });
  });
}

/** hero img paint 완료까지 대기 */
export function waitForImagePaint(container: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    const img = container.querySelector('img');
    if (!img) {
      resolve();
      return;
    }

    const done = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    };

    if (img.complete && img.naturalWidth > 0) {
      done();
      return;
    }

    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}

export function preloadImage(src: string): void {
  if (!src) return;
  const probe = new window.Image();
  probe.src = src;
}

/** overlay → hero target: hero paint 후 overlay 제거 */
async function handoffOverlayToTarget(
  overlayEl: HTMLElement,
  targetEl: HTMLElement,
): Promise<void> {
  gsap.set(targetEl, { opacity: 1, visibility: 'visible' });
  revealTransitionMain();

  await waitForImagePaint(targetEl);

  gsap.set(overlayEl, { opacity: 0, pointerEvents: 'none', visibility: 'hidden' });

  await waitForNextFrame(2);

  gsap.set(targetEl, { clearProps: 'opacity,visibility' });
}

/** 썸네일 → Detail hero: 단일 rect morph (크기 2번 변경 방지) */
export function morphOverlayToHero(
  overlayEl: HTMLElement,
  targetEl: HTMLElement,
  detailRoot: HTMLElement | null,
): Promise<void> {
  gsap.set(targetEl, { opacity: 0, visibility: 'visible' });

  const textTargets = detailRoot?.querySelectorAll<HTMLElement>('[data-detail-hero-reveal]') ?? [];
  const morphDuration = 1.08;

  return new Promise((resolve) => {
    void animateOverlayToRect(overlayEl, targetEl, morphDuration).then(() => {
      void handoffOverlayToTarget(overlayEl, targetEl).then(resolve);
    });

    if (textTargets.length) {
      gsap.fromTo(
        textTargets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.045,
          ease: 'power3.out',
          delay: morphDuration * 0.32,
        },
      );
    }
  });
}

/** Detail hero → Gallery 썸네일: 단일 rect morph */
export function morphOverlayToThumbnail(
  overlayEl: HTMLElement,
  targetEl: HTMLElement,
): Promise<void> {
  const thumbImg = targetEl.querySelector('img');
  const fitTarget = thumbImg ?? targetEl;

  return new Promise((resolve) => {
    void animateOverlayToRect(overlayEl, fitTarget, 0.95).then(() => {
      revealTransitionMain();
      requestAnimationFrame(() => {
        gsap.set(overlayEl, { opacity: 0, pointerEvents: 'none' });
        resolve();
      });
    });
  });
}

export function hideSourceThumbnail(sourceEl: HTMLElement): void {
  gsap.set(sourceEl, { opacity: 0, pointerEvents: 'none' });
}

export function restoreSourceThumbnail(sourceEl: HTMLElement): void {
  gsap.set(sourceEl, { opacity: 1, pointerEvents: 'auto', clearProps: 'opacity' });
}
