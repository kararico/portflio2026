'use client';

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';

export function useGsapContext(
  scopeRef: RefObject<HTMLElement | null>,
  setup: () => void,
  deps: DependencyList = [],
): void {
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    registerGsapPlugins();

    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      setupRef.current();
    }, scope);

    return () => {
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
