'use client';

import { useEffect, useRef, useState } from 'react';

const MOBILE_MQ = '(max-width: 767px)';
const SCROLL_DELTA = 8;
const TOP_REVEAL_OFFSET = 12;

function getScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function useMobileHeaderReveal(enabled = true): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    const mq = window.matchMedia(MOBILE_MQ);
    lastScrollY.current = getScrollY();

    const update = (scrollY: number) => {
      if (!mq.matches) {
        setVisible(true);
        lastScrollY.current = scrollY;
        return;
      }

      const delta = scrollY - lastScrollY.current;

      if (scrollY <= TOP_REVEAL_OFFSET) {
        setVisible(true);
      } else if (delta > SCROLL_DELTA) {
        setVisible(false);
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true);
      }

      lastScrollY.current = scrollY;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        update(getScrollY());
        ticking.current = false;
      });
    };

    const onBreakpointChange = () => {
      if (!mq.matches) {
        setVisible(true);
      }
      lastScrollY.current = getScrollY();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onBreakpointChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onBreakpointChange);
    };
  }, [enabled]);

  return visible;
}
