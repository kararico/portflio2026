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
import { createPortal } from 'react-dom';
import {
  animateOverlayToRect,
  applyOverlayImageRect,
  readDetailImageSourceRect,
  waitForNextFrame,
} from '@/animations/projectSharedTransition';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { resolveImageSrc } from '@/utils/projectImage';
import DetailImageViewer from './DetailImageViewer';
import styles from './DetailImageViewerTransition.module.scss';

export interface DetailImageViewerPayload {
  src: string;
  alt: string;
}

interface DetailImageViewerContextValue {
  openViewer: (payload: DetailImageViewerPayload, sourceEl?: HTMLElement | null) => void;
  closeViewer: () => void;
}

const DetailImageViewerContext = createContext<DetailImageViewerContextValue | null>(null);

export function useDetailImageViewer(): DetailImageViewerContextValue {
  const ctx = useContext(DetailImageViewerContext);
  if (!ctx) {
    throw new Error('useDetailImageViewer must be used within DetailImageViewerProvider');
  }
  return ctx;
}

interface DetailImageViewerProviderProps {
  children: ReactNode;
}

const MORPH_DURATION = 1.08;

export function DetailImageViewerProvider({ children }: DetailImageViewerProviderProps) {
  const [active, setActive] = useState<DetailImageViewerPayload | null>(null);
  const [mounted, setMounted] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const [morphPayload, setMorphPayload] = useState<DetailImageViewerPayload | null>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const viewerFigureRef = useRef<HTMLElement>(null);
  const morphRunningRef = useRef(false);
  const activeRef = useRef<DetailImageViewerPayload | null>(null);
  activeRef.current = active;

  const finishOpen = useCallback((payload: DetailImageViewerPayload) => {
    morphRunningRef.current = false;
    setMorphPayload(null);
    setMorphing(false);
    setActive(payload);
  }, []);

  const openViewer = useCallback(
    (payload: DetailImageViewerPayload, sourceEl?: HTMLElement | null) => {
      if (!payload.src || morphRunningRef.current) return;

      const resolvedSrc = resolveImageSrc(payload.src);
      if (!resolvedSrc) return;

      if (!sourceEl) {
        setActive({ ...payload, src: resolvedSrc });
        return;
      }

      const captured = readDetailImageSourceRect(sourceEl, resolvedSrc);
      if (!captured) {
        setActive({ ...payload, src: resolvedSrc });
        return;
      }

      registerGsapPlugins();
      morphRunningRef.current = true;
      const nextPayload = { ...payload, src: resolvedSrc };
      setMorphPayload(nextPayload);
      setMorphing(true);
      setActive(null);

      requestAnimationFrame(() => {
        const overlay = overlayRef.current;
        if (!overlay) {
          finishOpen({ ...payload, src: resolvedSrc });
          return;
        }

        overlay.src = captured.imageSrc;
        applyOverlayImageRect(overlay, captured.rect, 'center');
      });
    },
    [finishOpen],
  );

  const closeViewer = useCallback(() => {
    morphRunningRef.current = false;
    setMorphPayload(null);
    setMorphing(false);
    setActive(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!morphing || !morphPayload) return;

    const overlay = overlayRef.current;
    const figure = viewerFigureRef.current;
    if (!overlay || !figure) return;

    let cancelled = false;

    const runMorph = async () => {
      if (!overlay.complete || overlay.naturalWidth <= 0) {
        await new Promise<void>((resolve) => {
          const done = () => resolve();
          overlay.addEventListener('load', done, { once: true });
          overlay.addEventListener('error', done, { once: true });
        });
      }

      if (cancelled) return;

      await waitForNextFrame(2);
      await animateOverlayToRect(overlay, figure, MORPH_DURATION);

      if (cancelled) return;

      finishOpen(morphPayload);
    };

    void runMorph();

    return () => {
      cancelled = true;
    };
  }, [finishOpen, morphPayload, morphing]);

  const isViewerOpen = Boolean(active || morphing);

  useEffect(() => {
    if (!isViewerOpen) return;

    const root = document.documentElement;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeRef.current) closeViewer();
    };

    root.setAttribute('data-detail-image-viewer-open', 'true');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      root.removeAttribute('data-detail-image-viewer-open');
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeViewer, isViewerOpen]);

  const value = useMemo(
    () => ({ openViewer, closeViewer }),
    [openViewer, closeViewer],
  );

  return (
    <DetailImageViewerContext.Provider value={value}>
      {children}
      {mounted
        ? createPortal(
            <>
              {morphing ? (
                <div className={styles.morphStage} data-detail-image-viewer-morph aria-hidden="true">
                  <div className={styles.morphBackdrop} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={overlayRef} alt="" className={styles.morphImage} decoding="sync" />
                  <figure ref={viewerFigureRef} className={styles.morphTarget}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={morphPayload?.src ?? ''}
                      alt=""
                      className={styles.morphTargetImage}
                    />
                  </figure>
                </div>
              ) : null}
              {active ? (
                <DetailImageViewer src={active.src} alt={active.alt} onClose={closeViewer} />
              ) : null}
            </>,
            document.body,
          )
        : null}
    </DetailImageViewerContext.Provider>
  );
}
