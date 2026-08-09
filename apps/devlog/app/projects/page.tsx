import type { Metadata } from 'next';

import { ProjectsList } from '@/_pages/projects-list';

import { getPostSummaries } from '@/entities/post/server';
import { getProjectSummaries } from '@/entities/project/server';

export const metadata: Metadata = {
  title: '프로젝트',
  description: '만든 것들. 카드는 중요도 순, 타임라인은 시작 순으로 같은 목록을 다시 본다.',
};

/** 빌드 시점의 달. 진행 중인 막대의 오른쪽 끝이 여기까지 뻗는다 */
const currentMonth = (): string => {
  const now = new Date();

  return `${String(now.getFullYear())}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/** 프로젝트 목록 페이지 */
export default async function Page() {
  const [projects, posts] = await Promise.all([getProjectSummaries(), getPostSummaries()]);

  return <ProjectsList currentMonth={currentMonth()} posts={posts} projects={projects} />;
}
