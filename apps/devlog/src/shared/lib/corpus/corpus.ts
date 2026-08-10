/**
 * 코퍼스에서 나오는 셈들.
 *
 * 화면에 적히는 수는 전부 여기를 지난다 — 그림과 문장이 같은 배열에서 나와야
 * 「12주 · 84일」처럼 둘이 어긋나는 일이 없다.
 *
 * 도메인을 모르게 둔다. 글이든 프로젝트든 세는 방식은 같다.
 */

export interface Share {
  count: number;
  /** 정수 퍼센트. 목록 전체를 더하면 정확히 100이다 */
  percent: number;
}

export interface MonthBucket {
  /** `YYYY-MM` */
  month: string;
  count: number;
}

export interface Frequency {
  value: string;
  count: number;
}

/**
 * 비율을 정수 퍼센트로. **합이 정확히 100이 된다.**
 *
 * 각자 반올림하면 99나 101이 나온다 — 화면에 「합이 100이 아닌 분포」가 그려지면
 * 보는 사람은 어느 칸이 틀렸는지 알 수 없다. 내림한 뒤 남은 몫을 소수부가 큰
 * 순서대로 하나씩 나눠 준다.
 */
export const toShares = (counts: readonly number[]): Share[] => {
  const total = counts.reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return counts.map((count) => ({ count, percent: 0 }));
  }

  const exact = counts.map((count) => (count * 100) / total);
  const floors = exact.map((value) => Math.floor(value));
  let remaining = 100 - floors.reduce((sum, value) => sum + value, 0);

  // 소수부가 큰 칸부터 1씩. 같으면 앞선 칸이 먼저 가져간다
  const order = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => (b.fraction === a.fraction ? a.index - b.index : b.fraction - a.fraction));

  const percents = [...floors];

  for (const { index } of order) {
    if (remaining <= 0) {
      break;
    }

    percents[index] = (percents[index] ?? 0) + 1;
    remaining -= 1;
  }

  return counts.map((count, index) => ({ count, percent: percents[index] ?? 0 }));
};

/**
 * 달별 개수. 시간 순이고 **빈 달도 0으로 채운다.**
 *
 * 비어 있는 달을 빼면 막대가 촘촘히 붙어 「꾸준히 썼다」로 보인다. 쉰 달은 쉰 채로
 * 보이는 것이 사실이다.
 */
export const toMonthlyBuckets = (isoDates: readonly string[]): MonthBucket[] => {
  const months = isoDates
    .map((iso) => iso.slice(0, 7))
    .filter((month) => /^\d{4}-\d{2}$/.test(month));

  if (months.length === 0) {
    return [];
  }

  const counted = new Map<string, number>();

  for (const month of months) {
    counted.set(month, (counted.get(month) ?? 0) + 1);
  }

  const toIndex = (month: string): number =>
    Number(month.slice(0, 4)) * 12 + (Number(month.slice(5, 7)) - 1);

  const indexes = months.map(toIndex);
  const buckets: MonthBucket[] = [];

  for (let index = Math.min(...indexes); index <= Math.max(...indexes); index += 1) {
    const year = Math.floor(index / 12);
    const month = `${String(year)}-${String((index % 12) + 1).padStart(2, '0')}`;

    buckets.push({ month, count: counted.get(month) ?? 0 });
  }

  return buckets;
};

/**
 * 값별 빈도. 많은 것부터, 같으면 이름 순.
 *
 * 같은 수일 때 순서를 고정하는 이유: 고정하지 않으면 빌드마다 태그 구름의 배치가
 * 바뀌어 무엇도 바뀌지 않았는데 화면이 달라진다.
 */
export const toFrequency = (groups: readonly (readonly string[])[]): Frequency[] => {
  const counted = new Map<string, number>();

  for (const group of groups) {
    for (const value of group) {
      counted.set(value, (counted.get(value) ?? 0) + 1);
    }
  }

  return [...counted.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => (b.count === a.count ? a.value.localeCompare(b.value) : b.count - a.count));
};
