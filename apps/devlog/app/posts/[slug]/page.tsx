import { PostDetailPage } from '@/_pages/posts';

import { readPostSlugs } from '@/entities/post/lib/read-post';

/**
 * 빌드 시점에 모든 게시글 slug를 미리 생성한다.
 *
 * 동적 라우트(`[slug]`)는 기본적으로 요청 시점에 렌더링(SSR)되는데,
 * 존재하는 모든 slug를 여기서 반환하면 각 경로가 빌드 시점에 정적 페이지(SSG)로 생성된다.
 */
export async function generateStaticParams() {
  return await readPostSlugs();
}

/** 게시글 상세 페이지 */
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <PostDetailPage slug={slug} />;
}
