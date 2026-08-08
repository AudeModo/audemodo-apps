'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import type { PostSummary } from '@/entities/post';

import type { AxisKey, AxisSelection } from '@/shared/config';
import { AXIS_KEYS, AXIS_VALUES } from '@/shared/config';
import type { FacetOption } from '@/shared/lib';
import { countFacets, findCulpritAxis } from '@/shared/lib';

import { filterPosts } from './filter-posts';
import { parseAxisSelection } from './parse-axis-selection';

/** 초기 노출 편수이자 증분. 둘을 같은 값으로 둔다 */
const PAGE = 10;

/** 축 이름은 화면에 쓰는 말이라 어휘와 따로 둔다 */
const AXIS_LABELS: Record<AxisKey, string> = {
  kind: '성격',
  project: '프로젝트',
  track: '직무',
  stack: '스택',
  tag: '태그',
};

/** 축 버튼 하나가 그리는 데 필요한 것 */
export interface AxisView {
  key: AxisKey;
  label: string;
  options: FacetOption[];
  /** 이 축에서 고른 개수. 0이면 배지를 그리지 않는다 */
  pickedCount: number;
}

/** 활성 필터 스트립의 칩 하나 */
export interface FilterChip {
  key: AxisKey;
  value: string;
}

interface PostFilters {
  results: PostSummary[];
  shown: PostSummary[];
  hasMore: boolean;
  remaining: number;
  showMore: () => void;
  axes: AxisView[];
  chips: FilterChip[];
  /** 결과가 0일 때 빼자고 권할 축. 없으면 null */
  culprit: AxisKey | null;
  /** 그 축에서 고른 값들. 빈 상태 문구를 조립하는 데 쓴다 */
  culpritValues: string[];
  toggleValue: (key: AxisKey, value: string) => void;
  clearAxis: (key: AxisKey) => void;
  clearAll: () => void;
}

/**
 * 글 목록의 필터 계산과 이동.
 *
 * 선택은 URL이 진실이다 — 여기서 따로 들고 있지 않고 쿼리에서 읽는다.
 * 공유·북마크·뒤로 가기가 그냥 따라온다.
 *
 * 거르는 일은 브라우저에서 한다. 글은 전부 빌드에 들어가 있어 서버에 물어볼 것이 없고,
 * 목록을 서버로 옮기는 순간 「정적으로는 안 되는 일」의 경계가 흐려진다.
 */
export const usePostFilters = (posts: PostSummary[]): PostFilters => {
  const router = useRouter();
  const params = useSearchParams();

  const selection = useMemo(() => parseAxisSelection(params), [params]);
  const results = useMemo(() => filterPosts(posts, selection), [posts, selection]);

  /*
   * 필터가 바뀌면 노출 편수를 초기값으로 되돌린다.
   * 렌더 중에 맞추는 이유는, effect로 미루면 새 필터의 결과가 옛 편수로 한 번 그려진 뒤
   * 다시 그려지기 때문이다.
   */
  const signature = AXIS_KEYS.map((key) => (selection[key] ?? []).join(',')).join('|');
  const [visible, setVisible] = useState(PAGE);
  const [lastSignature, setLastSignature] = useState(signature);

  if (signature !== lastSignature) {
    setLastSignature(signature);
    setVisible(PAGE);
  }

  const axes = useMemo(
    () =>
      AXIS_KEYS.filter((key) => AXIS_VALUES[key].length > 0).map((key) => ({
        key,
        label: AXIS_LABELS[key],
        options: countFacets(posts, AXIS_KEYS, selection, key, AXIS_VALUES[key]),
        pickedCount: (selection[key] ?? []).length,
      })),
    [posts, selection],
  );

  const chips = useMemo(
    () => AXIS_KEYS.flatMap((key) => (selection[key] ?? []).map((value) => ({ key, value }))),
    [selection],
  );

  const culprit = useMemo(
    () => (results.length === 0 ? findCulpritAxis(posts, AXIS_KEYS, selection) : null),
    [posts, selection, results.length],
  );

  const navigate = useCallback(
    (next: AxisSelection) => {
      const query = new URLSearchParams();

      for (const key of AXIS_KEYS) {
        const values = next[key] ?? [];

        if (values.length > 0) {
          query.set(key, values.join(','));
        }
      }

      const search = query.toString();

      // 필터를 바꾸는 것은 페이지 이동이 아니다. 스크롤 위치를 유지한다
      router.push(search === '' ? '/posts' : `/posts?${search}`, { scroll: false });
    },
    [router],
  );

  const toggleValue = useCallback(
    (key: AxisKey, value: string) => {
      const picked = selection[key] ?? [];
      const next = picked.includes(value)
        ? picked.filter((item) => item !== value)
        : [...picked, value];

      navigate({ ...selection, [key]: next });
    },
    [navigate, selection],
  );

  const clearAxis = useCallback(
    (key: AxisKey) => {
      navigate({ ...selection, [key]: [] });
    },
    [navigate, selection],
  );

  const clearAll = useCallback(() => {
    navigate({});
  }, [navigate]);

  return {
    results,
    shown: results.slice(0, visible),
    hasMore: results.length > visible,
    remaining: Math.max(0, results.length - visible),
    showMore: () => {
      setVisible((count) => count + PAGE);
    },
    axes,
    chips,
    culprit,
    culpritValues: culprit === null ? [] : [...(selection[culprit] ?? [])],
    toggleValue,
    clearAxis,
    clearAll,
  };
};
