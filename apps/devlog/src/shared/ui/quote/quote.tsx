import type { ReactElement, ReactNode } from 'react';

import styles from './quote.module.css';

interface QuoteProps {
  children: ReactNode;
}

/** 인용. 목소리가 바뀌는 자리다 */
export const Quote = ({ children }: QuoteProps): ReactElement => {
  return <blockquote className={styles.quote}>{children}</blockquote>;
};
