import { getPostDetail } from '@/entities/post';

/** 게시글 상세 페이지 */
export const PostDetailPage = async ({ slug }: { slug: string }) => {
  const post = await getPostDetail(slug);

  return (
    <main>
      <article>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <time dateTime={post.createdAt}>{post.createdAt}</time>
        <pre>{post.content}</pre>
      </article>
    </main>
  );
};
