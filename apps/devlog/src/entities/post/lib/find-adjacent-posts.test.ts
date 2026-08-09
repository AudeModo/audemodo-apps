import type { PostSummary } from '../model/types';

import { describe, expect, it } from 'vitest';

import { findAdjacentPosts } from './find-adjacent-posts';

const post = (slug: string, extra: Partial<PostSummary> = {}): PostSummary => ({
  slug,
  title: `${slug} 제목`,
  summary: `${slug} 요약`,
  createdAt: '2026-01-01T09:00:00+09:00',
  kind: '회고',
  project: 'devlog',
  track: 'FE',
  stack: ['TypeScript'],
  tag: ['FSD'],
  ...extra,
});

/** 최신순 — 앞이 더 최근이다 */
const POSTS = [post('new'), post('mid'), post('old')];

describe('findAdjacentPosts', () => {
  it('이전은 더 오래된 글, 다음은 더 최근 글이다', () => {
    const { previous, next } = findAdjacentPosts(POSTS, 'mid');

    // 목록은 최신순이라 배열의 뒤가 시간의 이전이다
    expect(previous?.slug).toBe('old');
    expect(next?.slug).toBe('new');
  });

  it('가장 최근 글에는 다음이 없다', () => {
    const { previous, next } = findAdjacentPosts(POSTS, 'new');

    expect(next).toBeNull();
    expect(previous?.slug).toBe('mid');
  });

  it('가장 오래된 글에는 이전이 없다', () => {
    const { previous, next } = findAdjacentPosts(POSTS, 'old');

    expect(previous).toBeNull();
    expect(next?.slug).toBe('mid');
  });

  it('목록에 없는 글이면 모두 null이다', () => {
    expect(findAdjacentPosts(POSTS, '없는글')).toEqual({
      previous: null,
      next: null,
      nextInSeries: null,
    });
  });

  it('연작에 속하면 다음 편을 함께 준다', () => {
    const posts = [
      post('third', { series: '경계', seriesOrder: 3 }),
      post('first', { series: '경계', seriesOrder: 1 }),
      post('second', { series: '경계', seriesOrder: 2 }),
    ];

    expect(findAdjacentPosts(posts, 'first').nextInSeries?.slug).toBe('second');
  });

  it('연작의 다음 편은 시간상 다음 글과 다를 수 있다', () => {
    const posts = [
      post('other'),
      post('first', { series: '경계', seriesOrder: 1 }),
      post('second', { series: '경계', seriesOrder: 2 }),
    ];

    const { next, nextInSeries } = findAdjacentPosts(posts, 'first');

    expect(next?.slug).toBe('other');
    expect(nextInSeries?.slug).toBe('second');
  });

  it('연작의 마지막 편에는 다음 편이 없다', () => {
    const posts = [
      post('second', { series: '경계', seriesOrder: 2 }),
      post('first', { series: '경계', seriesOrder: 1 }),
    ];

    expect(findAdjacentPosts(posts, 'second').nextInSeries).toBeNull();
  });

  it('다른 연작의 같은 순서를 끌어오지 않는다', () => {
    const posts = [
      post('a1', { series: '가', seriesOrder: 1 }),
      post('b2', { series: '나', seriesOrder: 2 }),
    ];

    expect(findAdjacentPosts(posts, 'a1').nextInSeries).toBeNull();
  });

  it('연작에 속하지 않으면 null이다', () => {
    expect(findAdjacentPosts(POSTS, 'mid').nextInSeries).toBeNull();
  });
});
