'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import DetailImageViewer from './DetailImageViewer';

export interface DetailImageViewerPayload {
  src: string;
  alt: string;
}

interface DetailImageViewerContextValue {
  openViewer: (payload: DetailImageViewerPayload) => void;
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

export function DetailImageViewerProvider({ children }: DetailImageViewerProviderProps) {
  const [active, setActive] = useState<DetailImageViewerPayload | null>(null);
  const [mounted, setMounted] = useState(false);

  const openViewer = useCallback((payload: DetailImageViewerPayload) => {
    if (!payload.src) return;
    setActive(payload);
  }, []);

  const closeViewer = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer();
    };

    root.setAttribute('data-detail-image-viewer-open', 'true');
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      root.removeAttribute('data-detail-image-viewer-open');
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [active, closeViewer]);

  const value = useMemo(
    () => ({ openViewer, closeViewer }),
    [openViewer, closeViewer],
  );

  return (
    <DetailImageViewerContext.Provider value={value}>
      {children}
      {mounted && active
        ? createPortal(
            <DetailImageViewer src={active.src} alt={active.alt} onClose={closeViewer} />,
            document.body,
          )
        : null}
    </DetailImageViewerContext.Provider>
  );
}
