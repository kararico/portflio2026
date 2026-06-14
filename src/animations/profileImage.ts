import { gsap, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { ABOUT_PROFILE_REVEAL_EVENT } from '@/animations/aboutProfileReveal';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import {
  type ProfileInteractionMode,
  type ProfileInteractionPreset,
} from '@/utils/profileImageConfig';

const PROFILE_IMAGE_FALLBACK_START = 'top bottom';

function mapParallax(normalized: number, max: number): number {
  return normalized * max;
}

/** hover 시 frame rotation만 — clip-path는 reveal 전용 (inset↔polygon 전환 시 깜빡임) */
function playEnterEffects(frame: HTMLElement, preset: ProfileInteractionPreset): gsap.core.Tween | null {
  if (preset.rotation <= 0) return null;

  return gsap.to(frame, {
    rotation: preset.rotation,
    duration: 0.5,
    ease: 'sine.out',
  });
}

export function bindProfileImageHover(
  frame: HTMLElement,
  media: HTMLElement,
  preset: ProfileInteractionPreset,
): () => void {
  gsap.set(frame, { rotation: 0, transformOrigin: '50% 52%' });
  gsap.set(media, { scale: 1, x: 0, y: 0, transformOrigin: 'center center' });

  if (preset.parallaxMax <= 0 && preset.scale <= 1 && preset.rotation <= 0) {
    return () => undefined;
  }

  const parallaxX =
    preset.parallaxMax > 0
      ? gsap.quickTo(media, 'x', { duration: preset.parallaxDuration, ease: 'sine.out' })
      : null;
  const parallaxY =
    preset.parallaxMax > 0
      ? gsap.quickTo(media, 'y', { duration: preset.parallaxDuration, ease: 'sine.out' })
      : null;

  let enterTween: gsap.core.Tween | null = null;
  let isHovering = false;

  frame.dataset.hoverBound = 'true';

  const onEnter = () => {
    isHovering = true;
    enterTween?.kill();
    enterTween = playEnterEffects(frame, preset);
    if (preset.scale > 1) {
      gsap.to(media, {
        scale: preset.scale,
        duration: preset.scaleDuration,
        ease: 'power2.out',
      });
    }
  };

  const onMove = (event: MouseEvent) => {
    if (!isHovering || !parallaxX || !parallaxY) return;

    const rect = frame.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;

    parallaxX(mapParallax(nx * 2, preset.parallaxMax));
    parallaxY(mapParallax(ny * 2, preset.parallaxMax));
  };

  const onLeave = () => {
    isHovering = false;
    enterTween?.kill();

    gsap.to(frame, {
      rotation: 0,
      duration: 0.5,
      ease: 'sine.out',
    });

    gsap.to(media, {
      scale: 1,
      x: 0,
      y: 0,
      duration: preset.scaleDuration,
      ease: 'power2.out',
    });
  };

  frame.addEventListener('mouseenter', onEnter);
  frame.addEventListener('mousemove', onMove);
  frame.addEventListener('mouseleave', onLeave);

  return () => {
    enterTween?.kill();
    frame.removeEventListener('mouseenter', onEnter);
    frame.removeEventListener('mousemove', onMove);
    frame.removeEventListener('mouseleave', onLeave);
    frame.dataset.hoverBound = 'false';
    gsap.set(frame, { rotation: 0 });
    gsap.set(media, { scale: 1, x: 0, y: 0 });
  };
}

interface ProfileImageRevealOptions {
  manual?: boolean;
}

export function initProfileImageReveal(
  root: HTMLElement,
  reduced: boolean,
  _mode?: ProfileInteractionMode,
  options?: ProfileImageRevealOptions,
): () => void {
  void _mode;
  const wrapper = root.querySelector<HTMLElement>('[data-about-image]');
  const reveal = root.querySelector<HTMLElement>('[data-about-image-reveal]');
  const trigger = root.querySelector<HTMLElement>('[data-about-profile-row]') ?? wrapper;

  if (!wrapper || !reveal || !trigger) {
    return () => undefined;
  }

  const runReveal = () => {
    gsap.fromTo(
      reveal,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      },
    );
  };

  if (reduced) {
    gsap.set(reveal, { opacity: 1, y: 0 });
    gsap.from(reveal, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger,
        start: PROFILE_IMAGE_FALLBACK_START,
        once: true,
      },
    });

    return () => undefined;
  }

  gsap.set(reveal, { opacity: 1, y: 0 });

  if (options?.manual) {
    let animated = false;
    const safeRunReveal = () => {
      if (animated) return;
      animated = true;
      runReveal();
    };

    const handler = () => safeRunReveal();
    window.addEventListener(ABOUT_PROFILE_REVEAL_EVENT, handler, { once: true });

    const safetySt = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 92%',
      once: true,
      onEnter: safeRunReveal,
    });

    let intersectionObserver: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.12)) {
            safeRunReveal();
          }
        },
        { threshold: [0, 0.12, 0.25] },
      );
      intersectionObserver.observe(reveal);
    }

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (safetySt.isActive) safeRunReveal();
    });

    return () => {
      window.removeEventListener(ABOUT_PROFILE_REVEAL_EVENT, handler);
      safetySt.kill();
      intersectionObserver?.disconnect();
    };
  }

  gsap.to(reveal, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger,
      start: PROFILE_IMAGE_FALLBACK_START,
      once: true,
    },
  });

  refreshScrollTrigger();

  return () => undefined;
}
