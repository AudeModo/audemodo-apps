/**
 * 시작한 달로부터 몇 개월째인가.
 *
 * 손으로 적으면 달이 바뀌어도 그대로 남아 거짓이 된다 — 화면에 적히는 수는 전부
 * 계산값이어야 한다.
 */

const toIndex = (month: string): number => {
  const match = /^(\d{4})-(\d{2})$/.exec(month);

  return match === null ? Number.NaN : Number(match[1]) * 12 + (Number(match[2]) - 1);
};

/**
 * 시작한 달을 1개월째로 센다.
 *
 * 0개월째는 없다 — 시작한 달에도 그 달만큼은 만들고 있었다.
 * 지금 달을 인자로 받아 빌드 시각에 결과가 흔들리지 않게 한다.
 */
export const monthsSince = (startedAt: string, currentMonth: string): number => {
  const from = toIndex(startedAt);
  const to = toIndex(currentMonth);

  if (Number.isNaN(from) || Number.isNaN(to)) {
    return 1;
  }

  return Math.max(1, to - from + 1);
};
