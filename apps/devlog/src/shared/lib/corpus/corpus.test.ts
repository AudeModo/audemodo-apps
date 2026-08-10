import { describe, expect, it } from 'vitest';

import { toFrequency, toMonthlyBuckets, toShares } from './corpus';

const percents = (counts: number[]) => toShares(counts).map((share) => share.percent);

describe('toShares', () => {
  it('나누어떨어지면 그대로 나눈다', () => {
    expect(percents([1, 1, 1, 1])).toEqual([25, 25, 25, 25]);
  });

  it('나누어떨어지지 않아도 합이 정확히 100이다', () => {
    // 각자 반올림하면 33+33+33=99가 되어 화면에 틀린 분포가 그려진다
    expect(percents([1, 1, 1])).toEqual([34, 33, 33]);
    expect(percents([1, 1, 1]).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it('남은 몫을 소수부가 큰 칸부터 나눠 준다', () => {
    // 7 · 2 · 1 → 70 · 20 · 10
    expect(percents([7, 2, 1])).toEqual([70, 20, 10]);
    // 5 · 3 · 3 → 45.45 · 27.27 · 27.27 → 소수부가 같으면 앞선 칸이 먼저
    expect(percents([5, 3, 3]).reduce((a, b) => a + b, 0)).toBe(100);
  });

  it('0인 칸은 0퍼센트로 남는다', () => {
    // BE 0편은 사라지지 않고 0으로 남아야 한다
    expect(percents([3, 0, 1])).toEqual([75, 0, 25]);
  });

  it('전부 0이면 전부 0이다', () => {
    expect(percents([0, 0])).toEqual([0, 0]);
  });

  it('개수를 함께 돌려준다', () => {
    expect(toShares([2, 1])).toEqual([
      { count: 2, percent: 67 },
      { count: 1, percent: 33 },
    ]);
  });
});

describe('toMonthlyBuckets', () => {
  it('달별로 세고 시간 순으로 준다', () => {
    const buckets = toMonthlyBuckets([
      '2026-08-03T09:00:00+09:00',
      '2026-07-01T09:00:00+09:00',
      '2026-08-20T09:00:00+09:00',
    ]);

    expect(buckets).toEqual([
      { month: '2026-07', count: 1 },
      { month: '2026-08', count: 2 },
    ]);
  });

  it('빈 달도 0으로 채운다', () => {
    // 쉰 달을 빼면 막대가 붙어 「꾸준히 썼다」로 보인다
    const buckets = toMonthlyBuckets(['2026-05-01', '2026-08-01']);

    expect(buckets.map((b) => b.month)).toEqual(['2026-05', '2026-06', '2026-07', '2026-08']);
    expect(buckets.map((b) => b.count)).toEqual([1, 0, 0, 1]);
  });

  it('해를 넘겨도 이어서 센다', () => {
    const buckets = toMonthlyBuckets(['2025-12-01', '2026-01-01']);

    expect(buckets.map((b) => b.month)).toEqual(['2025-12', '2026-01']);
  });

  it('형식이 어긋난 값은 세지 않는다', () => {
    expect(toMonthlyBuckets(['언젠가', '2026-07-01'])).toEqual([{ month: '2026-07', count: 1 }]);
  });

  it('아무것도 없으면 빈 목록이다', () => {
    expect(toMonthlyBuckets([])).toEqual([]);
  });
});

describe('toFrequency', () => {
  it('여러 목록에 걸쳐 센다', () => {
    const result = toFrequency([['FSD', 'CI'], ['CI'], ['접근성', 'CI']]);

    expect(result[0]).toEqual({ value: 'CI', count: 3 });
  });

  it('많은 것부터 준다', () => {
    const result = toFrequency([['a', 'b'], ['b'], ['b', 'c']]);

    expect(result.map((item) => item.value)).toEqual(['b', 'a', 'c']);
  });

  it('같은 수면 이름 순으로 고정한다', () => {
    // 고정하지 않으면 빌드마다 구름의 배치가 바뀐다
    const result = toFrequency([['나', '가', '다']]);

    expect(result.map((item) => item.value)).toEqual(['가', '나', '다']);
  });

  it('아무것도 없으면 빈 목록이다', () => {
    expect(toFrequency([])).toEqual([]);
    expect(toFrequency([[]])).toEqual([]);
  });
});
