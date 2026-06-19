import styles from './LandscapeOrientationOverlay.module.scss';

export default function PhoneRotateIcon() {
  return (
    <div className={styles.phoneAnimation} aria-hidden="true">
      <svg
        className={styles.phoneIcon}
        viewBox="0 0 32 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="1"
          width="28"
          height="54"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <rect x="12" y="4" width="8" height="2" rx="1" fill="currentColor" opacity="0.35" />
        <circle cx="16" cy="49" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      <p className={styles.animationCaption}>세로 화면 권장</p>
    </div>
  );
}
