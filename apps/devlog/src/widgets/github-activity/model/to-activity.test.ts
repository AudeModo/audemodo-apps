import { describe, expect, it } from 'vitest';

import { toCommitRows, toOpenRows } from './to-activity';

const FETCHED = '2026-08-11T13:57:45.754Z';

const item = (number: number, createdAt: string, kind: 'pr' | 'issue' = 'issue') => ({
  number,
  title: `#${String(number)}`,
  kind,
  createdAt,
});

describe('toCommitRows', () => {
  it('서울 달력으로 날짜를 적는다', () => {
    // UTC 13:33은 서울 22:33이라 같은 날이다. 하루가 밀리면 목록이 하루씩 어긋난다
    const rows = toCommitRows([
      { sha: 'ec0446b', message: '머지', committedAt: '2026-08-11T13:33:45Z' },
    ]);

    expect(rows[0]).toEqual({ sha: 'ec0446b', message: '머지', day: '2026.08.11' });
  });

  it('자정을 넘기는 UTC 시각도 서울 날짜로 적는다', () => {
    const rows = toCommitRows([{ sha: 'a', message: 'b', committedAt: '2026-08-11T16:00:00Z' }]);

    expect(rows[0]?.day).toBe('2026.08.12');
  });
});

describe('toOpenRows', () => {
  it('받아둔 시각에서 경과일을 잰다', () => {
    // 빌드 시각으로 재면 낡은 목록에 오늘까지의 날수가 붙어 두 시계가 섞인다
    const rows = toOpenRows([item(4, '2026-07-30T06:34:24Z')], FETCHED);

    expect(rows[0]?.elapsedDays).toBe(12);
  });

  it('오래된 것을 위에 놓는다', () => {
    const rows = toOpenRows(
      [item(4, '2026-07-30T06:34:24Z'), item(2, '2026-07-15T03:07:55Z')],
      FETCHED,
    );

    expect(rows.map((row) => row.number)).toEqual([2, 4]);
  });

  it('23일을 넘기면 오래된 것으로 본다', () => {
    const rows = toOpenRows(
      [item(2, '2026-07-15T03:07:55Z'), item(4, '2026-07-30T06:34:24Z')],
      FETCHED,
    );

    expect(rows.map((row) => row.isAged)).toEqual([true, false]);
  });

  it('PR과 이슈를 가려 들고 다닌다', () => {
    const rows = toOpenRows([item(9, '2026-08-01T00:00:00Z', 'pr')], FETCHED);

    expect(rows[0]?.kind).toBe('pr');
  });
});
