export interface HomeScrollSnapshot {
  scrollY: number;
  slug: string;
}

let snapshot: HomeScrollSnapshot | null = null;
let pathnameScrollMode: 'default' | 'skip' | 'restore' | 'top' = 'default';
let restoreScrollY = 0;

export function saveHomeScrollSnapshot(data: HomeScrollSnapshot): void {
  snapshot = data;
}

export function getHomeScrollSnapshot(): HomeScrollSnapshot | null {
  return snapshot;
}

export function clearHomeScrollSnapshot(): void {
  snapshot = null;
}

/** Detail 진입 직후 pathname effect가 scroll을 건드리지 않도록 */
export function markPathnameScrollSkip(): void {
  pathnameScrollMode = 'skip';
}

/** Transition 완료 후 Hero top 강제 */
export function markPathnameScrollTop(): void {
  pathnameScrollMode = 'top';
}

/** Back navigation 시 gallery scroll 복원 */
export function markPathnameScrollRestore(y: number): void {
  pathnameScrollMode = 'restore';
  restoreScrollY = y;
}

export function consumePathnameScrollIntent(): {
  action: 'default' | 'skip' | 'restore' | 'top';
  scrollY: number;
} {
  const action = pathnameScrollMode;
  const scrollY = restoreScrollY;
  pathnameScrollMode = 'default';
  restoreScrollY = 0;
  return { action, scrollY };
}
