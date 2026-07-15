import { PostDetailPage } from '@/_pages/posts';

/** 게시글 상세 페이지 */
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <PostDetailPage slug={slug} />;
}
