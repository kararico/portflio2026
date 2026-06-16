'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import styles from './PreloaderLogo.module.scss';

const STROKE_DRAW_TOTAL = 1500;
const VIEWBOX_WIDTH = 320;
const LETTER_KERN = 10;

export default function PreloaderLogo() {
  const groupRef = useRef<SVGGElement>(null);
  const jRef = useRef<SVGTextElement>(null);
  const wRef = useRef<SVGTextElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useLayoutEffect(() => {
    const groupEl = groupRef.current;
    const jEl = jRef.current;
    const wEl = wRef.current;
    if (!groupEl || !jEl || !wEl) return;

    jEl.setAttribute('x', '0');
    const jWidth = jEl.getComputedTextLength();
    wEl.setAttribute('x', String(jWidth - LETTER_KERN));

    const jBox = jEl.getBBox();
    const wBox = wEl.getBBox();
    const left = Math.min(jBox.x, wBox.x);
    const right = Math.max(jBox.x + jBox.width, wBox.x + wBox.width);
    const centerX = left + (right - left) / 2;
    groupEl.setAttribute('transform', `translate(${VIEWBOX_WIDTH / 2 - centerX}, 0)`);

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
      <g ref={groupRef}>
        <text ref={jRef} x="0" y="116" className={`${styles.letter} ${styles.letterJ}`}>
          j
        </text>
        <text ref={wRef} x="0" y="116" className={`${styles.letter} ${styles.letterW}`}>
          w
        </text>
      </g>
    </svg>
  );
}
