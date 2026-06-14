import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNextProject, getProjectBySlug, projects } from '@/data/projects';
import { siteConfig } from '@/data/site';
import WorkDetail from '@/sections/WorkDetail/WorkDetail';

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

function getProjectDescription(project: ReturnType<typeof getProjectBySlug>): string {
  if (!project) return '';
  return project.overview.length > 160
    ? `${project.overview.slice(0, 157)}...`
    : project.overview || project.description;
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const description = getProjectDescription(project);
  const ogImage = project.images.hero;

  return {
    title: project.title,
    description,
    keywords: [...project.stack, project.client, project.role],
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      type: 'article',
      title: project.title,
      description,
      url: `/work/${slug}`,
      siteName: siteConfig.name,
      locale: 'ko_KR',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} — ${project.client}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(slug);

  return <WorkDetail project={project} nextProject={nextProject} />;
}
