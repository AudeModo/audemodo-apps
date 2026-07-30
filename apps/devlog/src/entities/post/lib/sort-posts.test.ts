import { describe, expect, it } from 'vitest';

import type { PostSummary } from '../model/types';

import { sortPosts } from './sort-posts';

const post = (slug: string, createdAt: string): PostSummary => ({
  slug,
  createdAt,
  title: `${slug} 제목`,
  summary: `${slug} 요약`,
});

describe('sortPosts', () => {
  it('최신 글이 앞에 오도록 정렬한다', () => {
    const posts = [post('old', '2026-01-01'), post('new', '2026-03-01'), post('mid', '2026-02-01')];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['new', 'mid', 'old']);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const posts = [post('old', '2026-01-01'), post('new', '2026-03-01')];
    const before = posts.map((p) => p.slug);

    sortPosts(posts);

    expect(posts.map((p) => p.slug)).toEqual(before);
  });

  it('생성일이 같으면 slug 오름차순으로 순서를 고정한다', () => {
    const posts = [post('c', '2026-01-01'), post('a', '2026-01-01'), post('b', '2026-01-01')];

    const sorted = sortPosts(posts);

    expect(sorted.map((p) => p.slug)).toEqual(['a', 'b', 'c']);
  });

  it('빈 배열은 빈 배열을 반환한다', () => {
    expect(sortPosts([])).toEqual([]);
  });

  it('원소가 하나면 그대로 반환한다', () => {
    const sorted = sortPosts([post('only', '2026-01-01')]);

    expect(sorted.map((p) => p.slug)).toEqual(['only']);
  });
});
