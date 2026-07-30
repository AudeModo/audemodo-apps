import type { PostSummary } from '../model/types';

/**
 * 게시글 배열을 생성일자(createdAt) 기준으로 최신순으로 정렬한다.
 *
 * 모든 게시글의 생성 시간이 다른 것을 전제로 동률처리는 생략한다.
 */
export const sortPosts = (posts: PostSummary[]) => {
  return [...posts].sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });
};
