import type { CommitDays } from '@/entities/github';

/** 잔디가 그리는 창 */
export const WINDOW_DAYS = 84;

/** 램프 네 단계. 0은 커밋이 없는 날이다 */
export type ContributionLevel = 0 | 1 | 2 | 3;

export interface ContributionCell {
  /** `YYYY-MM-DD` */
  day: string;
  count: number;
  level: ContributionLevel;
}

/**
 * 84칸을 만든다.
 *
 * 창을 화면이 아니라 여기서 편다. `commitDays`에는 커밋이 있는 날만 들어 있고
 * 없는 날은 아예 없다 — 84줄을 매번 커밋에 넣지 않으려고 그렇게 뒀다.
 *
 * 기준 시각은 빌드 시각이 아니라 **받아둔 시각**이다. 사흘 지난 스냅샷에 오늘까지의
 * 칸을 그리면 마지막 사흘이 늘 비어 「최근에 아무것도 안 했다」로 읽힌다.
 *
 * 단계는 그 창의 최대치에 견준다. 절대값으로 자르면 한가한 분기에는 잔디가 통째로
 * 옅어지고 바쁜 분기에는 통째로 진해져서, 그림이 리듬을 말하지 못한다.
 */
export const toContributionCells = (
  commitDays: CommitDays,
  fetchedAt: string,
): ContributionCell[] => {
  const end = new Date(fetchedAt);
  const max = Math.max(0, ...Object.values(commitDays));

  return Array.from({ length: WINDOW_DAYS }, (_unused, index) => {
    const at = new Date(end);

    at.setUTCDate(at.getUTCDate() - (WINDOW_DAYS - 1 - index));

    const day = at.toISOString().slice(0, 10);
    const count = commitDays[day] ?? 0;

    return { day, count, level: levelOf(count, max) };
  });
};

const levelOf = (count: number, max: number): ContributionLevel => {
  if (count === 0 || max === 0) {
    return 0;
  }

  const share = count / max;

  if (share > 0.66) {
    return 3;
  }

  return share > 0.33 ? 2 : 1;
};
