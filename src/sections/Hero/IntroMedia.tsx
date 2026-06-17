'use client';

import { heroStoryConfig } from '@/data/heroStory';
import { getProjectBySlug } from '@/data/projects';
import { getProjectHomeHero, resolveImageSrc } from '@/utils/projectImage';
import styles from './IntroMedia.module.scss';

export default function IntroMedia() {
  const project = getProjectBySlug(heroStoryConfig.centerMediaSlug);
  if (!project) return null;

  const src = resolveImageSrc(getProjectHomeHero(project));

  return (
    <div className={styles.media} data-intro-media>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={project.title}
        className={styles.image}
        decoding="async"
        loading="eager"
      />
    </div>
  );
}
