import { describe, expect, it } from 'vitest';

import { formatPostDate } from './format-post-date';

describe('formatPostDate', () => {
  it('ISO 시각을 한국어 날짜로 바꿈다', () => {
    expect(formatPostDate('2026-07-01T09:30:00+09:00')).toBe('2026년 7월 1일');
  });

  it('오프셋 표기가 달라도 같은 시각이면 같은 날짜로 보여준다', () => {
    expect(formatPostDate('2026-07-01T00:30:00Z')).toBe(
      formatPostDate('2026-07-01T09:30:00+09:00'),
    );
  });

  it('날짜만 있는 값도 처리한다', () => {
    expect(formatPostDate('2026-07-01')).toBe('2026년 7월 1일');
  });
});
