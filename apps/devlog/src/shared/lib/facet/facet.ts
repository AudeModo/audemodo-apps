/**
 * 다축 필터의 두 계산 — 패싯 카운트와 「가장 많이 살아나는 축」.
 *
 * 도메인을 모르게 축 키를 제네릭으로 둔다. 글이 아닌 것(프로젝트 · 시리즈)에도
 * 같은 계산이 필요해지면 이 파일을 그대로 쓴다.
 */

/** 한 축이 가질 수 있는 값. 단일 값과 여러 값을 한 갈래로 다룬다. */
type FacetRecord<K extends string> = Readonly<Record<K, string | readonly string[]>>;

/** 축별로 고른 값 */
type FacetSelection<K extends string> = Readonly<Partial<Record<K, readonly string[]>>>;

/** 한 축의 옵션 하나 */
export interface FacetOption {
  value: string;
  /** 이 값을 고르면 남을 결과 수 */
  count: number;
  isChecked: boolean;
  /** 결과 0인 값. 지우지 않고 흐리게 둔다 */
  isDisabled: boolean;
}

/** 항목이 그 축에서 가진 값들 */
const valuesOf = <K extends string>(record: FacetRecord<K>, key: K): readonly string[] => {
  const value = record[key];

  return typeof value === 'string' ? [value] : value;
};

/**
 * skip 축은 빼고, 나머지 축의 선택을 모두 만족하는가.
 *
 * 고르지 않은 축은 아무것도 거르지 않는다. 축 안에서는 OR, 축 사이에서는 AND다.
 */
export const matchesSelection = <K extends string>(
  record: FacetRecord<K>,
  keys: readonly K[],
  selection: FacetSelection<K>,
  skip?: K,
): boolean =>
  keys.every((key) => {
    if (key === skip) {
      return true;
    }

    const picked = selection[key] ?? [];

    return picked.length === 0 || valuesOf(record, key).some((value) => picked.includes(value));
  });

/** 선택을 모두 만족하는 항목만 남긴다. 항목의 원래 타입을 그대로 돌려준다. */
export const filterBySelection = <K extends string, T extends FacetRecord<K>>(
  records: readonly T[],
  keys: readonly K[],
  selection: FacetSelection<K>,
): T[] => records.filter((record) => matchesSelection(record, keys, selection));

/**
 * 한 축의 옵션과 카운트.
 *
 * 카운트는 **다른 축의 현재 선택을 반영한** 결과 수다. 자기 축은 세는 대상에서 뺀다.
 * 이래야 「이걸 고르면 몇 편이 되는가」가 맞는다. 전체 코퍼스 기준으로 세면 거짓말이 된다.
 */
export const countFacets = <K extends string>(
  records: readonly FacetRecord<K>[],
  keys: readonly K[],
  selection: FacetSelection<K>,
  key: K,
  vocabulary: readonly string[],
): FacetOption[] => {
  const base = records.filter((record) => matchesSelection(record, keys, selection, key));
  const picked = selection[key] ?? [];

  return vocabulary.map((value) => {
    const count = base.filter((record) => valuesOf(record, key).includes(value)).length;
    const isChecked = picked.includes(value);

    return { value, count, isChecked, isDisabled: !isChecked && count === 0 };
  });
};

/**
 * 축 하나를 뺐을 때 결과가 가장 많이 살아나는 축.
 *
 * 어느 축을 빼자고 권할지는 계산으로 정한다. 하드코딩하면 조합이 바뀌는 순간 틀린 말을 한다.
 * 축을 특정할 수 없으면 null이고, 그때는 「필터 해제」가 유일한 행동이 된다.
 *
 * 한 축을 빈 값으로 두는 것과 그 축을 세지 않는 것은 같은 결과다 — matchesSelection의
 * skip을 그대로 쓴다.
 */
export const findCulpritAxis = <K extends string>(
  records: readonly FacetRecord<K>[],
  keys: readonly K[],
  selection: FacetSelection<K>,
): K | null => {
  let best = 0;
  let culprit: K | null = null;

  for (const key of keys) {
    if ((selection[key] ?? []).length === 0) {
      continue;
    }

    const survivors = records.filter((record) =>
      matchesSelection(record, keys, selection, key),
    ).length;

    if (survivors > best) {
      best = survivors;
      culprit = key;
    }
  }

  return culprit;
};
