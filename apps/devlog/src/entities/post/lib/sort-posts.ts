import type { PostSummary } from '../model/types';

/**
 * 게시글 목록을 최신순(createdAt 내림차순)으로 정렬한 새 배열을 반환한다.
 *
 * createdAt은 날짜 단위(YYYY-MM-DD)라 같은 날 쓴 글끼리 값이 겹칠 수 있다.
 * 이때 순서를 파일 읽기 순서에 맡기면 실행 환경에 따라 목록이 달라지므로,
 * slug 오름차순으로 순서를 고정한다. slug는 파일명이라 중복되지 않는다.
 */
export const sortPosts = (posts: PostSummary[]): PostSummary[] => {
  return [...posts].sort((a, b) => {
    if (a.createdAt !== b.createdAt) {
      return a.createdAt > b.createdAt ? -1 : 1;
    }

    return a.slug < b.slug ? -1 : 1;
  });
};
