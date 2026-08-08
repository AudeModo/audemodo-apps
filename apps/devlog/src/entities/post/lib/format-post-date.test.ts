import { describe, expect, it } from 'vitest';

import { formatPostDate } from './format-post-date';

describe('formatPostDate', () => {
  it('ISO 시각을 고정 형식 날짜로 바꾼다', () => {
    expect(formatPostDate('2026-07-01T09:30:00+09:00')).toBe('2026.07.01');
  });

  it('한 자리 월·일도 두 자리로 채운다', () => {
    // 자릿수가 흔들리면 목록에서 날짜 열이 들쭉날쭉해진다
    expect(formatPostDate('2026-01-05T09:30:00+09:00')).toBe('2026.01.05');
  });

  it('오프셋 표기가 달라도 같은 시각이면 같은 날짜로 보여준다', () => {
    expect(formatPostDate('2026-07-01T00:30:00Z')).toBe(
      formatPostDate('2026-07-01T09:30:00+09:00'),
    );
  });

  it('표시 시간대는 Asia/Seoul로 고정한다', () => {
    // UTC로는 6월 30일이지만 서울에서는 7월 1일이다.
    // 빌드 환경의 시간대에 따라 정적 페이지에 박히는 날짜가 달라지면 안 된다.
    expect(formatPostDate('2026-06-30T20:00:00Z')).toBe('2026.07.01');
  });

  it('날짜만 있는 값도 처리한다', () => {
    expect(formatPostDate('2026-07-01')).toBe('2026.07.01');
  });
});
