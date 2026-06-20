import type { MetadataRoute } from 'next';
import { siteConfig } from '@/data/site';
import { assetPath } from '@/utils/assetPath';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  const icon = (file: string) => assetPath(`/favicon/${file}`);

  return {
    name: siteConfig.seo.homeTitle,
    short_name: siteConfig.name,
    icons: [
      { src: icon('android-icon-36x36.png'), sizes: '36x36', type: 'image/png' },
      { src: icon('android-icon-48x48.png'), sizes: '48x48', type: 'image/png' },
      { src: icon('android-icon-72x72.png'), sizes: '72x72', type: 'image/png' },
      { src: icon('android-icon-96x96.png'), sizes: '96x96', type: 'image/png' },
      { src: icon('android-icon-144x144.png'), sizes: '144x144', type: 'image/png' },
      { src: icon('android-icon-192x192.png'), sizes: '192x192', type: 'image/png' },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  };
}
