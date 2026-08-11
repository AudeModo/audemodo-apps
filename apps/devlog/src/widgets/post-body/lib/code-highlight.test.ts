import { describe, expect, it } from 'vitest';

import type { CodeToken } from '@/shared/ui';

import { highlightCode } from './code-highlight';

/**
 * 밀어놓은 색이 실제로 치환되는지 지킨다.
 *
 * 이 코드는 화면으로 밟히지 않는다 — 저장소의 코드블록에 타입 이름도 숫자도 속성 이름도
 * 태그 꺾쇠도 들어 있지 않다. 눈으로 확인할 길이 없으니 여기가 유일한 감시 지점이다.
 *
 * 치환이 **도는지**와 **과하게 돌지 않는지**를 함께 본다. 밀지 않기로 한 색까지 바뀌면
 * 테마를 고른 근거가 무너진다 — 우리가 잰 것은 그 테마의 색이지 우리가 만든 색이 아니다.
 */

/** 그 코드에서 글자가 `content`인 토큰. 없으면 시나리오가 낡은 것이라 알린다 */
const tokenOf = (code: string, lang: string, content: string): CodeToken => {
  const found = highlightCode(code, lang)
    .flat()
    .find((token) => token.content === content);

  if (found === undefined) {
    throw new Error(`토큰 「${content}」이 없다. 문법이나 테마가 바뀌었다`);
  }

  return found;
};

/* 넷을 각각 밟는 최소 코드 */
const TYPE_NAME = 'interface Box { size: number }';
const NUMBER = 'const n = 42';
const TAG = '<a href="/x">v</a>';

describe('highlightCode — 밀어놓은 색', () => {
  it('타입 이름의 라이트를 민다', () => {
    expect(tokenOf(TYPE_NAME, 'ts', 'number').light).toBe('#247992');
  });

  it('숫자의 라이트를 민다', () => {
    expect(tokenOf(NUMBER, 'ts', '42').light).toBe('#098054');
  });

  it('속성 이름의 라이트를 민다', () => {
    expect(tokenOf(TAG, 'html', 'href').light).toBe('#E10000');
  });

  it('태그 꺾쇠의 다크를 민다', () => {
    expect(tokenOf(TAG, 'html', '<').dark).toBe('#868686');
  });
});

describe('highlightCode — 밀지 않은 색은 그대로다', () => {
  it('한 토큰에서 민 대역만 바뀐다', () => {
    // `<`는 다크만 미달이었다. 라이트까지 손대면 테마의 색이 아니게 된다
    expect(tokenOf(TAG, 'html', '<').light).toBe('#800000');

    // 타입 이름은 라이트만 미달이었다
    expect(tokenOf(TYPE_NAME, 'ts', 'number').dark).toBe('#4EC9B0');
  });

  it('숫자의 다크는 테마의 값 그대로다', () => {
    expect(tokenOf(NUMBER, 'ts', '42').dark).toBe('#B5CEA8');
  });

  it('예약어는 두 대역 모두 그대로다', () => {
    const keyword = tokenOf(NUMBER, 'ts', 'const');

    expect(keyword.light).toBe('#0000FF');
    expect(keyword.dark).toBe('#569CD6');
  });

  it('속성 이름의 다크는 그대로다', () => {
    expect(tokenOf(TAG, 'html', 'href').dark).toBe('#9CDCFE');
  });
});

describe('highlightCode — 민 색의 원래 값이 남아 있지 않다', () => {
  /** 치환 전 값. 하나라도 출력에 남으면 그 자리는 4.5:1을 넘지 못한다 */
  const BEFORE_LIGHT = ['#267F99', '#098658', '#E50000'];
  const BEFORE_DARK = ['#808080'];

  it.each([
    ['타입 이름', TYPE_NAME, 'ts'],
    ['숫자', NUMBER, 'ts'],
    ['태그', TAG, 'html'],
  ])('%s 코드 어디에도 원래 값이 없다', (_name, code, lang) => {
    const tokens = highlightCode(code, lang).flat();

    expect(tokens.filter((token) => BEFORE_LIGHT.includes(token.light))).toEqual([]);
    expect(tokens.filter((token) => BEFORE_DARK.includes(token.dark))).toEqual([]);
  });
});
