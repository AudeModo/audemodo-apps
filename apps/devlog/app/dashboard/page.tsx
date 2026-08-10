import type { Metadata } from 'next';

import { Dashboard } from '@/_pages/dashboard';

import { getPostSummaries } from '@/entities/post/server';

export const metadata: Metadata = {
  title: '대시보드',
  description: '블로그를 만들면서 보는 화면. 데이터는 빌드 시점에 굳는다.',
};

/** 대시보드 페이지 */
export default async function Page() {
  const posts = await getPostSummaries();

  return <Dashboard builtAt={new Date()} posts={posts} />;
}
