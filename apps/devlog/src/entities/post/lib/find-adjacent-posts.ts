import type { PostSummary } from '../model/types';

export interface AdjacentPosts {
  /** 한 편 이전(더 오래된) 글 */
  previous: PostSummary | null;
  /** 한 편 다음(더 최근) 글 */
  next: PostSummary | null;
  /** 같은 연작의 바로 다음 편. 연작에 속하지 않으면 null */
  nextInSeries: PostSummary | null;
}

/**
 * 글 하나의 이웃.
 *
 * 목록은 최신순이므로 배열에서 뒤가 더 오래된 글이다. 「이전 글」은 시간의 이전이지
 * 배열의 이전이 아니다 — 둘을 헷갈리면 화살표가 반대로 붙는다.
 *
 * 연작은 날짜와 별개다. 연작 안의 다음 편이 시간상 다음 글이 아닐 수 있고,
 * 그때 독자가 원하는 것은 대개 연작 쪽이라 따로 돌려준다.
 */
export const findAdjacentPosts = (posts: PostSummary[], slug: string): AdjacentPosts => {
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null, nextInSeries: null };
  }

  const current = posts[index];
  const series = current?.series;
  const order = current?.seriesOrder;

  const nextInSeries =
    series === undefined || order === undefined
      ? null
      : (posts.find((post) => post.series === series && post.seriesOrder === order + 1) ?? null);

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
    nextInSeries,
  };
};
