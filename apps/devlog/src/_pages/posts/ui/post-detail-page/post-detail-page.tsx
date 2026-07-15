import { getPostDetail } from '@/entities/post';

import { MdxContent } from '@/shared/ui';

/** 게시글 상세 페이지 — slug로 글 하나를 불러와 메타와 본문(MDX)을 렌더한다. */
export const PostDetailPage = async ({ slug }: { slug: string }) => {
  const post = await getPostDetail(slug);

  return (
    <main>
      <article>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <time dateTime={post.createdAt}>{post.createdAt}</time>
        <MdxContent source={post.content} />
      </article>
    </main>
  );
};
