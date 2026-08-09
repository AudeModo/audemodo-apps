'use client';

import type { Theme } from '../../lib';
import type { ReactElement } from 'react';

import { IconArrowUp, IconDots, IconMoon, IconSun, IconX } from '@tabler/icons-react';
import { useState, useSyncExternalStore } from 'react';

import { getServerThemeSnapshot, getThemeSnapshot, subscribeTheme, writeTheme } from '../../lib';
import styles from './floating-tools.module.css';

/** 감소 모션을 켠 사람에게는 부드러운 스크롤도 모션이다 */
const scrollToTop = (): void => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
};

/**
 * 전역 도구. 아홉 화면 전부에 있고 도메인을 모른다.
 *
 * 다크 모드를 켜는 유일한 경로가 여기다. `document.documentElement`의 `data-theme`을
 * 바꾸고 선택을 저장한다.
 *
 * 지금 어느 쪽인지는 상태로 복제하지 않고 문서에서 구독해 읽는다. 첫 페인트 전에 도는
 * 스크립트가 이미 문서를 칠해두었을 수 있어, 복제본을 두면 둘이 어긋난다.
 *
 * 펼침은 CSS가 맡고 여기서는 눌러서 여는 것만 다룬다 — 손가락에는 호버가 없다.
 */
export const FloatingTools = (): ReactElement => {
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);

  const theme: Theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const isDark = theme === 'dark';

  const toggleTheme = (): void => {
    writeTheme(isDark ? 'light' : 'dark');
  };

  return (
    <aside aria-label="도구" className={styles.root} data-open={isPinnedOpen}>
      <button
        aria-expanded={isPinnedOpen}
        aria-label={isPinnedOpen ? '도구 닫기' : '도구 열기'}
        className={styles.fab}
        onClick={() => {
          setIsPinnedOpen((open) => !open);
        }}
        type="button"
      >
        <span className={styles.glyphClosed}>
          <IconDots aria-hidden size={20} />
        </span>

        <span className={styles.glyphOpen}>
          <IconX aria-hidden size={20} />
        </span>
      </button>

      {/* 화면에서는 버튼 위에 쌓인다. 마크업 순서는 여는 버튼이 먼저다 */}
      <div className={styles.tools}>
        <button className={styles.pill} onClick={scrollToTop} type="button">
          <IconArrowUp aria-hidden size={16} />맨 위로
        </button>

        <button className={styles.pill} onClick={toggleTheme} type="button">
          {isDark ? <IconSun aria-hidden size={16} /> : <IconMoon aria-hidden size={16} />}
          {isDark ? '라이트 모드' : '다크 모드'}
        </button>
      </div>
    </aside>
  );
};
