import { describe, expect, it } from 'vitest';

import { splitPeriod } from './split-period';

describe('splitPeriod', () => {
  it('한 시점은 쪼개지 않는다', () => {
    expect(splitPeriod('2026.07')).toEqual(['2026.07']);
  });

  it('기간은 두 줄로 쪼개고 이음표를 뒤쪽에 붙인다', () => {
    // 이음표가 뒤에 붙어야 두 줄이 각각 하나의 시점을 말한다
    expect(splitPeriod('2025.02–2025.08')).toEqual(['2025.02', '–2025.08']);
  });

  it('물결표도 같게 다룬다', () => {
    expect(splitPeriod('2025.02~2025.08')).toEqual(['2025.02', '~2025.08']);
  });

  it('긴 이음표도 같게 다룬다', () => {
    expect(splitPeriod('2025.02—2025.08')).toEqual(['2025.02', '—2025.08']);
  });

  it('끝이 열린 기간도 두 줄이다', () => {
    // 「2025.02부터 지금까지」도 시작과 끝이 각자 한 줄이다
    expect(splitPeriod('2025.02–')).toEqual(['2025.02', '–']);
  });

  it('이음표가 맨 앞이면 쪼개지 않는다', () => {
    // 쪼개면 빈 줄이 먼저 나와 점과 어긋난다
    expect(splitPeriod('–2025.08')).toEqual(['–2025.08']);
  });

  it('이음표가 여럿이면 처음에서만 쪼갠다', () => {
    expect(splitPeriod('2025.02–2025.08–2026')).toEqual(['2025.02', '–2025.08–2026']);
  });

  it('빈 값은 그대로 둔다', () => {
    expect(splitPeriod('')).toEqual(['']);
  });
});
