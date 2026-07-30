import type { PostSummary } from '../model/types';

/** 게시글 배열을 생성일자(createdAt) 기준으로 정렬한다. */
export const sortPosts = (posts: PostSummary[], order: 'asc' | 'desc' = 'desc') => {
  posts.sort((a, b) => {
    if (order === 'asc') {
      // 과거순 (오름차순): a가 앞선 날짜일 때 앞으로
      return a.createdAt.localeCompare(b.createdAt);
    }

    // 최신순 (내림차순): b가 더 최근 날짜일 때 앞으로
    return b.createdAt.localeCompare(a.createdAt);
  });
};
