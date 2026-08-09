import type { ReactElement, ReactNode } from 'react';

import styles from './highlight.module.css';

interface HighlightProps {
  /** 둘째 색. 한 문단에서 두 갈래를 갈라 표시할 때 쓴다 */
  alt?: boolean;
  children: ReactNode;
}

/**
 * 형광펜.
 *
 * 마크다운 문법(`==...==`) 대신 컴포넌트인 이유는 글자색을 명시해야 하기 때문이다.
 * 문법으로는 `<mark>`만 나오고 그 안에 색을 실을 자리가 없다.
 */
export const Highlight = ({ alt = false, children }: HighlightProps): ReactElement => {
  return (
    <mark className={styles.highlight} data-alt={alt}>
      {children}
    </mark>
  );
};
