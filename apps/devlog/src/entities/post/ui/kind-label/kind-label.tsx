import type { PostKind } from '../../model/types';
import type { ReactElement } from 'react';

import { Text } from '@audemodo/design-system';

import styles from './kind-label.module.css';

interface KindLabelProps {
  kind: PostKind;
}

/**
 * 글의 성격 라벨.
 *
 * 색은 kind가 정하는데 래퍼의 color 프롭은 닫힌 열거형이라 분류 색을 표현하지 못한다.
 * 그래서 색과 자간은 이 컴포넌트가 소유한 엘리먼트가 토큰으로 칠하고, 글자는
 * `type="inherit"`으로 그 값을 그대로 물려받게 둔다.
 */
export const KindLabel = ({ kind }: KindLabelProps): ReactElement => {
  return (
    <span className={styles.kind} data-kind={kind}>
      <Text color="inherit" type="inherit">
        {kind}
      </Text>
    </span>
  );
};
