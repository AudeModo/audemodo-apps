/**
 * 월 단위 타임라인의 축과 막대 위치.
 *
 * 축 범위를 손으로 적지 않는다 — 프로젝트가 하나 늘거나 달이 바뀌면 축이 따라 움직여야
 * 하는데, 고정하면 새 막대가 축 밖으로 나가거나 빈 칸이 남는다.
 */

export interface TimelineSpan {
  /** `YYYY-MM` */
  startedAt: string;
  /** `YYYY-MM`. 없으면 아직 진행 중이다 */
  endedAt?: string | undefined;
}

export interface TimelineRow {
  /** 1부터 세는 격자 열. CSS `grid-column`의 시작 */
  startColumn: number;
  /** 끝 열(열림 구간). `grid-column`의 끝 */
  endColumn: number;
  /** 진행 중이면 오른쪽 끝을 닫지 않는다 */
  isOpen: boolean;
}

export interface Timeline {
  /** 축에 적을 달. `YYYY-MM` 오름차순 */
  months: string[];
  /** 입력과 같은 순서 */
  rows: TimelineRow[];
}

/** `YYYY-MM`을 비교·계산이 되는 수로. 2026-03 → 24315 */
const toIndex = (month: string): number => {
  const match = /^(\d{4})-(\d{2})$/.exec(month);

  if (match === null) {
    return Number.NaN;
  }

  return Number(match[1]) * 12 + (Number(match[2]) - 1);
};

const toMonth = (index: number): string => {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;

  return `${String(year)}-${String(month).padStart(2, '0')}`;
};

/**
 * 축과 막대를 함께 만든다.
 *
 * 지금 달을 인자로 받는 이유: 진행 중인 것의 오른쪽 끝이 「지금」이라 실행 시각에 따라
 * 결과가 달라진다. 밖에서 넣어야 빌드가 언제 돌든 같은 값이 나오는지 확인할 수 있다.
 */
export const buildTimeline = (spans: readonly TimelineSpan[], currentMonth: string): Timeline => {
  const usable = spans.filter((span) => !Number.isNaN(toIndex(span.startedAt)));

  if (usable.length === 0) {
    return { months: [], rows: [] };
  }

  const starts = usable.map((span) => toIndex(span.startedAt));

  // 끝나지 않은 것은 지금까지 뻗는다. 지금이 시작보다 이르면 시작 달까지만 그린다
  const ends = usable.map((span) => {
    const ended = span.endedAt === undefined ? Number.NaN : toIndex(span.endedAt);

    return Number.isNaN(ended) ? Math.max(toIndex(span.startedAt), toIndex(currentMonth)) : ended;
  });

  const first = Math.min(...starts);
  const last = Math.max(...ends.filter((end) => !Number.isNaN(end)), first);

  const months: string[] = [];

  for (let index = first; index <= last; index += 1) {
    months.push(toMonth(index));
  }

  const rows = usable.map((span, index) => {
    const start = (starts[index] ?? first) - first + 1;
    const end = (ends[index] ?? first) - first + 2;

    return {
      startColumn: start,
      // 시작과 끝이 같은 달이어도 한 칸은 차지해야 보인다
      endColumn: Math.max(end, start + 1),
      isOpen: span.endedAt === undefined,
    };
  });

  return { months, rows };
};
