'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutImage.module.scss';

interface ProfileImageDistortionProps {
  frameRef: React.RefObject<HTMLDivElement | null>;
  mediaRef: React.RefObject<HTMLDivElement | null>;
  imageSrc: string;
  intensity: number;
  forceHover?: boolean;
  enabled: boolean;
}

export default function ProfileImageDistortion({
  frameRef,
  mediaRef,
  imageSrc,
  intensity,
  forceHover = false,
  enabled,
}: ProfileImageDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const frame = frameRef.current;
    const media = mediaRef.current;
    const canvas = canvasRef.current;
    if (!frame || !media || !canvas) return;

    let cleanup: (() => void) | undefined;

    void import('@/animations/profileImageDistortion').then(({ bindProfileImageDistortion }) => {
      if (!frameRef.current || !mediaRef.current || !canvasRef.current) return;

      cleanup = bindProfileImageDistortion({
        frame,
        media,
        canvas,
        imageSrc,
        intensity,
        forceHover,
        revealOnScroll: !forceHover,
      });
    });

    return () => {
      cleanup?.();
    };
  }, [enabled, frameRef, mediaRef, imageSrc, intensity, forceHover]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={styles.distortionCanvas}
      aria-hidden="true"
      data-profile-distortion-canvas
    />
  );
}
