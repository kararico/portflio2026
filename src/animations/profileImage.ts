import { gsap } from '@/utils/gsap/registerGsap';
import {
  type ProfileInteractionMode,
  type ProfileInteractionPreset,
} from '@/utils/profileImageConfig';

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
  gsap.set(media, { transformOrigin: 'center center' });

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
  /** true — about.ts 타임라인이 reveal 담당 */
  manual?: boolean;
}

/** Profile image reveal은 about.ts에서 처리 */
export function initProfileImageReveal(
  root: HTMLElement,
  _mode?: ProfileInteractionMode,
  _options?: ProfileImageRevealOptions,
): () => void {
  void root;
  void _mode;
  void _options;
  return () => undefined;
}
