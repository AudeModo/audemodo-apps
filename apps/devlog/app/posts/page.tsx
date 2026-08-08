import type { Metadata } from 'next';

import { PostsList } from '@/_pages/posts-list';

import { getPostSummaries } from '@/entities/post/server';

export const metadata: Metadata = {
  title: '글',
  description: '막힌 자리와 풀어낸 방법을 남긴다. 회고 · 트러블슈팅 · 학습 세 갈래.',
};

/**
 * 게시글 목록 페이지.
 *
 * 파일을 읽는 일은 라우트가 맡는다. 화면 슬라이스는 조립만 하고, 데이터는 prop으로
 * 내려간다 — 그래야 화면 쪽 배럴에 서버 전용 모듈이 섞이지 않는다.
 */
export default async function Page() {
  const posts = await getPostSummaries();

  return <PostsList posts={posts} />;
}
