'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const LOAD_DURATION = 2000;
const FADE_OUT = 500;
const TOTAL_DURATION = LOAD_DURATION + FADE_OUT;

const PROGRESS_MILESTONES: ReadonlyArray<{ time: number; value: number }> = [
  { time: 0, value: 0 },
  { time: 400, value: 15 },
  { time: 900, value: 38 },
  { time: 1500, value: 72 },
  { time: LOAD_DURATION, value: 100 },
];

interface UsePreloaderOptions {
  enabled?: boolean;
}

/** Detail → Home 등 세션 내 재방문 시 Preloader·scroll lock 재실행 방지 */
let homePreloaderSessionComplete = false;

function resolveProgress(elapsed: number): number {
  if (elapsed <= 0) return 0;
  if (elapsed >= LOAD_DURATION) return 100;

  for (let index = 0; index < PROGRESS_MILESTONES.length - 1; index += 1) {
    const current = PROGRESS_MILESTONES[index];
    const next = PROGRESS_MILESTONES[index + 1];

    if (elapsed >= current.time && elapsed <= next.time) {
      const segment = (elapsed - current.time) / (next.time - current.time);
      return Math.round(current.value + (next.value - current.value) * segment);
    }
  }

  return 100;
}

function lockPageScroll(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const header = document.getElementById('header');

  const scrollbarWidth = window.innerWidth - html.clientWidth;
  const compensation = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';

  const previous = {
    htmlOverflow: html.style.overflow,
    bodyOverflow: body.style.overflow,
    htmlPaddingRight: html.style.paddingRight,
    bodyPaddingRight: body.style.paddingRight,
    headerPaddingRight: header?.style.paddingRight ?? '',
  };

  html.style.overflow = 'hidden';
  body.style.overflow = 'hidden';

  if (compensation) {
    html.style.paddingRight = compensation;
    body.style.paddingRight = compensation;
    if (header) header.style.paddingRight = compensation;
  }

  return () => {
    html.style.paddingRight = previous.htmlPaddingRight;
    body.style.paddingRight = previous.bodyPaddingRight;
    if (header) header.style.paddingRight = previous.headerPaddingRight;

    const externalScrollLock =
      html.hasAttribute('data-mobile-menu-open') ||
      html.hasAttribute('data-orientation-overlay-active') ||
      html.hasAttribute('data-project-transition');

    if (externalScrollLock) {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      return;
    }

    // transition lock 등 외부 hidden snapshot 오염 시에도 scroll 해제
    html.style.overflow = '';
    body.style.overflow = '';
  };
}

export function usePreloader({ enabled = true }: UsePreloaderOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  /** bfcache 복원 시 타이머 재시작용 */
  const [sessionId, setSessionId] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const finishExit = useCallback(() => {
    homePreloaderSessionComplete = true;
    setIsComplete(true);
  }, []);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || !enabled) return;
      homePreloaderSessionComplete = false;
      setSessionId((id) => id + 1);
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setIsComplete(true);
      return undefined;
    }

    if (homePreloaderSessionComplete) {
      setIsComplete(true);
      setIsExiting(false);
      setProgress(100);
      return undefined;
    }

    setIsComplete(false);
    setIsExiting(false);
    setProgress(0);
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;

      setProgress(resolveProgress(elapsed));

      if (elapsed >= LOAD_DURATION) {
        setProgress(100);
        setIsExiting(true);
      }

      if (elapsed < TOTAL_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, sessionId]);

  useEffect(() => {
    if (!isExiting) return undefined;

    const fallback = window.setTimeout(finishExit, FADE_OUT + 120);
    return () => window.clearTimeout(fallback);
  }, [isExiting, finishExit]);

  useEffect(() => {
    if (!enabled || isComplete) return undefined;
    return lockPageScroll();
  }, [enabled, isComplete]);

  return {
    progress,
    isExiting,
    isComplete,
    isVisible: enabled && !isComplete,
    finishExit,
  };
}

export function formatPreloaderProgress(value: number): string {
  if (value >= 100) return '100%';
  return `${String(value).padStart(2, '0')}%`;
}
