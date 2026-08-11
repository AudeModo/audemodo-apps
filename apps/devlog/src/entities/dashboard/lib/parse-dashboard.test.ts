import { describe, expect, it } from 'vitest';

import { parseIdeas, parseLinks, parseNow, parseReading, parseTodos } from './parse-dashboard';

/**
 * JSON은 글 frontmatter보다 위험하다. 글은 쓰면서 화면을 함께 보지만 JSON은 고치고
 * 배포하고 나중에 대시보드를 열어야 안다. 게다가 그 화면은 만든 사람만 보므로
 * 틀린 것이 오래 남는다. 그래서 읽는 자리에서 던지고, 그 던짐을 여기서 지킨다.
 */

const wrap = (...items: unknown[]): unknown => ({ items });

describe('parse — 최상위 모양', () => {
  it('items가 없으면 던진다', () => {
    expect(() => parseTodos({})).toThrow('items 배열이 없다');
  });

  it('items가 배열이 아니면 던진다', () => {
    expect(() => parseTodos({ items: '할 일' })).toThrow('items 배열이 없다');
  });

  it('빈 목록은 통과한다 — 아직 안 채운 것과 틀린 것은 다르다', () => {
    expect(parseTodos(wrap())).toEqual([]);
  });

  it('어느 파일 몇 번째인지 말한다', () => {
    // 파일이 다섯이라 「형식이 틀렸다」만으로는 다시 다 열어야 한다
    expect(() => parseTodos(wrap({ text: '가', done: true }, { text: '' }))).toThrow(
      'todos.json 2번째',
    );
  });
});

describe('parseTodos', () => {
  it('읽는다', () => {
    expect(parseTodos(wrap({ text: '스키마 정하기', done: false }))).toEqual([
      { text: '스키마 정하기', done: false },
    ]);
  });

  it('done이 없거나 문자열이면 던진다', () => {
    expect(() => parseTodos(wrap({ text: '가' }))).toThrow('done');
    expect(() => parseTodos(wrap({ text: '가', done: 'true' }))).toThrow('done');
  });
});

describe('parseNow — 종류마다 필요한 것이 다르다', () => {
  it('프로젝트는 slug 하나뿐이다', () => {
    // 진행은 그 프로젝트의 마일스톤에서 계산한다. 여기 적으면 두 번째 진실이 생긴다
    expect(parseNow(wrap({ kind: 'project', slug: 'devlog' }))).toEqual([
      { kind: 'project', slug: 'devlog' },
    ]);
  });

  it('연작은 계획한 편 수만 받는다', () => {
    expect(parseNow(wrap({ kind: 'series', series: 'FSD 실전', total: 6 }))).toEqual([
      { kind: 'series', series: 'FSD 실전', total: 6 },
    ]);
  });

  it('학습과 읽는 중은 진행을 함께 받는다', () => {
    expect(
      parseNow(wrap({ kind: 'learning', title: 'Spring', done: 12, total: 34, unit: '장' })),
    ).toEqual([{ kind: 'learning', title: 'Spring', done: 12, total: 34, unit: '장' }]);
  });

  it('done이 total보다 크면 던진다', () => {
    // 막대가 칸 밖으로 나가는 것을 눈에 띄기 전에 잡는다
    expect(() =>
      parseNow(wrap({ kind: 'learning', title: 'Spring', done: 40, total: 34, unit: '장' })),
    ).toThrow('done(40)이 total(34)보다 크다');
  });

  it('total이 0이면 던진다', () => {
    expect(() => parseNow(wrap({ kind: 'series', series: '가', total: 0 }))).toThrow('total');
  });

  it('진행이 소수면 던진다', () => {
    expect(() =>
      parseNow(wrap({ kind: 'reading', title: '책', done: 1.5, total: 22, unit: '장' })),
    ).toThrow('done');
  });

  it('모르는 kind는 던진다', () => {
    expect(() => parseNow(wrap({ kind: 'watching', title: '가' }))).toThrow('kind가');
  });
});

describe('parseReading — 남이 쓴 것으로 가는 링크다', () => {
  it('안 적은 것은 키째 없다', () => {
    // `toStrictEqual`이라야 `{ note: undefined }`와 `{}`를 가른다.
    // 적지 않은 것과 비워둔 것이 결과에서 같아지면 원본과 모양이 달라진다
    expect(parseReading(wrap({ title: '글', url: 'https://example.com/a' }))).toStrictEqual([
      { title: '글', url: 'https://example.com/a' },
    ]);
  });

  it('내부 경로는 던진다', () => {
    // 내부 경로가 들어왔다면 바로가기와 헷갈린 것이다
    expect(() => parseReading(wrap({ title: '글', url: '/docs' }))).toThrow('외부 주소가 아니다');
  });

  it('빈 note는 없는 것으로 넘기지 않고 던진다', () => {
    expect(() =>
      parseReading(wrap({ title: '글', url: 'https://example.com/a', note: '  ' })),
    ).toThrow('키째 지운다');
  });
});

describe('parseLinks — 내부와 외부를 주소로 가른다', () => {
  it('외부와 내부를 모두 받는다', () => {
    expect(
      parseLinks(
        wrap({ label: 'GitHub', url: 'https://github.com/x' }, { label: 'meta', url: '/docs' }),
      ),
    ).toStrictEqual([
      { label: 'GitHub', url: 'https://github.com/x' },
      { label: 'meta', url: '/docs' },
    ]);
  });

  it('둘 다 아닌 주소는 던진다', () => {
    expect(() => parseLinks(wrap({ label: 'x', url: 'github.com' }))).toThrow('/로도');
  });
});

describe('parseIdeas', () => {
  it('읽는다', () => {
    expect(parseIdeas(wrap({ title: '레이어 밖이 안을 이긴다', note: '이번에 밟았다' }))).toEqual([
      { title: '레이어 밖이 안을 이긴다', note: '이번에 밟았다' },
    ]);
  });

  it('title이 비면 던진다', () => {
    expect(() => parseIdeas(wrap({ note: '메모만 있다' }))).toThrow('title');
  });
});
