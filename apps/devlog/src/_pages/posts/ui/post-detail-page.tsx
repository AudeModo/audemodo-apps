import { getPostDetail } from '@/entities/post';

/** 게시글 상세 페이지 — slug로 글 하나를 불러와 메타데이터를 보여준다.
 * 본문(MDX) 렌더링은 다음 단계에서 붙인다. */
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
