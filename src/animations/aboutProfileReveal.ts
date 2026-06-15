export const ABOUT_PROFILE_REVEAL_EVENT = 'about-profile-reveal';

export function isAboutInHomeStory(root: HTMLElement): boolean {
  return Boolean(root.closest('[data-home-story]'));
}

/** Profile reveal 완료 — 이미지 hover / distortion 등 후속 인터랙션 활성화 */
export function dispatchAboutProfileReveal(): void {
  window.dispatchEvent(new CustomEvent(ABOUT_PROFILE_REVEAL_EVENT));
}
