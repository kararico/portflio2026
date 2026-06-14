'use client';

import { useRef, useLayoutEffect } from 'react';
import type { Project } from '@/types/project';
import { useProjectTransition } from '@/components/ProjectTransition/ProjectTransitionProvider';
import { initWorkDetailAnimation } from '@/animations/workDetail';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { useLenis } from '@/hooks/useLenis';
import WorkDetailStory from './WorkDetailStory';
import WorkDetailNext from './WorkDetailNext';
import styles from './WorkDetail.module.scss';

interface WorkDetailProps {
  project: Project;
  nextProject?: Project;
}

export default function WorkDetail({ project, nextProject }: WorkDetailProps) {
  const lenis = useLenis();
  const { isTransitioning, phase } = useProjectTransition();
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || isTransitioning || phase !== 'idle') return;

    registerGsapPlugins();
    const ctx = initWorkDetailAnimation(root, { skipHeroReveal: true });
    refreshScrollTrigger();

    return () => {
      ctx.revert();
    };
  }, [project.slug, lenis, isTransitioning, phase]);

  return (
    <article className={styles.detail} ref={rootRef} data-work-detail data-cursor-style="default">
      <WorkDetailStory project={project} />
      {nextProject && <WorkDetailNext nextProject={nextProject} />}
    </article>
  );
}
