/** GitHub Pages project site base path (e.g. /portflio2026). Empty for local/Vercel root deploy. */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** Prefix public asset paths for subdirectory hosting. */
export function assetPath(src: string): string {
  if (!src || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  if (!BASE_PATH) return src;

  const normalized = src.startsWith('/') ? src : `/${src}`;
  if (normalized.startsWith(`${BASE_PATH}/`)) return normalized;

  return `${BASE_PATH}${normalized}`;
}

export function getBasePath(): string {
  return BASE_PATH;
}
