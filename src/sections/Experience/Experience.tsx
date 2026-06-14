'use client';

import { useRef, useLayoutEffect } from 'react';
import { careerEntries } from '@/data/career';
import { siteConfig } from '@/data/site';
import { initExperienceAnimation } from '@/animations/experience';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { useLenis } from '@/hooks/useLenis';
import TimelineItem from './TimelineItem';
import styles from './Experience.module.scss';

export default function Experience() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    registerGsapPlugins();
    const ctx = initExperienceAnimation(root);
    refreshScrollTrigger();

    return () => {
      ctx.revert();
    };
  }, [lenis]);

  const { sectionId, sectionLabel, sectionDesc } = siteConfig.experience;

  return (
    <section
      className={styles.experience}
      id={sectionId}
      ref={sectionRef}
      aria-labelledby="experience-heading"
    >
      <div className="container-fluid">
        <header className={styles.sectionHeader} data-experience-header>
          <span className={styles.indexLabel} data-reveal-item>
            Career Archive
          </span>
          <h2 className={styles.sectionTitle} id="experience-heading" data-reveal-item>
            {sectionLabel}
          </h2>
          <p className={styles.sectionDesc} data-reveal-item>
            {sectionDesc}
          </p>
        </header>

        <div className={styles.timeline}>
          {careerEntries.map((entry, index) => (
            <TimelineItem key={entry.id} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
