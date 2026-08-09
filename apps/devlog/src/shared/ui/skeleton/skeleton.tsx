import type { ReactElement } from 'react';

import styles from './skeleton.module.css';

interface SkeletonProps {
  /** 숫자는 픽셀, 문자열은 그대로 쓴다 */
  height: number | string;
  width?: number | string;
  /** 채울 자리의 라운드. 도착할 것과 같은 단계를 고른다 */
  radius?: 'inner' | 'element' | 'container' | 'full';
}

/**
 * 아직 오지 않은 것의 자리.
 *
 * 읽히는 내용이 아니라 자리 표시라 접근성 트리에서 빼둔다 — 화면 낭독기에는
 * 의미 없는 빈 상자가 줄줄이 읽히는 것보다 도착한 내용만 읽히는 편이 낫다.
 */
export const Skeleton = ({
  height,
  width = '100%',
  radius = 'inner',
}: SkeletonProps): ReactElement => {
  return (
    <span aria-hidden className={styles.skeleton} data-radius={radius} style={{ height, width }} />
  );
};
