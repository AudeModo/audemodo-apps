import { Home } from '@/_pages/home';

import { getGithubSnapshot } from '@/entities/github/server';
import { getPostSummaries } from '@/entities/post/server';
import { getProjectSummaries } from '@/entities/project/server';

/** 홈 */
export default async function Page() {
  const [posts, projects, github] = await Promise.all([
    getPostSummaries(),
    getProjectSummaries(),
    getGithubSnapshot(new Date()),
  ]);

  return <Home github={github} posts={posts} projects={projects} />;
}
