/** Cursor 상태 — data-cursor-style 속성 및 CursorProvider 연동 */
export const CURSOR_STATES = {
  DEFAULT: 'default',
  VIEW: 'view',
  DRAG: 'drag',
  MENU: 'menu',
} as const;

export type CursorState = (typeof CURSOR_STATES)[keyof typeof CURSOR_STATES];

export type CursorLabelState = Extract<CursorState, 'view' | 'drag' | 'menu'>;

export const CURSOR_LABELS: Record<CursorLabelState, string> = {
  view: 'VIEW',
  drag: 'DRAG',
  menu: 'MENU',
};

export const WORKS_CURSOR_MAP = {
  section: CURSOR_STATES.DEFAULT,
  visualHover: CURSOR_STATES.VIEW,
  indexStrip: CURSOR_STATES.DRAG,
  metaToggle: CURSOR_STATES.DEFAULT,
} as const;

/** legacy `small` 등은 default로 정규화 */
export function normalizeCursorState(value: string | null | undefined): CursorState {
  if (!value || value === 'small' || value === 'off') return CURSOR_STATES.DEFAULT;
  if (value === CURSOR_STATES.VIEW) return CURSOR_STATES.VIEW;
  if (value === CURSOR_STATES.DRAG) return CURSOR_STATES.DRAG;
  if (value === CURSOR_STATES.MENU) return CURSOR_STATES.MENU;
  return CURSOR_STATES.DEFAULT;
}

export function isExpandedCursorState(state: CursorState): state is CursorLabelState {
  return state === CURSOR_STATES.VIEW || state === CURSOR_STATES.DRAG || state === CURSOR_STATES.MENU;
}
