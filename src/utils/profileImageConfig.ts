export type ProfileInteractionMode = 'default' | 'enhanced' | 'scaleOnly';

export interface ProfileInteractionPreset {
  parallaxMax: number;
  scale: number;
  rotation: number;
  scaleDuration: number;
  parallaxDuration: number;
}

export const PROFILE_INTERACTION_PRESETS: Record<ProfileInteractionMode, ProfileInteractionPreset> = {
  default: {
    parallaxMax: 8,
    scale: 1.03,
    rotation: 0.4,
    scaleDuration: 0.8,
    parallaxDuration: 0.45,
  },
  enhanced: {
    parallaxMax: 18,
    scale: 1.06,
    rotation: 1.2,
    scaleDuration: 0.8,
    parallaxDuration: 0.45,
  },
  scaleOnly: {
    parallaxMax: 0,
    scale: 1.03,
    rotation: 0,
    scaleDuration: 0.8,
    parallaxDuration: 0.45,
  },
};

/** Distortion hover — scale kept subtle to avoid conflict with WebGL warp */
export const PROFILE_DISTORTION_HOVER_PRESET: ProfileInteractionPreset = {
  parallaxMax: 0,
  scale: 1.015,
  rotation: 0,
  scaleDuration: 0.42,
  parallaxDuration: 0.45,
};

import { assetPath } from '@/utils/assetPath';

export const PROFILE_DISTORTION_DEFAULTS = {
  intensity: 0.18,
  enterDuration: 0.42,
  leaveDuration: 0.4,
  ease: 'power2.out',
  displacementMapUrl: assetPath('/textures/displacement-soft.png'),
  objectPositionY: 0.18,
  imageOpacity: 0.95,
} as const;

export function resolveProfileInteractionMode(
  param: string | null,
): ProfileInteractionMode {
  if (param === 'enhanced' || param === 'scaleOnly') return param;
  return 'default';
}

/** URL ?profile-distortion=0.12 — debug intensity override */
export function resolveProfileDistortionIntensity(param: string | null): number {
  if (!param) return PROFILE_DISTORTION_DEFAULTS.intensity;

  const value = parseFloat(param);
  if (Number.isNaN(value)) return PROFILE_DISTORTION_DEFAULTS.intensity;

  return Math.min(0.5, Math.max(0, value));
}

export function canUseProfileDistortion(forceHover = false): boolean {
  if (typeof window === 'undefined') return false;
  if (forceHover) return true;
  if (!window.matchMedia('(hover: hover)').matches) return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  return true;
}

/** DevTools-style matrix parse */
export function parseTransformMatrix(transform: string) {
  if (!transform || transform === 'none') {
    return { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
  }

  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };

  const parts = match[1].split(',').map((v) => parseFloat(v.trim()));
  const [a, b, c, d, tx, ty] = parts;
  const scaleX = Math.sqrt(a * a + b * b);
  const scaleY = Math.sqrt(c * c + d * d);
  const rotation = Math.atan2(b, a) * (180 / Math.PI);

  return {
    translateX: Math.round(tx * 100) / 100,
    translateY: Math.round(ty * 100) / 100,
    scaleX: Math.round(scaleX * 1000) / 1000,
    scaleY: Math.round(scaleY * 1000) / 1000,
    rotation: Math.round(rotation * 100) / 100,
  };
}
