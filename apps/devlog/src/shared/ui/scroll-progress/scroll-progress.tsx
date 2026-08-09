'use client';

import type { ReactElement } from 'react';

import { useSyncExternalStore } from 'react';

import styles from './scroll-progress.module.css';

const subscribe = (onChange: () => void): (() => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
};

/** 0에서 1. 문서가 화면보다 짧으면 진행이라는 말이 성립하지 않으므로 0이다 */
const getRatio = (): number => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  return scrollable <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / scrollable));
};

const getServerRatio = (): number => 0;

/**
 * 읽은 만큼 차는 바.
 *
 * 스크롤 위치는 React 바깥에 있다. 상태로 복제하면 브라우저가 복원한 스크롤 위치와
 * 첫 렌더가 어긋나므로, 문서를 진실로 두고 구독해서 읽는다.
 */
export const ScrollProgress = (): ReactElement => {
  const ratio = useSyncExternalStore(subscribe, getRatio, getServerRatio);

  return (
    <div aria-hidden className={styles.track}>
      <div className={styles.bar} style={{ transform: `scaleX(${String(ratio)})` }} />
    </div>
  );
};
