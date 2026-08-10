import { describe, expect, it } from 'vitest';

import { toKoreanCount } from './korean-number';

describe('toKoreanCount', () => {
  it('낱개는 단위 앞에 서는 꼴로 적는다', () => {
    // 「하나 개」가 아니라 「한 개」다
    expect([1, 2, 3, 4].map(toKoreanCount)).toEqual(['한', '두', '세', '네']);
  });

  it('다섯부터 아홉까지는 꼴이 바뀌지 않는다', () => {
    expect([5, 6, 7, 8, 9].map(toKoreanCount)).toEqual(['다섯', '여섯', '일곱', '여덟', '아홉']);
  });

  it('열의 자리가 홀로 서면 스무가 된다', () => {
    // 「스물 개」가 아니라 「스무 개」다
    expect([10, 20, 30, 40].map(toKoreanCount)).toEqual(['열', '스무', '서른', '마흔']);
  });

  it('낱개가 붙으면 스물로 돌아온다', () => {
    expect([21, 22, 25].map(toKoreanCount)).toEqual(['스물한', '스물두', '스물다섯']);
  });

  it('서른네 편이 나온다', () => {
    // 시안의 문장이 요구하는 꼴이다
    expect(toKoreanCount(34)).toBe('서른네');
  });

  it('열의 자리를 이어 붙인다', () => {
    expect([11, 19, 99].map(toKoreanCount)).toEqual(['열한', '열아홉', '아흔아홉']);
  });

  it('백부터는 숫자로 둔다', () => {
    // 「백서른네 편」은 문장에서 오히려 읽기 어렵다
    expect(toKoreanCount(100)).toBe('100');
    expect(toKoreanCount(134)).toBe('134');
  });

  it('0은 숫자로 둔다', () => {
    // 「영 편」이라고 쓰는 사람은 없다
    expect(toKoreanCount(0)).toBe('0');
  });

  it('음수와 소수는 그대로 둔다', () => {
    expect(toKoreanCount(-3)).toBe('-3');
    expect(toKoreanCount(1.5)).toBe('1.5');
  });
});
