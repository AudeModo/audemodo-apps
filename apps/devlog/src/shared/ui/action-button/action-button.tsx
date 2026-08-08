import type { ReactElement, ReactNode } from 'react';

import styles from './action-button.module.css';

interface ActionButtonProps {
  /** `solid`가 강조다. 한 화면에 하나만 둔다. */
  variant: 'solid' | 'outline';
  onClick: () => void;
  children: ReactNode;
}

/**
 * 화면의 행동 버튼.
 *
 * 래퍼가 버튼을 내보내지 않아 앱이 소유한다. 두 자리(빈 상태의 행동 · 더 보기)에서
 * 같은 형태로 쓰이므로 여기에 한 번만 둔다.
 */
export const ActionButton = ({ variant, onClick, children }: ActionButtonProps): ReactElement => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} type="button">
      {children}
    </button>
  );
};
