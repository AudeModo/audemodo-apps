import { describe, expect, it } from 'vitest';

import { countFacets, filterBySelection, findCulpritAxis, matchesSelection } from './facet';

/*
 * 픽스처는 실재하지 않는 어휘로 짠다.
 *
 * 글의 축 이름과 값을 빌려 쓰면 읽는 사람이 그 값이 제품에 있다고 믿는다. 실제로 없는
 * 값이면 그 믿음이 틀리고, 실제로 있는 값이면 이번에는 어휘가 바뀔 때 검증이 따라 흔들린다.
 *
 * 이 파일이 확인하는 것은 도메인을 모르는 계산이다. 축 키도 값도 도형·색으로 두어
 * 그 사실이 픽스처에서 먼저 읽히게 한다.
 */

const KEYS = ['shape', 'color', 'label'] as const;

const record = (shape: string, color: string, label: string[]) => ({ shape, color, label });

/** 이 축들에는 없는 값. 「어휘에는 있지만 0건인 값」 자리에 쓴다 */
const ABSENT_SHAPE = 'triangle';

const CIRCLE_RED = record('circle', 'red', ['one', 'two']);

/** shape: circle 2 · square 1 / color: red 2 · blue 1 / label: one 2 · two 1 · three 1 */
const RECORDS = [CIRCLE_RED, record('circle', 'blue', ['three']), record('square', 'red', ['one'])];

describe('matchesSelection', () => {
  it('고르지 않은 축은 아무것도 거르지 않는다', () => {
    expect(matchesSelection(CIRCLE_RED, KEYS, {})).toBe(true);
  });

  it('한 축 안에서 여러 값을 고르면 그중 하나만 맞아도 통과한다', () => {
    expect(matchesSelection(CIRCLE_RED, KEYS, { shape: ['circle', 'square'] })).toBe(true);
  });

  it('축이 다르면 모두 만족해야 통과한다', () => {
    expect(matchesSelection(CIRCLE_RED, KEYS, { shape: ['circle'], color: ['blue'] })).toBe(false);
  });

  it('배열 축은 원소 중 하나만 맞아도 통과한다', () => {
    expect(matchesSelection(CIRCLE_RED, KEYS, { label: ['two'] })).toBe(true);
  });

  it('skip 축은 선택이 있어도 세지 않는다', () => {
    const selection = { shape: ['square'] } as const;

    expect(matchesSelection(CIRCLE_RED, KEYS, selection)).toBe(false);
    expect(matchesSelection(CIRCLE_RED, KEYS, selection, 'shape')).toBe(true);
  });
});

describe('filterBySelection', () => {
  it('선택이 없으면 전부 남는다', () => {
    expect(filterBySelection(RECORDS, KEYS, {})).toHaveLength(3);
  });

  it('축을 겹쳐 고르면 교집합만 남는다', () => {
    const results = filterBySelection(RECORDS, KEYS, { shape: ['circle'], color: ['red'] });

    expect(results).toEqual([CIRCLE_RED]);
  });
});

describe('countFacets', () => {
  it('선택이 없으면 전체에서 센다', () => {
    const options = countFacets(RECORDS, KEYS, {}, 'shape', ['circle', 'square', ABSENT_SHAPE]);

    expect(options.map((option) => [option.value, option.count])).toEqual([
      ['circle', 2],
      ['square', 1],
      [ABSENT_SHAPE, 0],
    ]);
  });

  it('다른 축의 선택을 반영해 센다', () => {
    const options = countFacets(RECORDS, KEYS, { color: ['red'] }, 'shape', ['circle', 'square']);

    // red는 circle 1 · square 1이다. 전체에서 세면 circle이 2가 되어 거짓말이 된다.
    expect(options.map((option) => option.count)).toEqual([1, 1]);
  });

  it('자기 축의 선택은 카운트에서 제외한다', () => {
    const options = countFacets(RECORDS, KEYS, { shape: ['circle'] }, 'shape', [
      'circle',
      'square',
    ]);

    // circle을 고른 상태에서도 「square를 고르면 1건」이 보여야 한다.
    expect(options.map((option) => option.count)).toEqual([2, 1]);
  });

  it('고른 값은 isChecked로 표시한다', () => {
    const options = countFacets(RECORDS, KEYS, { shape: ['square'] }, 'shape', [
      'circle',
      'square',
    ]);

    expect(options.map((option) => option.isChecked)).toEqual([false, true]);
  });

  it('결과 0인 값은 비활성이지만 목록에서 사라지지 않는다', () => {
    const options = countFacets(RECORDS, KEYS, {}, 'shape', ['circle', ABSENT_SHAPE]);

    expect(options).toHaveLength(2);
    expect(options[1]).toMatchObject({ value: ABSENT_SHAPE, count: 0, isDisabled: true });
  });

  it('이미 고른 값은 0건이 되어도 비활성으로 만들지 않는다', () => {
    // 고른 값을 잠그면 되돌릴 수 없게 된다.
    const options = countFacets(RECORDS, KEYS, { shape: [ABSENT_SHAPE] }, 'label', ['two']);

    expect(options[0]).toMatchObject({ count: 0, isDisabled: true });

    const checked = countFacets(RECORDS, KEYS, { label: ['two'], shape: [ABSENT_SHAPE] }, 'label', [
      'two',
    ]);

    expect(checked[0]).toMatchObject({ isChecked: true, isDisabled: false });
  });
});

describe('findCulpritAxis', () => {
  it('결과가 가장 많이 살아나는 축을 고른다', () => {
    // triangle + red: shape를 빼면 2건, color를 빼면 0건이 살아난다.
    const selection = { shape: [ABSENT_SHAPE], color: ['red'] };

    expect(findCulpritAxis(RECORDS, KEYS, selection)).toBe('shape');
  });

  it('고르지 않은 축은 후보가 아니다', () => {
    expect(findCulpritAxis(RECORDS, KEYS, { shape: [ABSENT_SHAPE] })).toBe('shape');
  });

  it('어느 축을 빼도 살아나지 않으면 null이다', () => {
    // 축을 하나 빼도 여전히 0건이면 특정할 수 없다. 그때는 「필터 해제」만 남는다.
    const selection = { shape: [ABSENT_SHAPE], label: ['nine'] };

    expect(findCulpritAxis(RECORDS, KEYS, selection)).toBeNull();
  });

  it('선택이 없으면 null이다', () => {
    expect(findCulpritAxis(RECORDS, KEYS, {})).toBeNull();
  });
});
