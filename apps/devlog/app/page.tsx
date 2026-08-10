import { Home } from '@/_pages/home';

import { getPostSummaries } from '@/entities/post/server';
import { getProjectSummaries } from '@/entities/project/server';

/** 홈 */
export default async function Page() {
  const [posts, projects] = await Promise.all([getPostSummaries(), getProjectSummaries()]);

  return <Home posts={posts} projects={projects} />;
}
