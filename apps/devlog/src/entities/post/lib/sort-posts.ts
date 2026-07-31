import type { PostSummary } from '../model/types';

/**
 * 게시글 목록을 최신순(createdAt 내림차순)으로 정렬한 새 배열을 반환한다.
 *
 * 작성 시각이 동일하거나, 잘못된 형식인 경우 slug 오름차순으로 고정한다.
 */
export const sortPosts = (posts: PostSummary[]): PostSummary[] => {
  return [...posts].sort((a, b) => {
    const timeA = Date.parse(a.createdAt);
    const timeB = Date.parse(b.createdAt);
    const isComparable = !Number.isNaN(timeA) && !Number.isNaN(timeB);

    if (isComparable && timeA !== timeB) {
      return timeB - timeA;
    }

    return a.slug < b.slug ? -1 : 1;
  });
};
