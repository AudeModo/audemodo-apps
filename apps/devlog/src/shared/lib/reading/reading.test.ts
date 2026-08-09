import { describe, expect, it } from 'vitest';

import { readingTime } from './reading';

describe('readingTime', () => {
  it('500자를 1분으로 센다', () => {
    expect(readingTime('가'.repeat(500))).toBe(1);
  });

  it('한 글자만 넘어도 다음 분으로 올린다', () => {
    // 내림하면 999자가 1분이 되어 절반을 숨긴다
    expect(readingTime('가'.repeat(501))).toBe(2);
  });

  it('6000자면 12분이다', () => {
    expect(readingTime('가'.repeat(6000))).toBe(12);
  });

  it('짧은 글도 0분이 되지 않는다', () => {
    expect(readingTime('한 줄.')).toBe(1);
  });

  it('빈 글도 1분이다', () => {
    // 0분이라고 적으면 읽을 것이 없다는 뜻으로 읽힌다
    expect(readingTime('')).toBe(1);
  });
});
