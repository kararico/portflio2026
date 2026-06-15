'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/site';
import { canUseProfileDistortion } from '@/utils/profileImageConfig';
import ProfileImageDistortion from './ProfileImageDistortion';
import styles from './AboutImage.module.scss';

interface AboutImageProps {
  distortionIntensity: number;
  forceHover?: boolean;
}

export default function AboutImage({
  distortionIntensity,
  forceHover = false,
}: AboutImageProps) {
  const { portraitImage, portraitAlt, portraitCaption } = siteConfig.about;
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [distortionEnabled, setDistortionEnabled] = useState(false);

  useEffect(() => {
    setDistortionEnabled(canUseProfileDistortion(forceHover));
  }, [forceHover]);

  return (
    <figure className={styles.figure} data-about-image>
      <div className={styles.reveal} data-about-image-reveal>
        <div
          ref={frameRef}
          className={styles.frame}
          data-about-image-frame
          data-profile-distortion={distortionEnabled ? 'true' : 'false'}
        >
          <div ref={mediaRef} className={styles.media} data-about-image-media>
            <Image
              src={portraitImage}
              alt={portraitAlt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className={styles.image}
              priority={false}
            />
            <ProfileImageDistortion
              frameRef={frameRef}
              mediaRef={mediaRef}
              imageSrc={portraitImage}
              intensity={distortionIntensity}
              forceHover={forceHover}
              enabled={distortionEnabled}
            />
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.captionLabel} data-about-reveal="meta">
          {portraitCaption.label}
        </span>
        <span className={styles.captionYear} data-about-reveal="meta">
          {portraitCaption.year}
        </span>
        <span className={styles.captionLine} data-about-reveal="meta">
          {portraitCaption.line}
        </span>
      </figcaption>
    </figure>
  );
}
