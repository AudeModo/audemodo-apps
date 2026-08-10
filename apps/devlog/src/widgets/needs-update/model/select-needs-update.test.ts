import { describe, expect, it } from 'vitest';

import type { PostSummary } from '@/entities/post';

import { selectNeedsUpdate } from './select-needs-update';

const TODAY = '2026-08-10T09:00:00+09:00';

const post = (slug: string, extra: Partial<PostSummary> = {}): PostSummary => ({
  slug,
  title: slug,
  summary: '',
  createdAt: '2026-07-01T09:30:00+09:00',
  kind: '회고',
  project: 'devlog',
  track: 'FE',
  stack: [],
  tag: [],
  ...extra,
});

describe('selectNeedsUpdate', () => {
  it('주기를 적어둔 글만 고른다', () => {
    const rows = selectNeedsUpdate(
      [post('a', { needsUpdate: '6mo', lastReviewed: '2026-07-01T09:30:00+09:00' }), post('b')],
      TODAY,
    );

    expect(rows.map((row) => row.post.slug)).toEqual(['a']);
  });

  it('마지막 검토 시각이 없으면 기한을 낼 수 없어 뺀다', () => {
    expect(selectNeedsUpdate([post('a', { needsUpdate: '6mo' })], TODAY)).toEqual([]);
  });

  it('급한 것이 위로 온다', () => {
    const rows = selectNeedsUpdate(
      [
        post('여유', { needsUpdate: '1y', lastReviewed: '2026-07-01T09:30:00+09:00' }),
        post('지남', { needsUpdate: '6mo', lastReviewed: '2025-01-01T09:00:00+09:00' }),
        post('임박', { needsUpdate: '6mo', lastReviewed: '2026-03-01T09:00:00+09:00' }),
      ],
      TODAY,
    );

    expect(rows.map((row) => row.post.slug)).toEqual(['지남', '임박', '여유']);
  });

  it('날짜가 어긋난 글은 세지도 그리지도 않는다', () => {
    // 머리의 「n편」이 이 목록에서 나오므로, 여기서 빠진 글은 개수에서도 빠진다
    expect(
      selectNeedsUpdate([post('a', { needsUpdate: '6mo', lastReviewed: '언젠가' })], TODAY),
    ).toEqual([]);
  });
});
