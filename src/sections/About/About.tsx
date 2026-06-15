'use client';

import Link from 'next/link';
import { Suspense, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { initAboutAnimation, bindProfileSectionReveal, bindSelectedProjectsAnimation, bindBackgroundTypeParallax } from '@/animations/about';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { siteConfig } from '@/data/site';
import { getHeroFeaturedProjects } from '@/data/projects';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import AboutBackground, { type AboutTypeLabelKey } from './AboutBackground';
import AboutImage from './AboutImage';
import {
  PROFILE_DISTORTION_DEFAULTS,
  resolveProfileDistortionIntensity,
} from '@/utils/profileImageConfig';
import styles from './About.module.scss';

function resolveTypeLabelKey(param: string | null): AboutTypeLabelKey {
  if (param === 'since2013') return 'since2013';
  return siteConfig.about.background.defaultTypeLabel;
}

function AboutContent({
  typeLabelKey,
  distortionIntensity,
  forceHover = false,
}: {
  typeLabelKey: AboutTypeLabelKey;
  distortionIntensity: number;
  forceHover?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { about, works, hero } = siteConfig;
  const featuredProjects = getHeroFeaturedProjects();
  const typeLabel = about.background.typeLabels[typeLabelKey];

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    registerGsapPlugins();
    const cleanupReveal = bindProfileSectionReveal(root);
    const cleanupSelected = bindSelectedProjectsAnimation(root);
    const cleanupBackground = bindBackgroundTypeParallax(root);
    const ctx = initAboutAnimation(root);
    refreshScrollTrigger();

    return () => {
      cleanupReveal();
      cleanupSelected();
      cleanupBackground();
      ctx.revert();
    };
  }, [typeLabelKey, distortionIntensity, forceHover]);

  return (
    <section
      className={styles.about}
      id="about"
      ref={sectionRef}
      data-about-type={typeLabelKey}
      data-profile-distortion-intensity={String(distortionIntensity)}
      data-profile-force-hover={forceHover ? 'true' : undefined}
    >
      <AboutBackground typeLabel={typeLabel} typeLabelKey={typeLabelKey} />

      <div className={`container-fluid ${styles.content}`}>
        <div className={styles.profileRow} data-about-profile-row>
          <div className={styles.profileText}>
            <header className={styles.profileHeader}>
              <span className={styles.sectionLabel} data-about-reveal="title">
                {about.sectionLabel}
              </span>
            </header>

            <div className={styles.profileCopy}>
              <div className={styles.introProse}>
                {about.introParagraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className={styles.bodyText}
                    data-about-reveal="description"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <AboutImage distortionIntensity={distortionIntensity} forceHover={forceHover} />
        </div>

        <div className={styles.clientsBlock} data-about-clients>
          <span className={styles.selectedLabel}>{hero.clientsLabel}</span>
          <p className={styles.clientsList} data-about-reveal="description">
            {hero.clients.join(' · ')}
          </p>
        </div>

        <div className={styles.selectedBlock} data-about-selected>
          <span className={styles.selectedLabel} data-about-selected-label>
            {about.selectedLabel}
          </span>

          <div className={styles.projectArchive}>
            {featuredProjects.map((project) => (
              <article key={project.id} className={styles.projectEntry} data-about-project-entry>
                <Link
                  href={`/work/${project.slug}`}
                  className={styles.projectLink}
                  data-cursor-style="view"
                >
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectRole}>{project.role}</p>
                  <span className={styles.projectYear}>{project.year}</span>
                </Link>
              </article>
            ))}
          </div>

          <Link
            href={`#${works.sectionId}`}
            className={styles.viewAllLink}
            data-cursor-style="small"
            data-about-view-all
          >
            {about.viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutWithParams() {
  const searchParams = useSearchParams();
  const typeLabelKey = resolveTypeLabelKey(searchParams.get('about-type'));
  const distortionIntensity = resolveProfileDistortionIntensity(
    searchParams.get('profile-distortion'),
  );
  const forceHover = searchParams.get('profile-force-hover') === '1';

  return (
    <AboutContent
      typeLabelKey={typeLabelKey}
      distortionIntensity={distortionIntensity}
      forceHover={forceHover}
    />
  );
}

export default function About() {
  const fallbackKey = siteConfig.about.background.defaultTypeLabel;

  return (
    <Suspense
      fallback={
        <AboutContent
          typeLabelKey={fallbackKey}
          distortionIntensity={PROFILE_DISTORTION_DEFAULTS.intensity}
        />
      }
    >
      <AboutWithParams />
    </Suspense>
  );
}
