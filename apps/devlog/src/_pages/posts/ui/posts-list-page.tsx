import Link from 'next/link';

import { getPostSummaries } from '@/entities/post';

/** 게시글 목록 페이지 — 모든 글의 요약을 불러와 제목 목록으로 보여준다. */
export const PostsListPage = async () => {
  const summaries = await getPostSummaries();

  return (
    <main>
      <h1>글 목록</h1>
      <ul>
        {summaries.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
