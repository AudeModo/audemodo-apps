import type { ProjectStatusTone } from '../../model/types';
import type { ReactElement } from 'react';

import styles from './status-dot.module.css';

interface StatusDotProps {
  tone: ProjectStatusTone;
}

/**
 * 상태를 나타내는 점.
 *
 * 옆의 라벨이 같은 것을 글자로 말하므로 이 점은 장식이다 — 낭독기에서 뺀다.
 * 색만으로 상태를 말하는 자리가 아니어야 색을 못 보는 사람도 같은 것을 읽는다.
 */
export const StatusDot = ({ tone }: StatusDotProps): ReactElement => {
  return <span aria-hidden className={styles.dot} data-tone={tone} />;
};
