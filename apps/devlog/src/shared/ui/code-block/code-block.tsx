'use client';

import type { ReactElement } from 'react';

import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';

import styles from './code-block.module.css';

interface CodeBlockProps {
  code: string;
  /** 헤더에 적을 파일명. 없으면 헤더도 없다 */
  title: string | null;
  /** 1부터 세는 강조할 줄 번호 */
  highlighted: number[];
}

/**
 * 코드블록.
 *
 * 복사가 필요해 클라이언트 경계를 가진다 — 코드를 눈으로 옮겨 적게 두면
 * 글에 코드를 싣는 의미가 절반으로 준다.
 */
export const CodeBlock = ({ code, title, highlighted }: CodeBlockProps): ReactElement => {
  const [isCopied, setIsCopied] = useState(false);

  // 끝의 개행 하나는 울타리가 남긴 것이라 빈 줄로 세지 않는다
  const lines = code.replace(/\n$/, '').split('\n');
  const marked = new Set(highlighted);

  const copy = (): void => {
    void navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      // 되돌려두지 않으면 다음 복사가 일어났는지 알 수 없다
      setTimeout(() => {
        setIsCopied(false);
      }, 1600);
    });
  };

  const copyButton = (
    <button
      aria-label={isCopied ? '복사됨' : '코드 복사'}
      className={`${styles.copy} ${title === null ? styles.floatingCopy : ''}`}
      onClick={copy}
      type="button"
    >
      {isCopied ? <IconCheck aria-hidden size={14} /> : <IconCopy aria-hidden size={14} />}
      {isCopied ? '복사됨' : '복사'}
    </button>
  );

  return (
    <figure className={styles.block}>
      {title === null ? (
        copyButton
      ) : (
        <figcaption className={styles.head}>
          <span className={styles.name}>{title}</span>
          {copyButton}
        </figcaption>
      )}

      <pre className={styles.pre}>
        <code>
          {lines.map((line, index) => (
            <span
              className={styles.line}
              data-mark={marked.has(index + 1)}
              key={`${String(index)}:${line}`}
            >
              {line === '' ? ' ' : line}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
};
