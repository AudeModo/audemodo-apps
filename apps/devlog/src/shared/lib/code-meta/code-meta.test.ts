import { describe, expect, it } from 'vitest';

import { parseCodeMeta } from './code-meta';

describe('parseCodeMeta', () => {
  it('메타가 없으면 둘 다 비어 있다', () => {
    expect(parseCodeMeta(undefined)).toEqual({ title: null, highlighted: [] });
    expect(parseCodeMeta('')).toEqual({ title: null, highlighted: [] });
  });

  it('파일명을 읽는다', () => {
    expect(parseCodeMeta('title="steiger.config.ts"').title).toBe('steiger.config.ts');
  });

  it('작은따옴표도 읽는다', () => {
    expect(parseCodeMeta("title='knip.json'").title).toBe('knip.json');
  });

  it('빈 파일명은 없는 것으로 다룬다', () => {
    // 빈 헤더 줄만 남으면 코드 위에 정체 모를 띠가 생긴다
    expect(parseCodeMeta('title=""').title).toBeNull();
  });

  it('쉼표로 적은 줄을 읽는다', () => {
    expect(parseCodeMeta('{4,5}').highlighted).toEqual([4, 5]);
  });

  it('범위를 펼친다', () => {
    expect(parseCodeMeta('{2-5}').highlighted).toEqual([2, 3, 4, 5]);
  });

  it('낱개와 범위를 섞어 적을 수 있다', () => {
    expect(parseCodeMeta('{1,4-6,9}').highlighted).toEqual([1, 4, 5, 6, 9]);
  });

  it('거꾸로 적은 범위도 같게 읽는다', () => {
    expect(parseCodeMeta('{6-4}').highlighted).toEqual([4, 5, 6]);
  });

  it('겹치는 줄을 한 번만 센다', () => {
    expect(parseCodeMeta('{3,3,2-4}').highlighted).toEqual([2, 3, 4]);
  });

  it('0과 음수는 버린다', () => {
    // 줄 번호는 1부터다
    expect(parseCodeMeta('{0,2}').highlighted).toEqual([2]);
  });

  it('파일명과 줄을 함께 읽는다', () => {
    expect(parseCodeMeta('title="steiger.config.ts" {4,5}')).toEqual({
      title: 'steiger.config.ts',
      highlighted: [4, 5],
    });
  });

  it('알 수 없는 메타는 무시한다', () => {
    expect(parseCodeMeta('showLineNumbers foo=bar')).toEqual({ title: null, highlighted: [] });
  });
});
