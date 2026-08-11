import type { IdeaItem, NowItem, ReadingLink, ShortcutLink, TodoItem } from '../model/types';

/**
 * 정적 JSON을 읽어 들이는 관문.
 *
 * ── 왜 캐스팅하고 믿지 않는가
 *
 * 글 frontmatter는 글을 쓰면서 화면을 함께 본다. JSON은 그렇지 않다 — 고치고 배포하고
 * 나중에 대시보드를 열어야 안다. 게다가 대시보드는 만든 사람이 보는 화면이라 틀린 것을
 * 오래 알아채지 못한다. 타입 단언은 그 사이를 하나도 막지 못한다.
 *
 * 그래서 읽는 자리에서 던진다. 빌드가 실패하는 편이 대시보드가 조용히 틀린 것보다 낫다.
 *
 * ── 어디서 틀렸는지 말한다
 *
 * 파일이 다섯이라 「형식이 틀렸다」만으로는 다시 다 열어야 한다. 파일명과 몇 번째
 * 항목인지를 함께 싣는다.
 */

const fail = (where: string, message: string): never => {
  throw new Error(`${where} — ${message}`);
};

const asRecord = (value: unknown, where: string): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : fail(where, '객체가 아니다');

/** 최상위 `{ items: [...] }`를 열어 항목마다 위치 이름을 붙인다 */
const itemsOf = (raw: unknown, file: string): { value: unknown; where: string }[] => {
  const { items } = asRecord(raw, file);

  if (!Array.isArray(items)) {
    return fail(file, '최상위에 items 배열이 없다');
  }

  return items.map((value, index) => ({ value, where: `${file} ${String(index + 1)}번째` }));
};

const text = (record: Record<string, unknown>, key: string, where: string): string => {
  const value = record[key];

  return typeof value === 'string' && value.trim() !== ''
    ? value
    : fail(where, `${key}가 없거나 빈 문자열이다`);
};

/** 빈 문자열을 통과시키지 않는다 — 없는 것과 비어 있는 것이 화면에서 다르게 나온다 */
const optionalText = (
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
    : fail(where, `${key}가 비어 있다. 쓰지 않을 것이면 키째 지운다`);
};

const flag = (record: Record<string, unknown>, key: string, where: string): boolean => {
  const value = record[key];

  return typeof value === 'boolean' ? value : fail(where, `${key}가 true 또는 false가 아니다`);
};

const count = (record: Record<string, unknown>, key: string, where: string): number => {
  const value = record[key];

  return typeof value === 'number' && Number.isInteger(value) && value >= 0
    ? value
    : fail(where, `${key}가 0 이상 정수가 아니다`);
};

const isHttp = (value: string): boolean => /^https?:\/\//.test(value);

/**
 * 값이 없으면 **키째** 없앤다.
 *
 * `{ note: undefined }`와 `{}`는 다르다 — 앞쪽은 「비어 있다고 적었다」이고 뒤쪽은
 * 「적지 않았다」다. JSON에 키가 없었으면 결과에도 없어야 원본과 같은 모양이 된다.
 */
const maybe = <K extends string>(key: K, value: string | undefined): Record<K, string> | object =>
  value === undefined ? {} : { [key]: value };

/**
 * 진행.
 *
 * `done`이 `total`을 넘으면 막대가 칸 밖으로 나간다. 눈에 띄기 전에 여기서 잡는다.
 */
const progressOf = (
  record: Record<string, unknown>,
  where: string,
): { done: number; total: number } => {
  const total = count(record, 'total', where);
  const done = count(record, 'done', where);

  if (total < 1) {
    fail(where, 'total이 1보다 작다');
  }

  if (done > total) {
    fail(where, `done(${String(done)})이 total(${String(total)})보다 크다`);
  }

  return { done, total };
};

export const parseNow = (raw: unknown): NowItem[] =>
  itemsOf(raw, 'now.json').map(({ value, where }): NowItem => {
    const record = asRecord(value, where);
    const { kind } = record;

    if (kind === 'project') {
      return { kind, slug: text(record, 'slug', where) };
    }

    if (kind === 'series') {
      const total = count(record, 'total', where);

      if (total < 1) {
        fail(where, 'total이 1보다 작다');
      }

      return { kind, series: text(record, 'series', where), total };
    }

    if (kind === 'learning') {
      return {
        kind,
        title: text(record, 'title', where),
        unit: text(record, 'unit', where),
        ...progressOf(record, where),
      };
    }

    if (kind === 'reading') {
      const url = optionalText(record, 'url', where);

      if (url !== undefined && !isHttp(url)) {
        fail(where, 'url이 http(s)로 시작하지 않는다');
      }

      return {
        kind,
        title: text(record, 'title', where),
        unit: text(record, 'unit', where),
        ...maybe('url', url),
        ...progressOf(record, where),
      };
    }

    return fail(where, `kind가 project · series · learning · reading 중 하나가 아니다`);
  });

export const parseTodos = (raw: unknown): TodoItem[] =>
  itemsOf(raw, 'todos.json').map(({ value, where }) => {
    const record = asRecord(value, where);

    return { text: text(record, 'text', where), done: flag(record, 'done', where) };
  });

export const parseReading = (raw: unknown): ReadingLink[] =>
  itemsOf(raw, 'reading.json').map(({ value, where }) => {
    const record = asRecord(value, where);
    const url = text(record, 'url', where);

    // 읽을거리는 남이 쓴 것이다. 내부 경로가 들어왔다면 바로가기와 헷갈린 것이다
    if (!isHttp(url)) {
      fail(where, 'url이 외부 주소가 아니다');
    }

    return {
      title: text(record, 'title', where),
      url,
      ...maybe('note', optionalText(record, 'note', where)),
      ...maybe('source', optionalText(record, 'source', where)),
    };
  });

export const parseIdeas = (raw: unknown): IdeaItem[] =>
  itemsOf(raw, 'ideas.json').map(({ value, where }) => {
    const record = asRecord(value, where);

    return {
      title: text(record, 'title', where),
      ...maybe('note', optionalText(record, 'note', where)),
    };
  });

export const parseLinks = (raw: unknown): ShortcutLink[] =>
  itemsOf(raw, 'links.json').map(({ value, where }) => {
    const record = asRecord(value, where);
    const url = text(record, 'url', where);

    // 내부 문서는 `/`로 시작한다. 그 판단이 화살표(↗)를 붙일지도 정한다
    if (!isHttp(url) && !url.startsWith('/')) {
      fail(where, 'url이 http(s)로도 /로도 시작하지 않는다');
    }

    return {
      label: text(record, 'label', where),
      url,
      ...maybe('note', optionalText(record, 'note', where)),
    };
  });
