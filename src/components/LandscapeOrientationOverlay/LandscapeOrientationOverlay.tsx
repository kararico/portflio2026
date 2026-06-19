'use client';

import { useLandscapeOrientationOverlay } from '@/hooks/useLandscapeOrientationOverlay';
import PhoneRotateIcon from './PhoneRotateIcon';
import styles from './LandscapeOrientationOverlay.module.scss';

export default function LandscapeOrientationOverlay() {
  const isActive = useLandscapeOrientationOverlay();

  if (!isActive) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="orientation-overlay-title"
      aria-describedby="orientation-overlay-description"
    >
      <div className={styles.content}>
        <PhoneRotateIcon />

        <h1 id="orientation-overlay-title" className={styles.title}>
          기기를 세로로 돌려주세요
        </h1>

        <p id="orientation-overlay-description" className={styles.description}>
          이 사이트는 세로 모드에 최적화되어 있습니다.
        </p>
      </div>
    </div>
  );
}
