/** Canonical site origin without trailing slash (e.g. https://kararico.github.io/portflio2026). */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3030').replace(/\/$/, '');
}

/** Build absolute URL from a site path (supports hash fragments). */
export function getAbsoluteSiteUrl(path = '/'): string {
  const base = getSiteUrl();

  if (!path || path === '/') {
    return `${base}/`;
  }

  if (path.startsWith('#')) {
    return `${base}/${path}`;
  }

  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
