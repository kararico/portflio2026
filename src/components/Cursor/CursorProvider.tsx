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
  const [isLightTheme, setIsLightTheme] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  const applyState = useCallback((next: CursorState) => {
    const normalized = normalizeCursorState(next);
    if (stateRef.current === normalized) return;
    stateRef.current = normalized;
    setState(normalized);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarse = isCoarsePointer();
    setIsActive(!coarse);
    document.body.classList.toggle('cursor-custom', !coarse);

    return () => {
      document.body.classList.remove('cursor-custom');
    };
  }, []);

  useEffect(() => {
    applyState(CURSOR_STATES.DEFAULT);
    hasMovedRef.current = false;
    setIsLightTheme(false);
    document.documentElement.classList.remove('cursor-theme-light');
  }, [pathname, applyState]);

  const syncContactCursorTheme = useCallback((x: number, y: number) => {
    if (typeof document === 'undefined') return;

    const target = document.elementFromPoint(x, y);
    const inContact = Boolean(target?.closest('[data-contact-section]'));

    setIsLightTheme((prev) => (prev === inContact ? prev : inContact));
    document.documentElement.classList.toggle('cursor-theme-light', inContact);
  }, []);

  useEffect(() => {
    return registerCursorListener(applyState);
  }, [applyState]);

  useLayoutEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xSetter = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3.out' });
    const ySetter = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3.out' });

    const onMouseMove = (event: MouseEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      syncContactCursorTheme(event.clientX, event.clientY);

      xSetter(event.clientX);
      ySetter(event.clientY);

      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        gsap.to(cursor, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      }
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      syncContactCursorTheme(event.clientX, event.clientY);

      const el = target.closest('[data-cursor-style]');
      applyState(normalizeCursorState(el?.getAttribute('data-cursor-style')));
    };

    const onScroll = () => {
      if (!hasMovedRef.current) return;
      const { x, y } = pointerRef.current;
      syncContactCursorTheme(x, y);
    };

    const onMouseLeave = () => {
      hasMovedRef.current = false;
      setIsLightTheme(false);
      document.documentElement.classList.remove('cursor-theme-light');
      gsap.to(cursor, { opacity: 0, duration: 0.2, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseover', onMouseOver);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.classList.remove('cursor-theme-light');
    };
  }, [isActive, applyState, syncContactCursorTheme]);

  useLayoutEffect(() => {
    if (!isActive || typeof window === 'undefined') return;

    const inner = innerRef.current;
    const label = labelRef.current;
    if (!inner) return;

    const expanded = isExpandedCursorState(state);
    const size = expanded ? 80 : 8;

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
  }, [state, isActive]);

  const value = useMemo(
    () => ({ state, isActive }),
    [state, isActive],
  );

  return (
    <CursorContext.Provider value={value}>
      {children}
      {isActive && (
        <CustomCursor
          ref={cursorRef}
          state={state}
          theme={isLightTheme ? 'light' : 'default'}
          innerRef={innerRef}
          labelRef={labelRef}
        />
      )}
    </CursorContext.Provider>
  );
}
