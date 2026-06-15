'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import styles from './PreloaderLogo.module.scss';

const STROKE_DRAW_TOTAL = 1500;

export default function PreloaderLogo() {
  const jRef = useRef<SVGTextElement>(null);
  const wRef = useRef<SVGTextElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useLayoutEffect(() => {
    const jEl = jRef.current;
    const wEl = wRef.current;
    if (!jEl || !wEl) return;

    const jWidth = jEl.getComputedTextLength();
    wEl.setAttribute('x', String(68 + jWidth - 10));

    const jLen = jEl.getComputedTextLength() * 2.85;
    const wLen = wEl.getComputedTextLength() * 2.85;

    jEl.style.setProperty('--stroke-length', String(jLen));
    wEl.style.setProperty('--stroke-length', String(wLen));
    setIsReady(true);

    const fillTimer = window.setTimeout(() => setIsFilled(true), STROKE_DRAW_TOTAL);
    return () => window.clearTimeout(fillTimer);
  }, []);

  return (
    <svg
      className={`${styles.logoSvg} ${isReady ? styles.ready : ''} ${isFilled ? styles.filled : ''}`}
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <text ref={jRef} x="68" y="116" className={`${styles.letter} ${styles.letterJ}`}>
        j
      </text>
      <text ref={wRef} x="118" y="116" className={`${styles.letter} ${styles.letterW}`}>
        w
      </text>
    </svg>
  );
}
