import type { NextConfig } from 'next';
import path from 'path';

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repoBasePath = '/portflio2026';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  ...(isGithubPages
    ? {
        output: 'export',
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
        trailingSlash: true,
      }
    : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    /** static export(GitHub Pages) 및 로컬 placeholder SVG */
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: isGithubPages || process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
