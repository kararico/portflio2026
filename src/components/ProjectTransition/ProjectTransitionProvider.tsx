'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getProjectBySlug } from '@/data/projects';
import {
  getImageCandidates,
  getProjectDetailHeroPrimarySrc,
  getProjectHeroObjectPosition,
  getProjectThumbnail,
} from '@/utils/projectImage';
import { useLenis } from '@/hooks/useLenis';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import {
  dimHomeTransitionContext,
  fadeInPageTransition,
  fadeOutPageTransition,
  hideSourceThumbnail,
  lockProjectTransition,
  morphOverlayToHero,
  preloadImage,
  readThumbnailRect,
  resetPageTransitionVisibility,
  restoreHomeTransitionContext,
  hideTransitionMain,
  revealTransitionMain,
  unlockProjectTransition,
  waitForNextFrame,
  waitForSharedHeroTarget,
  type SourceRect,
} from '@/animations/projectSharedTransition';
import {
  clearHomeScrollSnapshot,
  getHomeScrollSnapshot,
  markPathnameScrollSkip,
  markPathnameScrollTop,
  saveHomeScrollSnapshot,
} from '@/utils/scrollRestoration';
import { resetScrollToTop } from '@/utils/scrollReset';
import ProjectTransitionOverlay from './ProjectTransitionOverlay';

export type ProjectTransitionPhase =
  | 'idle'
  | 'expanding'
  | 'navigating'
  | 'settling'
  | 'revealing'
  | 'done';

type TransitionDirection = 'forward' | 'back';

interface ProjectTransitionContextValue {
  openProject: (slug: string, sourceEl: HTMLElement) => void;
  closeProject: (slug: string) => void;
  isTransitioning: boolean;
  activeSlug: string | null;
  phase: ProjectTransitionPhase;
}

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

export function useProjectTransition(): ProjectTransitionContextValue {
  const ctx = useContext(ProjectTransitionContext);
  if (!ctx) {
    throw new Error('useProjectTransition must be used within ProjectTransitionProvider');
  }
  return ctx;
}

interface ProjectTransitionProviderProps {
  children: ReactNode;
}

export default function ProjectTransitionProvider({ children }: ProjectTransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const runningRef = useRef(false);
  const startedRef = useRef(false);
  const directionRef = useRef<TransitionDirection>('forward');
  const sourceRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pendingSlugRef = useRef<string | null>(null);

  const [phase, setPhase] = useState<ProjectTransitionPhase>('idle');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [overlayImageSrc, setOverlayImageSrc] = useState<string | null>(null);
  const [overlayRect, setOverlayRect] = useState<SourceRect | null>(null);
  const [overlayObjectPosition, setOverlayObjectPosition] = useState('center');
  const [overlayReady, setOverlayReady] = useState(false);

  const finishTransition = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.style.opacity = '';
      sourceRef.current.style.pointerEvents = '';
      sourceRef.current = null;
    }

    pendingSlugRef.current = null;
    startedRef.current = false;
    directionRef.current = 'forward';
    runningRef.current = false;

    // overlay 제거 → unlock → lenis (순서 고정, 도착 후 깜빡임 방지)
    requestAnimationFrame(() => {
      setOverlayReady(false);
      setPhase('idle');
      setActiveSlug(null);
      setOverlayImageSrc(null);
      setOverlayRect(null);

      requestAnimationFrame(() => {
        unlockProjectTransition();
        resetPageTransitionVisibility();
        lenis?.start();
        refreshScrollTriggerDelayed(120);
      });
    });
  }, [lenis]);

  const handleOverlayReady = useCallback(() => {
    setOverlayReady(true);
  }, []);

  const runForwardTransition = useCallback(
    async (slug: string, sourceEl: HTMLElement) => {
      const imageEl = imageRef.current;
      if (!imageEl) {
        markPathnameScrollTop();
        router.push(`/work/${slug}`, { scroll: false });
        finishTransition();
        return;
      }

      try {
        hideSourceThumbnail(sourceEl);
        dimHomeTransitionContext(sourceEl);

        setPhase('navigating');
        markPathnameScrollSkip();
        hideTransitionMain();
        router.push(`/work/${slug}`, { scroll: false });
        resetScrollToTop(lenis);

        setPhase('settling');
        const target = await waitForSharedHeroTarget(slug);
        resetScrollToTop(lenis);
        await waitForNextFrame(2);

        setPhase('revealing');
        const detailRoot = target.closest<HTMLElement>('article[data-work-detail]');
        await morphOverlayToHero(imageEl, target, detailRoot);

        setPhase('done');
        markPathnameScrollTop();
        await waitForNextFrame(2);
      } catch {
        markPathnameScrollTop();
        hideTransitionMain();
        router.push(`/work/${slug}`, { scroll: false });
        resetScrollToTop(lenis);
      } finally {
        finishTransition();
      }
    },
    [finishTransition, lenis, router],
  );

  const runBackFadeTransition = useCallback(async () => {
    try {
      setPhase('navigating');
      markPathnameScrollTop();
      clearHomeScrollSnapshot();

      await fadeOutPageTransition(0.3);

      router.push('/', { scroll: false });
      resetScrollToTop(lenis);
      await waitForNextFrame(3);
      refreshScrollTrigger();
      restoreHomeTransitionContext();

      setPhase('revealing');
      await fadeInPageTransition(0.6);
      revealTransitionMain();
      setPhase('done');
    } catch {
      markPathnameScrollTop();
      clearHomeScrollSnapshot();
      router.push('/', { scroll: false });
      resetScrollToTop(lenis);
      restoreHomeTransitionContext();
      resetPageTransitionVisibility();
    } finally {
      finishTransition();
    }
  }, [finishTransition, lenis, router]);

  useLayoutEffect(() => {
    if (!overlayReady || phase !== 'expanding' || startedRef.current || !pendingSlugRef.current) {
      return;
    }

    if (directionRef.current === 'back') {
      return;
    }

    const slug = pendingSlugRef.current;
    startedRef.current = true;

    const sourceEl = sourceRef.current;
    if (!sourceEl || !imageRef.current) return;

    void runForwardTransition(slug, sourceEl);
  }, [overlayReady, phase, runForwardTransition]);

  const openProject = useCallback(
    (slug: string, sourceEl: HTMLElement) => {
      if (runningRef.current) return;

      const captured = readThumbnailRect(sourceEl);
      if (!captured) {
        markPathnameScrollTop();
        router.push(`/work/${slug}`, { scroll: false });
        resetScrollToTop(lenis);
        return;
      }

      const project = getProjectBySlug(slug);
      const thumbnailSrc = project ? getProjectThumbnail(project) : null;
      const detailHeroSrc = project ? getProjectDetailHeroPrimarySrc(project) : null;
      setOverlayObjectPosition(project ? getProjectHeroObjectPosition(project) : 'center');

      // rect는 클릭 DOM, src는 slug 기준 thumbnail 데이터 (DOM img와 분리)
      const overlaySrc = thumbnailSrc
        ? getImageCandidates(thumbnailSrc)[0]
        : captured.imageSrc || null;

      saveHomeScrollSnapshot({
        scrollY: lenis?.scroll ?? window.scrollY,
        slug,
      });

      runningRef.current = true;
      directionRef.current = 'forward';
      sourceRef.current = sourceEl;
      pendingSlugRef.current = slug;

      lockProjectTransition();
      lenis?.stop();

      setActiveSlug(slug);
      if (overlaySrc) preloadImage(overlaySrc);
      if (detailHeroSrc && detailHeroSrc !== overlaySrc) preloadImage(detailHeroSrc);
      setOverlayImageSrc(overlaySrc);
      setOverlayRect(captured.rect);
      setOverlayReady(false);
      setPhase('expanding');

      router.prefetch(`/work/${slug}`);
    },
    [lenis, router],
  );

  const closeProject = useCallback(
    (slug: string) => {
      void slug;
      if (runningRef.current) return;

      runningRef.current = true;
      directionRef.current = 'back';
      sourceRef.current = null;
      pendingSlugRef.current = null;
      startedRef.current = true;

      lockProjectTransition();
      lenis?.stop();

      setPhase('navigating');
      void runBackFadeTransition();
    },
    [lenis, runBackFadeTransition],
  );

  useEffect(() => {
    if (pathname.startsWith('/work/') && !runningRef.current) {
      const isDirectEntry = !getHomeScrollSnapshot();
      if (isDirectEntry) {
        resetScrollToTop(lenis);
      }
    }
  }, [lenis, pathname]);

  const value = useMemo(
    () => ({
      openProject,
      closeProject,
      isTransitioning: phase !== 'idle' && phase !== 'done',
      activeSlug,
      phase,
    }),
    [openProject, closeProject, phase, activeSlug],
  );

  const showOverlay = Boolean(overlayImageSrc && overlayRect && phase !== 'idle');

  return (
    <ProjectTransitionContext.Provider value={value}>
      {children}
      {showOverlay && overlayImageSrc && overlayRect ? (
        <ProjectTransitionOverlay
          imageRef={imageRef}
          imageSrc={overlayImageSrc}
          rect={overlayRect}
          objectPosition={overlayObjectPosition}
          onReady={handleOverlayReady}
        />
      ) : null}
    </ProjectTransitionContext.Provider>
  );
}
