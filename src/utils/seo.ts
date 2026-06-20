import type { Metadata } from 'next';
import { siteConfig } from '@/data/site';
import { assetPath } from '@/utils/assetPath';
import { getAbsoluteSiteUrl } from '@/utils/siteUrl';

export function getDefaultOgImage() {
  const { ogImagePath, ogImageAlt, ogImageWidth, ogImageHeight } = siteConfig.seo;

  // metadataBase already includes the site origin; avoid assetPath to prevent basePath doubling.
  return {
    url: ogImagePath,
    width: ogImageWidth,
    height: ogImageHeight,
    alt: ogImageAlt,
  };
}

export function buildHomeMetadata(): Metadata {
  const { homeTitle, homeDescription } = siteConfig.seo;
  const ogImage = getDefaultOgImage();
  const canonicalUrl = getAbsoluteSiteUrl('/');

  return {
    title: {
      absolute: homeTitle,
    },
    description: homeDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: siteConfig.name,
      title: homeTitle,
      description: homeDescription,
      url: canonicalUrl,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: homeTitle,
      description: homeDescription,
      images: [ogImage.url],
    },
  };
}

function getFaviconIcons(): Metadata['icons'] {
  const favicon = (file: string) => assetPath(`/favicon/${file}`);

  return {
    icon: [
      { url: favicon('favicon.ico'), sizes: 'any' },
      { url: favicon('favicon-16x16.png'), sizes: '16x16', type: 'image/png' },
      { url: favicon('favicon-32x32.png'), sizes: '32x32', type: 'image/png' },
      { url: favicon('favicon-96x96.png'), sizes: '96x96', type: 'image/png' },
    ],
    shortcut: favicon('favicon.ico'),
    apple: [
      { url: favicon('apple-icon-180x180.png'), sizes: '180x180', type: 'image/png' },
      { url: favicon('apple-icon-152x152.png'), sizes: '152x152', type: 'image/png' },
      { url: favicon('apple-icon-144x144.png'), sizes: '144x144', type: 'image/png' },
      { url: favicon('apple-icon-120x120.png'), sizes: '120x120', type: 'image/png' },
      { url: favicon('apple-icon-114x114.png'), sizes: '114x114', type: 'image/png' },
      { url: favicon('apple-icon-76x76.png'), sizes: '76x76', type: 'image/png' },
      { url: favicon('apple-icon-72x72.png'), sizes: '72x72', type: 'image/png' },
      { url: favicon('apple-icon-60x60.png'), sizes: '60x60', type: 'image/png' },
      { url: favicon('apple-icon-57x57.png'), sizes: '57x57', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: favicon('apple-icon-precomposed.png'),
      },
      {
        rel: 'msapplication-config',
        url: favicon('browserconfig.xml'),
      },
    ],
  };
}

export function buildRootMetadataDefaults(): Pick<
  Metadata,
  'metadataBase' | 'title' | 'description' | 'icons' | 'openGraph' | 'twitter'
> {
  const { homeDescription } = siteConfig.seo;
  const ogImage = getDefaultOgImage();

  return {
    metadataBase: new URL(getAbsoluteSiteUrl('/')),
    title: {
      default: siteConfig.seo.homeTitle,
      template: '%s | Jungwon Heo',
    },
    description: homeDescription,
    icons: getFaviconIcons(),
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: siteConfig.name,
      title: siteConfig.seo.homeTitle,
      description: homeDescription,
      url: getAbsoluteSiteUrl('/'),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.seo.homeTitle,
      description: homeDescription,
      images: [ogImage.url],
    },
  };
}
