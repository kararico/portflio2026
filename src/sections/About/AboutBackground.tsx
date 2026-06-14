'use client';

import styles from './AboutBackground.module.scss';

export type AboutTypeLabelKey = 'profile' | 'since2013';

interface AboutBackgroundProps {
  typeLabel: string;
  typeLabelKey: AboutTypeLabelKey;
}

function GuideLines() {
  return (
    <>
      <span className={styles.guideVertical} />
      <span className={styles.guideHorizontal} />
      <span className={styles.guideBaseline} />
    </>
  );
}

export default function AboutBackground({ typeLabel, typeLabelKey }: AboutBackgroundProps) {
  return (
    <div className={styles.bg} aria-hidden="true" data-about-bg data-about-type={typeLabelKey}>
      <div className={styles.typeLayer}>
        <div className={styles.typeOffset}>
          <div className={styles.typeParallax} data-about-type-word>
            <span
              className={`${styles.typeWord} ${typeLabelKey === 'since2013' ? styles.typeWordSince : ''}`}
            >
              {typeLabel}
            </span>
          </div>
        </div>
      </div>
      <GuideLines />
    </div>
  );
}
