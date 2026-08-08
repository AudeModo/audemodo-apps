import { describe, expect, it } from 'vitest';

import { countFacets, filterBySelection, findCulpritAxis, matchesSelection } from './facet';

const KEYS = ['kind', 'track', 'stack'] as const;

const record = (kind: string, track: string, stack: string[]) => ({ kind, track, stack });

/** 회고 · FE · TypeScript + React */
const RETRO_FE = record('회고', 'FE', ['TypeScript', 'React']);

/** 회고 2편(FE 1 · 인프라 1) · 학습 1편(FE) */
const RECORDS = [
  RETRO_FE,
  record('회고', '인프라', ['PostgreSQL']),
  record('학습', 'FE', ['TypeScript']),
];

describe('matchesSelection', () => {
  it('고르지 않은 축은 아무것도 거르지 않는다', () => {
    expect(matchesSelection(RETRO_FE, KEYS, {})).toBe(true);
  });

  it('한 축 안에서 여러 값을 고르면 그중 하나만 맞아도 통과한다', () => {
    expect(matchesSelection(RETRO_FE, KEYS, { kind: ['회고', '학습'] })).toBe(true);
  });

  it('축이 다르면 모두 만족해야 통과한다', () => {
    expect(matchesSelection(RETRO_FE, KEYS, { kind: ['회고'], track: ['인프라'] })).toBe(false);
  });

  it('배열 축은 원소 중 하나만 맞아도 통과한다', () => {
    expect(matchesSelection(RETRO_FE, KEYS, { stack: ['React'] })).toBe(true);
  });

  it('skip 축은 선택이 있어도 세지 않는다', () => {
    const selection = { kind: ['학습'] } as const;

    expect(matchesSelection(RETRO_FE, KEYS, selection)).toBe(false);
    expect(matchesSelection(RETRO_FE, KEYS, selection, 'kind')).toBe(true);
  });
});

describe('filterBySelection', () => {
  it('선택이 없으면 전부 남는다', () => {
    expect(filterBySelection(RECORDS, KEYS, {})).toHaveLength(3);
  });

  it('축을 겹쳐 고르면 교집합만 남는다', () => {
    const results = filterBySelection(RECORDS, KEYS, { kind: ['회고'], track: ['FE'] });

    expect(results).toEqual([RECORDS[0]]);
  });
});

describe('countFacets', () => {
  it('선택이 없으면 전체에서 센다', () => {
    const options = countFacets(RECORDS, KEYS, {}, 'kind', ['회고', '학습', '예비']);

    expect(options.map((option) => [option.value, option.count])).toEqual([
      ['회고', 2],
      ['학습', 1],
      ['예비', 0],
    ]);
  });

  it('다른 축의 선택을 반영해 센다', () => {
    const options = countFacets(RECORDS, KEYS, { track: ['FE'] }, 'kind', ['회고', '학습']);

    // FE는 회고 1편 · 학습 1편이다. 전체 코퍼스로 세면 회고가 2가 되어 거짓말이 된다.
    expect(options.map((option) => option.count)).toEqual([1, 1]);
  });

  it('자기 축의 선택은 카운트에서 제외한다', () => {
    const options = countFacets(RECORDS, KEYS, { kind: ['회고'] }, 'kind', ['회고', '학습']);

    // 회고를 고른 상태에서도 「학습을 고르면 1편」이 보여야 한다.
    expect(options.map((option) => option.count)).toEqual([2, 1]);
  });

  it('고른 값은 isChecked로 표시한다', () => {
    const options = countFacets(RECORDS, KEYS, { kind: ['학습'] }, 'kind', ['회고', '학습']);

    expect(options.map((option) => option.isChecked)).toEqual([false, true]);
  });

  it('결과 0인 값은 비활성이지만 목록에서 사라지지 않는다', () => {
    const options = countFacets(RECORDS, KEYS, {}, 'kind', ['회고', '예비']);

    expect(options).toHaveLength(2);
    expect(options[1]).toMatchObject({ value: '예비', count: 0, isDisabled: true });
  });

  it('이미 고른 값은 0편이 되어도 비활성으로 만들지 않는다', () => {
    // 고른 값을 잠그면 되돌릴 수 없게 된다.
    const options = countFacets(RECORDS, KEYS, { kind: ['예비'] }, 'stack', ['React']);

    expect(options[0]).toMatchObject({ count: 0, isDisabled: true });

    const checked = countFacets(RECORDS, KEYS, { stack: ['React'], kind: ['예비'] }, 'stack', [
      'React',
    ]);

    expect(checked[0]).toMatchObject({ isChecked: true, isDisabled: false });
  });
});

describe('findCulpritAxis', () => {
  it('결과가 가장 많이 살아나는 축을 고른다', () => {
    // 예비 + FE: 예비를 빼면 2편, FE를 빼면 0편이 살아난다.
    const culprit = findCulpritAxis(RECORDS, KEYS, { kind: ['예비'], track: ['FE'] });

    expect(culprit).toBe('kind');
  });

  it('고르지 않은 축은 후보가 아니다', () => {
    expect(findCulpritAxis(RECORDS, KEYS, { kind: ['예비'] })).toBe('kind');
  });

  it('어느 축을 빼도 살아나지 않으면 null이다', () => {
    // 축을 하나 빼도 여전히 0편이면 특정할 수 없다. 그때는 「필터 해제」만 남는다.
    const culprit = findCulpritAxis(RECORDS, KEYS, { kind: ['예비'], stack: ['Playwright'] });

    expect(culprit).toBeNull();
  });

  it('선택이 없으면 null이다', () => {
    expect(findCulpritAxis(RECORDS, KEYS, {})).toBeNull();
  });
});
