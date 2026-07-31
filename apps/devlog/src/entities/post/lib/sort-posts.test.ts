import type { PostSummary } from '../model/types';

import { describe, expect, it } from 'vitest';

import { sortPosts } from './sort-posts';

const post = (slug: string, createdAt: string): PostSummary => ({
  slug,
  createdAt,
  title: `${slug} 제목`,
  summary: `${slug} 요약`,
});

describe('sortPosts', () => {
  it('최신 글이 앞에 오도록 정렬한다', () => {
    const posts = [
      post('old', '2026-01-01T09:00:00+09:00'),
      post('new', '2026-03-01T09:00:00+09:00'),
      post('mid', '2026-02-01T09:00:00+09:00'),
    ];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
  });

  it('같은 날이라도 시각이 다르면 늦은 쪽이 앞에 온다', () => {
    const posts = [
      post('morning', '2026-01-01T09:00:00+09:00'),
      post('evening', '2026-01-01T21:00:00+09:00'),
    ];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['evening', 'morning']);
  });

  it('오프셋 표기가 달라도 실제 시각 순서로 정렬한다', () => {
    // utc는 19:00 KST, kst는 06:00 UTC — 문자열로 비교하면 순서가 뒤집힐다.
    const posts = [post('utc', '2026-07-01T10:00:00Z'), post('kst', '2026-07-01T15:00:00+09:00')];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['utc', 'kst']);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const posts = [
      post('old', '2026-01-01T09:00:00+09:00'),
      post('new', '2026-03-01T09:00:00+09:00'),
    ];
    const before = posts.map((p) => p.slug);

    sortPosts(posts);

    expect(posts.map((p) => p.slug)).toEqual(before);
  });

  it('시각이 같으면 slug 오름차순으로 순서를 고정한다', () => {
    const at = '2026-01-01T09:00:00+09:00';
    const posts = [post('c', at), post('a', at), post('b', at)];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['a', 'b', 'c']);
  });

  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(sortPosts([])).toEqual([]);
  });

  it('원소가 하나면 그대로 반환한다', () => {
    const sorted = sortPosts([post('only', '2026-01-01T09:00:00+09:00')]);

    expect(sorted.map((p) => p.slug)).toEqual(['only']);
  });
});
