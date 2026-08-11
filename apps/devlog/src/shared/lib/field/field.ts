/**
 * 바깥에서 들어온 값을 따지는 최소 도구.
 *
 * JSON과 frontmatter는 타입 검사를 지나지 않는다. 캐스팅으로 「그럴 것이다」라고
 * 적어두면 그 말이 틀렸을 때 아무도 알려주지 않는다 — 화면이 조용히 비거나 어긋난다.
 *
 * 그래서 읽는 자리에서 던진다. 빌드가 실패하는 편이 조용히 틀린 것보다 낫다.
 *
 * ── 어디서 틀렸는지 말한다
 *
 * 파일이 여럿이라 「형식이 틀렸다」만으로는 다 열어봐야 한다. 부르는 쪽이 `where`에
 * 파일명(과 필요하면 몇 번째인지)을 넣고, 여기서 필드 이름을 붙인다.
 */

export const fail = (where: string, message: string): never => {
  throw new Error(`${where} — ${message}`);
};

export const asRecord = (value: unknown, where: string): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : fail(where, '객체가 아니다');

export const text = (record: Record<string, unknown>, key: string, where: string): string => {
  const value = record[key];

  return typeof value === 'string' && value.trim() !== ''
    ? value
    : fail(where, `${key}: 없거나 빈 문자열이다`);
};

/**
 * 없어도 되는 글.
 *
 * 빈 문자열은 통과시키지 않는다 — 「적지 않았다」와 「비워뒀다」가 화면에서 다르게
 * 나온다. 쓰지 않을 것이면 키째 지우게 한다.
 */
export const optionalText = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): string | undefined => {
  const value = record[key];

  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'string' && value.trim() !== ''
    ? value
    : fail(where, `${key}: 비어 있다. 쓰지 않을 것이면 키째 지운다`);
};

export const flag = (record: Record<string, unknown>, key: string, where: string): boolean => {
  const value = record[key];

  return typeof value === 'boolean' ? value : fail(where, `${key}: true 또는 false여야 한다`);
};

/** 0 이상 정수 */
export const count = (record: Record<string, unknown>, key: string, where: string): number => {
  const value = record[key];

  return typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? value
    : fail(where, `${key}: 0 이상 정수여야 한다`);
};

/**
 * 정해둔 어휘 중 하나.
 *
 * 타입이 리터럴 유니온인 자리에만 쓴다. 여기서 좁혀야 캐스팅 없이 그 타입이 된다 —
 * 열린 어휘(스택 · 태그)의 정합은 이 도구가 아니라 콘텐츠 검사가 볼 일이다.
 */
export const oneOf = <T extends string>(
  record: Record<string, unknown>,
  key: string,
  where: string,
  allowed: readonly T[],
): T => {
  const value = record[key];
  const found = allowed.find((candidate) => candidate === value);

  return found ?? fail(where, `${key}: ${allowed.join(' · ')} 중 하나여야 한다`);
};

export const optionalOneOf = <T extends string>(
  record: Record<string, unknown>,
  key: string,
  where: string,
  allowed: readonly T[],
): T | undefined => (record[key] === undefined ? undefined : oneOf<T>(record, key, where, allowed));

/** 빈 글이 섞이지 않은 글 목록. 빈 배열은 통과한다 — 없는 것과 다르지 않다 */
export const textList = (record: Record<string, unknown>, key: string, where: string): string[] => {
  const value = record[key];

  if (!Array.isArray(value)) {
    return fail(where, `${key}: 배열이어야 한다`);
  }

  return value.map((item, index) =>
    typeof item === 'string' && item.trim() !== ''
      ? item
      : fail(where, `${key}[${String(index)}]: 비어 있거나 문자열이 아니다`),
  );
};

export const optionalTextList = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): string[] | undefined => (record[key] === undefined ? undefined : textList(record, key, where));

/** 배열 안의 객체들. 항목마다 위치 이름을 붙여 돌려준다 */
export const recordList = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): { value: Record<string, unknown>; where: string }[] => {
  const value = record[key];

  if (!Array.isArray(value)) {
    return fail(where, `${key}: 배열이어야 한다`);
  }

  return value.map((item, index) => {
    const at = `${where} ${key}[${String(index)}]`;

    return { value: asRecord(item, at), where: at };
  });
};

export const optionalRecordList = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): { value: Record<string, unknown>; where: string }[] | undefined =>
  record[key] === undefined ? undefined : recordList(record, key, where);

/*
 * 시각과 달.
 *
 * 오프셋을 반드시 적게 한다. 없으면 읽는 쪽의 시간대가 날짜를 정하고, 그러면 빌드가
 * 도는 기계에 따라 화면의 날짜가 하루씩 움직인다.
 */
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const YEAR_MONTH = /^\d{4}-(?:0[1-9]|1[0-2])$/;

/**
 * 달력에 있는 날인가.
 *
 * `Date.parse`로는 못 잡는다 — `2026-02-30`을 3월 2일로 굴려서 유효한 값을 돌려준다.
 * 적어둔 날짜와 다른 날이 조용히 화면에 나온다. 적은 그대로 되돌아오는지 본다.
 */
const isRealDate = (year: number, month: number, day: number): boolean => {
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
};

export const instant = (record: Record<string, unknown>, key: string, where: string): string => {
  const value = text(record, key, where);
  const match = ISO_INSTANT.exec(value);

  if (match === null) {
    return fail(where, `${key}: 오프셋까지 적힌 ISO 8601이어야 한다 — ${value}`);
  }

  const [year, month, day] = value.slice(0, 10).split('-').map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return fail(where, `${key}: 날짜를 읽을 수 없다 — ${value}`);
  }

  if (!isRealDate(year, month, day)) {
    fail(where, `${key}: 달력에 없는 날이다 — ${value}`);
  }

  return value;
};

export const optionalInstant = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): string | undefined => (record[key] === undefined ? undefined : instant(record, key, where));

export const yearMonth = (record: Record<string, unknown>, key: string, where: string): string => {
  const value = text(record, key, where);

  return YEAR_MONTH.test(value) ? value : fail(where, `${key}: YYYY-MM이어야 한다 — ${value}`);
};

export const optionalYearMonth = (
  record: Record<string, unknown>,
  key: string,
  where: string,
): string | undefined => (record[key] === undefined ? undefined : yearMonth(record, key, where));

/**
 * 값이 없으면 키째 없앤다.
 *
 * `{ note: undefined }`와 `{}`는 다르다 — 앞쪽은 「비어 있다고 적었다」이고 뒤쪽은
 * 「적지 않았다」다. 원본에 키가 없었으면 결과에도 없어야 모양이 같다.
 */
export const maybe = <K extends string, V>(key: K, value: V | undefined): Record<K, V> | object =>
  value === undefined ? {} : { [key]: value };
