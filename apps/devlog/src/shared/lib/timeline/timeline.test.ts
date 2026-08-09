import { describe, expect, it } from 'vitest';

import { buildTimeline } from './timeline';

/** 지금 달을 인자로 받으므로 결과가 실행 시각에 흔들리지 않는다 */
const NOW = '2026-08';

describe('buildTimeline', () => {
  it('가장 이른 시작부터 가장 늦은 끝까지 축을 만든다', () => {
    const { months } = buildTimeline(
      [
        { startedAt: '2026-02', endedAt: '2026-03' },
        { startedAt: '2026-04', endedAt: '2026-06' },
      ],
      NOW,
    );

    expect(months).toEqual(['2026-02', '2026-03', '2026-04', '2026-05', '2026-06']);
  });

  it('진행 중인 것이 있으면 축이 지금 달까지 뻗는다', () => {
    // 축을 고정하면 달이 바뀔 때 막대가 축 밖으로 나간다
    const { months } = buildTimeline([{ startedAt: '2026-06' }], NOW);

    expect(months).toEqual(['2026-06', '2026-07', '2026-08']);
  });

  it('막대를 1부터 세는 격자 열로 옮긴다', () => {
    const { rows } = buildTimeline(
      [
        { startedAt: '2026-02', endedAt: '2026-03' },
        { startedAt: '2026-03', endedAt: '2026-05' },
      ],
      NOW,
    );

    // 축이 02부터이므로 02는 1열, 03은 2열이다. 끝 열은 열린 구간이다
    expect(rows[0]).toMatchObject({ startColumn: 1, endColumn: 3 });
    expect(rows[1]).toMatchObject({ startColumn: 2, endColumn: 5 });
  });

  it('한 달짜리도 한 칸을 차지한다', () => {
    // 시작과 끝이 같으면 폭이 0이 되어 막대가 사라진다
    const { rows } = buildTimeline([{ startedAt: '2026-03', endedAt: '2026-03' }], '2026-03');

    expect(rows[0]).toMatchObject({ startColumn: 1, endColumn: 2 });
  });

  it('끝이 없으면 열린 막대로 표시한다', () => {
    const { rows } = buildTimeline(
      [{ startedAt: '2026-02', endedAt: '2026-03' }, { startedAt: '2026-05' }],
      NOW,
    );

    expect(rows.map((row) => row.isOpen)).toEqual([false, true]);
  });

  it('입력 순서를 그대로 지킨다', () => {
    // 정렬은 부르는 쪽의 몫이다 — 카드와 타임라인이 다른 축으로 정렬된다
    const { rows } = buildTimeline(
      [
        { startedAt: '2026-06', endedAt: '2026-07' },
        { startedAt: '2026-02', endedAt: '2026-03' },
      ],
      NOW,
    );

    expect(rows[0]?.startColumn).toBe(5);
    expect(rows[1]?.startColumn).toBe(1);
  });

  it('해를 넘겨도 이어서 센다', () => {
    const { months } = buildTimeline([{ startedAt: '2025-11', endedAt: '2026-01' }], '2026-01');

    expect(months).toEqual(['2025-11', '2025-12', '2026-01']);
  });

  it('겹치는 기간을 각자 그대로 둔다', () => {
    // 타임라인의 목적이 무엇이 겹쳤는지 보이는 것이라 합치지 않는다
    const { rows } = buildTimeline(
      [
        { startedAt: '2026-02', endedAt: '2026-05' },
        { startedAt: '2026-03', endedAt: '2026-04' },
      ],
      NOW,
    );

    expect(rows[0]).toMatchObject({ startColumn: 1, endColumn: 5 });
    expect(rows[1]).toMatchObject({ startColumn: 2, endColumn: 4 });
  });

  it('지금이 시작보다 이르면 시작 달까지만 그린다', () => {
    // 앞으로 시작할 것을 적어두어도 축이 거꾸로 늘어나지 않아야 한다
    const { months } = buildTimeline([{ startedAt: '2026-09' }], '2026-08');

    expect(months).toEqual(['2026-09']);
  });

  it('형식이 어긋난 값은 세지 않는다', () => {
    const { months, rows } = buildTimeline(
      [{ startedAt: '언젠가' }, { startedAt: '2026-07', endedAt: '2026-07' }],
      '2026-07',
    );

    expect(months).toEqual(['2026-07']);
    expect(rows).toHaveLength(1);
  });

  it('아무것도 없으면 축도 없다', () => {
    expect(buildTimeline([], NOW)).toEqual({ months: [], rows: [] });
  });
});
