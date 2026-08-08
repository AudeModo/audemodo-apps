import { describe, expect, it } from 'vitest';

import { parseAxisSelection } from './parse-axis-selection';

/** 쿼리 문자열 하나를 그대로 읽힌다 */
const parse = (query: string) => parseAxisSelection(new URLSearchParams(query));

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
    // project · stack · tag는 아직 어휘를 정하지 않았다.
    // 정하기 전까지는 URL로도 그 축에 값이 들어오지 않아야 한다.
    expect(parse('project=devlog&stack=TypeScript&tag=FSD')).toEqual({});
  });

  it('0편인 값도 어휘에 있으면 읽는다', () => {
    // BE는 아직 쓴 글이 0편이지만 축의 값으로는 존재한다.
    // 「아직 안 썼다」를 말하려면 이 조합에 URL로 닿을 수 있어야 한다.
    expect(parse('track=BE')).toEqual({ track: ['BE'] });
  });
});
