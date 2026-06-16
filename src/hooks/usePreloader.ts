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
    html.style.overflow = previous.htmlOverflow;
    body.style.overflow = previous.bodyOverflow;
    html.style.paddingRight = previous.htmlPaddingRight;
    body.style.paddingRight = previous.bodyPaddingRight;
    if (header) header.style.paddingRight = previous.headerPaddingRight;
  };
}

export function usePreloader({ enabled = true }: UsePreloaderOptions = {}) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const finishExit = useCallback(() => {
    setIsComplete(true);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsComplete(true);
      return undefined;
    }

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
  }, [enabled]);

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
