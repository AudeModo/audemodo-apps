// 패싯 카운트와 "가장 많이 살아나는 축"이 이 화면의 두 계산이다.
// 둘 다 문서에 없던 것이고 시안에서 확정했다.

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// widgets/post-filter/model/usePostFilters.ts
import { AXIS_KEYS, AXIS_VALUES } from '@/shared/config/axes';
import type { Post, AxisKey, Selection } from '@/entities/post';

const PAGE = 10;   // 초기 노출 · 증분 둘 다 10

const valuesOf = (post: Post, key: AxisKey): string[] => {
  const v = post[key];
  return Array.isArray(v) ? v : [v];
};

/** skip 축은 제외하고 나머지 축의 선택을 모두 만족하는가 */
const matches = (post: Post, sel: Selection, skip?: AxisKey) =>
  AXIS_KEYS.every(key => {
    if (key === skip) return true;
    const picked = sel[key] ?? [];
    return picked.length === 0 || valuesOf(post, key).some(v => picked.includes(v));
  });

export function usePostFilters(posts: Post[]) {
  const router = useRouter();
  const params = useSearchParams();
  const [visible, setVisible] = useState(PAGE);

  // 필터 상태는 URL이 진실이다 — 공유 가능하고 북마크 가능해야 하며
  // 뒤로 가기가 필터 이력을 따라야 한다.
  const sel: Selection = useMemo(() => {
    const out = {} as Selection;
    for (const key of AXIS_KEYS) {
      const raw = params.get(key);
      out[key] = raw ? raw.split(',') : [];
    }
    return out;
  }, [params]);

  const results = useMemo(() => posts.filter(p => matches(p, sel)), [posts, sel]);

  const axes = useMemo(() => AXIS_KEYS.map(key => {
    // 자기 축을 뺀 나머지 선택을 반영한 모집단
    const base = posts.filter(p => matches(p, sel, key));

    // 축 어휘는 글에서 추출하지 않는다 —
    // 추출하면 0편인 값(BE)이 목록에서 사라져 "아직 안 썼다"를 말할 자리가 없어진다.
    const options = AXIS_VALUES[key].map(value => {
      const count = base.filter(p => valuesOf(p, key).includes(value)).length;
      const checked = (sel[key] ?? []).includes(value);
      return {
        value, count, checked,
        // 결과 0인 값은 지우지 않고 흐리게 둔다
        disabled: !checked && count === 0,
      };
    });

    return { key, options, picked: sel[key] ?? [] };
  }), [posts, sel]);

  // 축을 하나씩 빼봤을 때 결과가 가장 많이 살아나는 축.
  // 하드코딩하지 않는다.
  const culprit = useMemo(() => {
    if (results.length > 0) return null;
    let best = 0;
    let found: AxisKey | null = null;
    for (const key of AXIS_KEYS) {
      if ((sel[key] ?? []).length === 0) continue;
      const n = posts.filter(p => matches(p, { ...sel, [key]: [] })).length;
      if (n > best) { best = n; found = key; }
    }
    return found;
  }, [posts, sel, results.length]);

  const setSel = (next: Selection) => {
    const q = new URLSearchParams();
    for (const key of AXIS_KEYS) {
      if (next[key]?.length) q.set(key, next[key].join(','));
    }
    router.push(q.size ? `/posts?${q}` : '/posts');
    setVisible(PAGE);   // 필터가 바뀌면 노출 편수를 되돌린다
  };

  return {
    results,
    shown: results.slice(0, visible),
    hasMore: results.length > visible,
    remaining: Math.max(0, results.length - visible),
    showMore: () => setVisible(v => v + PAGE),
    total: posts.length,
    axes,
    sel,
    culprit,
    clearAxis: (key: AxisKey) => setSel({ ...sel, [key]: [] }),
    clearAll: () => setSel({} as Selection),
    toggle: (key: AxisKey, value: string) => {
      const cur = sel[key] ?? [];
      setSel({
        ...sel,
        [key]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value],
      });
    },
  };
}
