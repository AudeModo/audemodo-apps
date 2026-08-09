'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * 소제목이 「지금 읽는 곳」으로 바뀌는 높이.
 *
 * 화면 맨 위가 아니라 조금 아래로 잡는다 — 제목이 화면 꼭대기에 닿는 순간 바뀌면
 * 아직 앞 절을 읽고 있는데 목차가 먼저 넘어간다.
 */
const ACTIVE_LINE = 120;

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
};

/**
 * 지금 읽고 있는 소제목.
 *
 * 기준선을 지난 것 중 마지막을 고른다. 화면에 걸친 것을 전부 세면 절이 짧을 때
 * 여러 개가 동시에 활성이 되고, 첫 번째만 세면 절 하나를 다 읽어도 바뀌지 않는다.
 *
 * 아직 아무것도 지나지 않았으면 첫 소제목이다 — 글 맨 위에서 목차가 비어 보이면
 * 어디에서 시작하는지 알 수 없다.
 */
export const useActiveHeading = (ids: readonly string[]): string | null => {
  const key = ids.join('|');

  const getSnapshot = useCallback((): string | null => {
    const all = key === '' ? [] : key.split('|');
    let active = all[0] ?? null;

    for (const id of all) {
      const element = document.getElementById(id);

      if (element !== null && element.getBoundingClientRect().top <= ACTIVE_LINE) {
        active = id;
      }
    }

    return active;
  }, [key]);

  const getServerSnapshot = useCallback((): string | null => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
