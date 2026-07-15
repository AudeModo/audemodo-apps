import { PostDetailPage } from '@/_pages/posts';

import { getPostSlugs } from '@/entities/post';

/**
 * 빌드 시점에 모든 게시글 slug를 미리 생성한다.
 *
 * 동적 라우트(`[slug]`)는 기본적으로 요청 시점에 렌더링(SSR)되는데,
 * 존재하는 모든 slug를 반환하면 각 경로가 빌드 시점에 정적 페이지(SSG)로 생성된다.
 * Next는 각 원소에서 slug 키를 찾으므로 { slug } 객체 배열로 반환한다.
 */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

/** 게시글 상세 페이지 */
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <PostDetailPage slug={slug} />;
}
