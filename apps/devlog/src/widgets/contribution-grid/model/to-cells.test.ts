import { describe, expect, it } from 'vitest';

import { toContributionCells, WINDOW_DAYS } from './to-cells';

const FETCHED = '2026-08-11T00:00:00Z';

describe('toContributionCells', () => {
  it('창만큼 칸을 만든다', () => {
    expect(toContributionCells({}, FETCHED)).toHaveLength(WINDOW_DAYS);
  });

  it('마지막 칸이 받아둔 날이다', () => {
    // 빌드 시각으로 끝을 잡으면 낡은 스냅샷의 마지막 며칠이 늘 비어 보인다
    const cells = toContributionCells({}, FETCHED);

    expect(cells[WINDOW_DAYS - 1]?.day).toBe('2026-08-11');
  });

  it('없는 날은 0이고 단계도 0이다', () => {
    const cells = toContributionCells({ '2026-08-11': 4 }, FETCHED);

    expect(cells[0]).toEqual({ day: '2026-05-20', count: 0, level: 0 });
  });

  it('단계를 그 창의 최대치에 견준다', () => {
    const cells = toContributionCells(
      { '2026-08-11': 9, '2026-08-10': 5, '2026-08-09': 1 },
      FETCHED,
    );
    const by = (day: string) => cells.find((cell) => cell.day === day);

    expect(by('2026-08-11')?.level).toBe(3);
    expect(by('2026-08-10')?.level).toBe(2);
    expect(by('2026-08-09')?.level).toBe(1);
  });

  it('창 밖의 날은 세지 않는다', () => {
    const cells = toContributionCells({ '2020-01-01': 99 }, FETCHED);

    expect(cells.every((cell) => cell.count === 0)).toBe(true);
  });
});
