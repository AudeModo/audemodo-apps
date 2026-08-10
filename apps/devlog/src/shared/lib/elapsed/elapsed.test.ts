import { describe, expect, it } from 'vitest';

import { monthsSince } from './elapsed';

describe('monthsSince', () => {
  it('시작한 달이 1개월째다', () => {
    // 0개월째라고 적으면 아직 시작하지 않은 것으로 읽힌다
    expect(monthsSince('2026-07', '2026-07')).toBe(1);
  });

  it('다음 달이면 2개월째다', () => {
    expect(monthsSince('2026-07', '2026-08')).toBe(2);
  });

  it('해를 넘겨도 이어서 센다', () => {
    expect(monthsSince('2025-11', '2026-02')).toBe(4);
  });

  it('앞으로 시작할 것도 1개월째로 둔다', () => {
    // 음수 개월은 화면에 적을 말이 없다
    expect(monthsSince('2026-09', '2026-08')).toBe(1);
  });

  it('형식이 어긋나면 1개월째로 둔다', () => {
    expect(monthsSince('언젠가', '2026-08')).toBe(1);
  });
});
