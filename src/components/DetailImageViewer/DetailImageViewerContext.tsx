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

  const openViewer = useCallback((payload: DetailImageViewerPayload) => {
    if (!payload.src) return;
    setActive(payload);
  }, []);

  const closeViewer = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
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
      {active ? <DetailImageViewer src={active.src} alt={active.alt} onClose={closeViewer} /> : null}
    </DetailImageViewerContext.Provider>
  );
}
