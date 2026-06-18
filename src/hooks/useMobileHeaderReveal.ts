'use client';

import { useEffect, useRef, useState } from 'react';

const MOBILE_MQ = '(max-width: 767px)';
const SCROLL_DELTA = 8;
const TOP_REVEAL_OFFSET = 12;

interface UseMobileHeaderRevealOptions {
  /** Home Hero 구간에서는 About 진입 전까지 헤더 배경 비활성화 */
  isHomePage?: boolean;
}

function getScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function isPastHomeHero(): boolean {
  const aboutCover = document.querySelector<HTMLElement>('[data-about-cover]');
  if (!aboutCover) return getScrollY() > 0;

  return aboutCover.getBoundingClientRect().top <= 0;
}

function resolveIsScrolled(scrollY: number, isHomePage: boolean): boolean {
  if (isHomePage) {
    return isPastHomeHero();
  }

  return scrollY > 0;
}

export interface MobileHeaderState {
  visible: boolean;
  isScrolled: boolean;
}

export function useMobileHeaderReveal(
  enabled = true,
  { isHomePage = false }: UseMobileHeaderRevealOptions = {},
): MobileHeaderState {
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    lastScrollY.current = getScrollY();

    const update = (scrollY: number) => {
      if (!mq.matches) {
        setVisible(true);
        setIsScrolled(false);
        lastScrollY.current = scrollY;
        return;
      }

      setIsScrolled(resolveIsScrolled(scrollY, isHomePage));

      if (!enabled) {
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
        setIsScrolled(false);
      } else {
        setIsScrolled(resolveIsScrolled(getScrollY(), isHomePage));
      }
      lastScrollY.current = getScrollY();
    };

    update(getScrollY());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    mq.addEventListener('change', onBreakpointChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener('change', onBreakpointChange);
    };
  }, [enabled, isHomePage]);

  return { visible, isScrolled };
}
