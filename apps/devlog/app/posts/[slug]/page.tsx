import type { Metadata } from 'next';

import { PostDetail } from '@/_pages/post-detail';

import { getPostDetail, getPostSlugs, getPostSummaries } from '@/entities/post/server';

export const dynamicParams = false;

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

/**
 * 글마다 제목과 요약을 메타데이터로 노출한다.
 *
 * 없으면 모든 글이 루트 레이아웃의 타이틀을 공유해, 공유 링크와 검색 결과에서
 * 서로 구분되지 않는다. 제목은 루트에 정의한 template을 통해 사이트명과 합쳐진다.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostDetail(slug);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
    },
  };
}

/**
 * 게시글 상세 페이지.
 *
 * 목록 페이지와 같은 규칙이다 — 파일을 읽는 일은 라우트가, 조립은 화면 슬라이스가 맡는다.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostDetail(slug), getPostSummaries()]);

  return <PostDetail post={post} posts={posts} />;
}
