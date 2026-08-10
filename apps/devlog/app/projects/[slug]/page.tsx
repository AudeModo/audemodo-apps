import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ProjectDetail } from '@/_pages/project-detail';

import { getPostSummaries } from '@/entities/post/server';
import { getProject, getProjectSlugs } from '@/entities/project/server';

export const dynamicParams = false;

/** 빌드 시점의 달. 개월째를 세는 기준이다 */
const currentMonth = (): string => {
  const now = new Date();

  return `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (project === null) {
    return {};
  }

  return { title: project.name, description: project.summary ?? project.description };
}

/** 프로젝트 상세 페이지 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, posts] = await Promise.all([getProject(slug), getPostSummaries()]);

  if (project === null) {
    notFound();
  }

  return (
    <ProjectDetail
      currentMonth={currentMonth()}
      posts={posts.filter((post) => post.project === project.name)}
      project={project}
    />
  );
}
