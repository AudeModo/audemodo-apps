/**
 * 글을 다시 볼 때가 됐는가.
 *
 * 마지막으로 검토한 날에 주기를 더해 기한을 내고, 오늘까지 며칠 남았는지를 센다.
 * 손으로 「곧 갱신」이라고 적어두면 그 표시가 먼저 낡는다.
 *
 * 오늘을 인자로 받는 이유는 늘 같다 — 빌드 시각에 따라 답이 달라지는 계산이라,
 * 밖에서 넣어야 같은 입력에 같은 값이 나오는지 확인할 수 있다.
 */

/**
 * 다시 볼 주기.
 *
 * 목록에서 타입을 뽑는다. 둘을 따로 적으면 값을 늘릴 때 한쪽만 고치고 지나간다 —
 * 그러면 frontmatter 검증이 새 값을 모르는 채로 통과시킨다.
 */
export const REVIEW_CYCLES = ['6mo', '1y'] as const;

export type ReviewCycle = (typeof REVIEW_CYCLES)[number];

/** 기한까지 얼마나 남았나 */
export type ReviewLevel = 'overdue' | 'soon' | 'ok';

export interface ReviewStatus {
  /** `YYYY.MM.DD` */
  dueAt: string;
  /** 음수면 이미 지났다 */
  remainingDays: number;
  level: ReviewLevel;
}

/** 기한이 이만큼 안쪽이면 임박이다 */
const SOON_DAYS = 45;

const MONTHS: Record<ReviewCycle, number> = { '6mo': 6, '1y': 12 };

const CALENDAR = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * 시각을 서울 달력의 연·월·일로.
 *
 * 시각을 그대로 빼면 시간대에 따라 하루가 왔다 갔다 한다. 화면에 보이는 날짜와
 * 같은 달력에서 세야 「3일 남음」이 화면의 날짜와 어긋나지 않는다.
 */
const toCalendarDay = (iso: string): { year: number; month: number; day: number } | null => {
  const at = new Date(iso);

  if (Number.isNaN(at.getTime())) {
    return null;
  }

  const [year, month, day] = CALENDAR.format(at).split('-').map(Number);

  return year === undefined || month === undefined || day === undefined
    ? null
    : { year, month, day };
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** 지났으면 지남, 45일 안쪽이면 임박, 그 밖은 여유 */
const toLevel = (remainingDays: number): ReviewLevel => {
  if (remainingDays < 0) {
    return 'overdue';
  }

  return remainingDays <= SOON_DAYS ? 'soon' : 'ok';
};

export const reviewStatus = (
  lastReviewed: string,
  cycle: ReviewCycle,
  today: string,
): ReviewStatus | null => {
  const from = toCalendarDay(lastReviewed);
  const now = toCalendarDay(today);

  if (from === null || now === null) {
    return null;
  }

  const months = MONTHS[cycle];
  const dueMonthIndex = from.month - 1 + months;

  /*
   * 달을 더하면 없는 날이 나올 수 있다 — 8월 31일에 6개월을 더하면 2월 31일이다.
   * 그 달의 마지막 날로 당긴다. 넘기면 기한이 한 달 뒤로 밀려 버린다.
   */
  const dueYear = from.year + Math.floor(dueMonthIndex / 12);
  const dueMonth = (dueMonthIndex % 12) + 1;
  const lastDayOfMonth = new Date(Date.UTC(dueYear, dueMonth, 0)).getUTCDate();
  const dueDay = Math.min(from.day, lastDayOfMonth);

  const dueUtc = Date.UTC(dueYear, dueMonth - 1, dueDay);
  const nowUtc = Date.UTC(now.year, now.month - 1, now.day);
  const remainingDays = Math.round((dueUtc - nowUtc) / DAY_MS);

  const pad = (value: number): string => String(value).padStart(2, '0');

  return {
    dueAt: `${String(dueYear)}.${pad(dueMonth)}.${pad(dueDay)}`,
    remainingDays,
    level: toLevel(remainingDays),
  };
};
