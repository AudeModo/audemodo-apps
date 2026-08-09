import type { ReactElement, ReactNode } from 'react';

import { IconAlertTriangle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons-react';

import styles from './callout.module.css';

/** 정보 · 주의 · 정리 · 오류 */
export type CalloutKind = 'info' | 'warn' | 'done' | 'error';

const GLYPHS = {
  info: IconInfoCircle,
  warn: IconAlertTriangle,
  done: IconCheck,
  error: IconX,
} as const;

interface CalloutProps {
  kind: CalloutKind;
  children: ReactNode;
}

/**
 * 본문 옆에 세우는 곁말.
 *
 * 글리프는 종류를 한 번 더 말할 뿐이라 낭독기에서 빼둔다 — 색을 못 보는 사람에게는
 * 글의 내용이 종류를 말해야 하고, 글리프가 그 일을 대신하지는 못한다.
 */
export const Callout = ({ kind, children }: CalloutProps): ReactElement => {
  const Glyph = GLYPHS[kind];

  return (
    <div className={styles.callout} data-kind={kind}>
      <span className={styles.glyph}>
        <Glyph aria-hidden size={15} />
      </span>

      <div className={styles.body}>{children}</div>
    </div>
  );
};
