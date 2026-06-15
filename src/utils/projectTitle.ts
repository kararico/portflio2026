const HANGUL_REGEX = /[\u3131-\u318E\uAC00-\uD7AF]/;

/** title 내 `\n`으로 의도한 Editorial 줄 나눔 */
export function splitTitleLines(text: string): string[] {
  if (!text.includes('\n')) return [text];
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** 한글 텍스트 여부 — subtitle 등 keep-all 스타일 적용용 */
export function hasKoreanText(text: string): boolean {
  return HANGUL_REGEX.test(text);
}
