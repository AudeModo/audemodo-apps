import { describe, expect, it } from 'vitest';

import type { AxisKey } from '@/shared/config';

import { parseAxisSelection } from './parse-axis-selection';

/**
 * 검증용 어휘.
 *
 * 실제 AXIS_VALUES를 쓰지 않는 이유: 여기서 확인하는 것은 「선언된 값만 통과시킨다」는
 * 규칙이지 지금 무엇이 선언되어 있는가가 아니다. 실제 어휘에 걸어두면 값을 하나
 * 더하거나 뺄 때마다 규칙은 그대로인데 검증이 깨진다.
 *
 * `stack`은 일부러 비워 둔다. 어휘를 아직 정하지 않은 축을 나타낸다.
 */
const VOCABULARY: Record<AxisKey, readonly string[]> = {
  kind: ['회고', '학습'],
  project: ['devlog'],
  track: ['FE', 'BE'],
  stack: [],
  tag: ['FSD'],
};

/** 쿼리 문자열 하나를 검증용 어휘로 읽힌다 */
const parse = (query: string) => parseAxisSelection(new URLSearchParams(query), VOCABULARY);

describe('parseAxisSelection', () => {
  it('쿼리가 없으면 아무 축도 고르지 않은 것이다', () => {
    expect(parse('')).toEqual({});
  });

  it('어휘에 있는 값을 축 선택으로 읽는다', () => {
    expect(parse('kind=회고')).toEqual({ kind: ['회고'] });
  });

  it('한 축의 여러 값은 쉼표로 읽는다', () => {
    expect(parse('kind=회고,학습')).toEqual({ kind: ['회고', '학습'] });
  });

  it('여러 축을 함께 읽는다', () => {
    expect(parse('kind=회고&track=FE')).toEqual({ kind: ['회고'], track: ['FE'] });
  });

  it('같은 값이 두 번 오면 한 번만 남긴다', () => {
    // 칩이 두 개 생기면 하나를 지워도 남은 하나가 계속 거른다
    expect(parse('kind=회고,회고')).toEqual({ kind: ['회고'] });
  });

  it('어휘에 없는 값은 버린다', () => {
    // 낡은 링크나 손으로 고친 URL이 아무 글도 만나지 못하는 칩을 만들면 안 된다
    expect(parse('kind=없는값')).toEqual({});
  });

  it('어휘에 있는 값과 없는 값이 섞이면 있는 것만 남긴다', () => {
    expect(parse('kind=없는값,학습')).toEqual({ kind: ['학습'] });
  });

  it('값이 비면 그 축은 만들지 않는다', () => {
    expect(parse('kind=')).toEqual({});
  });

  it('축이 아닌 키는 무시한다', () => {
    expect(parse('sort=oldest&kind=학습')).toEqual({ kind: ['학습'] });
  });

  it('어휘가 비어 있는 축은 무엇이 와도 고르지 않는다', () => {
    // 어휘를 아직 정하지 않은 축은 화면에 나오지 않는다.
    // 화면에 없는 축이 URL로만 열리면 지울 수 없는 필터가 걸린 상태가 된다.
    expect(parse('stack=TypeScript')).toEqual({});
  });

  it('어휘가 비어 있는 축은 다른 축의 선택을 막지 않는다', () => {
    expect(parse('stack=TypeScript&kind=학습')).toEqual({ kind: ['학습'] });
  });

  it('아직 한 편도 쓰이지 않은 값도 어휘에 있으면 읽는다', () => {
    // 축의 가능한 값과 실제 쓰인 값은 다른 개념이다.
    // 「아직 안 썼다」를 보여주려면 그 조합에 URL로 닿을 수 있어야 한다.
    expect(parse('track=BE')).toEqual({ track: ['BE'] });
  });
});
