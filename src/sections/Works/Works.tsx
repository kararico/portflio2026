'use client';

import { useRef, useLayoutEffect, useCallback } from 'react';
import { projects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import { useLenis } from '@/hooks/useLenis';
import {
  initWorksAnimations,
  type WorksItemRefs,
} from '@/animations/works';
import WorksItem from './WorksItem';
import styles from './Works.module.scss';

export default function Works() {
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const entryRefs = useRef<(HTMLElement | null)[]>([]);
  const indexRefs = useRef<(HTMLElement | null)[]>([]);
  const headerRefs = useRef<(HTMLElement | null)[]>([]);
  const metaRefs = useRef<(HTMLElement | null)[]>([]);
  const visualRefs = useRef<(HTMLElement | null)[]>([]);

  const collectItemRefs = useCallback((): WorksItemRefs[] => {
    return projects.map((_, index) => {
      const entry = entryRefs.current[index];
      const indexEl = indexRefs.current[index];
      const headerEl = headerRefs.current[index];
      const metaEl = metaRefs.current[index];
      const visualEl = visualRefs.current[index];

      if (!entry || !indexEl || !headerEl || !metaEl || !visualEl) {
        return null;
      }

      const imageInner = visualEl.querySelector('[data-works-image-inner]') as HTMLElement | null;
      if (!imageInner) return null;

      const revealTargets = Array.from(
        entry.querySelectorAll('[data-reveal-item]'),
      ) as HTMLElement[];

      return {
        entry,
        index: indexEl,
        header: headerEl,
        meta: metaEl,
        visual: visualEl,
        imageInner,
        revealTargets,
      };
    }).filter((item): item is WorksItemRefs => item !== null);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const items = collectItemRefs();
    if (items.length === 0) return;

    const { destroy } = initWorksAnimations({ section, header, items });

    return () => {
      destroy();
    };
  }, [lenis, collectItemRefs]);

  return (
    <section
      className={styles.works}
      id={siteConfig.works.sectionId}
      ref={sectionRef}
      data-cursor-style="default"
      data-works-section
    >
      <div className="container-fluid">
        <div className={styles.sectionHeader} ref={headerRef}>
          <span className={styles.indexLabel}>{siteConfig.works.indexLabel}</span>
        </div>

        <div className={styles.archive}>
          {projects.map((project, index) => (
            <WorksItem
              key={project.id}
              project={project}
              index={index}
              priority={index < 2}
              entryRef={(el) => {
                entryRefs.current[index] = el;
              }}
              indexRef={(el) => {
                indexRefs.current[index] = el;
              }}
              headerRef={(el) => {
                headerRefs.current[index] = el;
              }}
              metaRef={(el) => {
                metaRefs.current[index] = el;
              }}
              visualRef={(el) => {
                visualRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
