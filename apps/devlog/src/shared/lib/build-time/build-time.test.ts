import { describe, expect, it } from 'vitest';

import { formatBuildTime } from './build-time';

describe('formatBuildTime', () => {
  it('날짜와 시각을 고정 형식으로 적는다', () => {
    // 2026-08-09 19:12 UTC는 서울에서 2026-08-10 04:12다
    expect(formatBuildTime(new Date('2026-08-09T19:12:00Z'))).toBe('2026.08.10 04:12');
  });

  it('표시 시간대는 Asia/Seoul로 고정한다', () => {
    // 빌드가 UTC에서 돌아도 화면에 박히는 시각이 달라지면 안 된다
    expect(formatBuildTime(new Date('2026-01-01T00:00:00Z'))).toBe('2026.01.01 09:00');
  });

  it('한 자리 값도 두 자리로 채운다', () => {
    expect(formatBuildTime(new Date('2026-03-05T00:05:00Z'))).toBe('2026.03.05 09:05');
  });

  it('자정을 24시로 적지 않는다', () => {
    // 날짜는 이미 넘어갔는데 24:00이라고 적으면 앞뒤가 어긋난다
    expect(formatBuildTime(new Date('2026-08-09T15:00:00Z'))).toBe('2026.08.10 00:00');
  });
});
