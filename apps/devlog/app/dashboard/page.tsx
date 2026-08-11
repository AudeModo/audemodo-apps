import type { Metadata } from 'next';

import { Dashboard } from '@/_pages/dashboard';

import { getIdeas, getLinks, getNow, getReading, getTodos } from '@/entities/dashboard/server';
import { getGithubSnapshot } from '@/entities/github/server';
import { getDraftSummaries, getPostSummaries } from '@/entities/post/server';
import { getProjectSummaries } from '@/entities/project/server';

export const metadata: Metadata = {
  title: '대시보드',
  description: '블로그를 만들면서 보는 화면. 데이터는 빌드 시점에 굳는다.',
};

/** 대시보드 페이지 */
export default async function Page() {
  const builtAt = new Date();

  const [posts, drafts, projects, now, todos, reading, ideas, links, github] = await Promise.all([
    getPostSummaries(),
    getDraftSummaries(),
    getProjectSummaries(),
    getNow(),
    getTodos(),
    getReading(),
    getIdeas(),
    getLinks(),
    getGithubSnapshot(builtAt),
  ]);

  return (
    <Dashboard
      builtAt={builtAt}
      github={github}
      drafts={drafts}
      ideas={ideas}
      links={links}
      now={now}
      posts={posts}
      projects={projects}
      reading={reading}
      todos={todos}
    />
  );
}
