import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import { getAbsoluteSiteUrl } from '@/utils/siteUrl';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const homeEntries: MetadataRoute.Sitemap = [
    getAbsoluteSiteUrl('/'),
    ...siteConfig.seo.homeSections.map((hash) => getAbsoluteSiteUrl(hash)),
  ].map((url, index) => ({
    url,
    lastModified,
    changeFrequency: 'monthly',
    priority: index === 0 ? 1 : 0.8,
  }));

  const workEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: getAbsoluteSiteUrl(`/work/${project.slug}/`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...homeEntries, ...workEntries];
}
