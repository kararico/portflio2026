'use client';

import { usePathname } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CursorContext } from '@/contexts/CursorContext';
import { registerCursorListener } from '@/utils/cursorController';
import {
  CURSOR_STATES,
  isExpandedCursorState,
  normalizeCursorState,
  type CursorState,
} from '@/utils/cursorStates';
import { gsap } from '@/utils/gsap/registerGsap';
import CustomCursor from './CustomCursor';

function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface CursorProviderProps {
  children: React.ReactNode;
}

export default function CursorProvider({ children }: CursorProviderProps) {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<CursorState>(CURSOR_STATES.DEFAULT);
  const hasMovedRef = useRef(false);

  const [state, setState] = useState<CursorState>(CURSOR_STATES.DEFAULT);
  const [isActive, setIsActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const applyState = useCallback((next: CursorState) => {
    const normalized = normalizeCursorState(next);
    if (stateRef.current === normalized) return;
    stateRef.current = normalized;
    setState(normalized);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarse = isCoarsePointer();
    const reduced = prefersReducedMotion();
    setIsActive(!coarse);
    setReducedMotion(reduced);
    document.body.classList.toggle('cursor-custom', !coarse);

    return () => {
      document.body.classList.remove('cursor-custom');
    };
  }, []);

  useEffect(() => {
    applyState(CURSOR_STATES.DEFAULT);
    hasMovedRef.current = false;
  }, [pathname, applyState]);

  useEffect(() => {
    return registerCursorListener(applyState);
  }, [applyState]);

  useLayoutEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xSetter = reducedMotion
      ? gsap.quickSetter(cursor, 'x', 'px')
      : gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const ySetter = reducedMotion
      ? gsap.quickSetter(cursor, 'y', 'px')
      : gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });

    const moveCursor = (clientX: number, clientY: number) => {
      if (reducedMotion) {
        xSetter(clientX);
        ySetter(clientY);
      } else {
        (xSetter as gsap.QuickToFunc)(clientX);
        (ySetter as gsap.QuickToFunc)(clientY);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      moveCursor(event.clientX, event.clientY);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        gsap.to(cursor, { opacity: 1, duration: reducedMotion ? 0 : 0.25, ease: 'power2.out' });
      }
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const el = target.closest('[data-cursor-style]');
      applyState(normalizeCursorState(el?.getAttribute('data-cursor-style')));
    };

    const onMouseLeave = () => {
      hasMovedRef.current = false;
      gsap.to(cursor, { opacity: 0, duration: reducedMotion ? 0 : 0.2, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isActive, reducedMotion, applyState]);

  useLayoutEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const inner = innerRef.current;
    const label = labelRef.current;
    if (!inner) return;

    const expanded = isExpandedCursorState(state);
    const size = expanded ? 80 : 8;

    if (reducedMotion) {
      gsap.set(inner, { width: size, height: size, opacity: expanded ? 1 : 0.85 });
      if (label) gsap.set(label, { opacity: expanded ? 1 : 0 });
      return;
    }

    gsap.to(inner, {
      width: size,
      height: size,
      opacity: expanded ? 1 : 0.85,
      duration: 0.35,
      ease: 'power2.out',
    });

    if (label) {
      gsap.to(label, {
        opacity: expanded ? 1 : 0,
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  }, [state, isActive, reducedMotion]);

  const value = useMemo(
    () => ({ state, isActive, reducedMotion }),
    [state, isActive, reducedMotion],
  );

  return (
    <CursorContext.Provider value={value}>
      {children}
      {isActive && (
        <CustomCursor
          ref={cursorRef}
          state={state}
          innerRef={innerRef}
          labelRef={labelRef}
        />
      )}
    </CursorContext.Provider>
  );
}
