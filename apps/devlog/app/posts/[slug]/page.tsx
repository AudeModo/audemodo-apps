import { PostDetailPage } from '@/_pages/posts';

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return <PostDetailPage slug={slug} />;
}
