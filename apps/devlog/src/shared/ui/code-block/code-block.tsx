'use client';

import type { CSSProperties, ReactElement } from 'react';

import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useState } from 'react';

import styles from './code-block.module.css';

/** 한 토큰. 글자와 두 대역의 색만 남긴다 */
export interface CodeToken {
  content: string;
  light: string;
  dark: string;
}

interface CodeBlockProps {
  /** 복사 단추가 클립보드에 넣는 원문 */
  code: string;
  /** 줄 × 토큰. 빌드 때 색이 매겨져 내려온다 */
  lines: CodeToken[][];
  /** 헤더에 적을 파일명. 없으면 헤더도 없다 */
  title: string | null;
  /** 1부터 세는 강조할 줄 번호 */
  highlighted: number[];
}

/**
 * 토큰 하나의 색.
 *
 * 두 대역을 함께 싣고 어느 쪽을 쓸지는 CSS가 정한다. 색이 없는 토큰(평문 · 공백)은
 * 속성도 달지 않는다 — 빈 값을 달면 CSS가 그것을 색으로 받아 글자가 사라진다.
 */
/** 그 줄의 글자만. 빈 줄인지 보고 키를 만드는 데 쓴다 */
const textOf = (line: CodeToken[]): string => line.map((token) => token.content).join('');

const toneOf = (token: CodeToken): CSSProperties | undefined =>
  token.light === ''
    ? undefined
    : ({ '--shiki-light': token.light, '--shiki-dark': token.dark } as CSSProperties);

/**
 * 코드블록.
 *
 * 복사가 필요해 클라이언트 경계를 가진다 — 코드를 눈으로 옮겨 적게 두면
 * 글에 코드를 싣는 의미가 절반으로 준다.
 *
 * 하이라이팅은 여기서 하지 않는다. 빌드 때 매겨진 토큰을 받기만 한다 —
 * 하이라이터가 이 경계를 넘으면 읽는 사람이 문법 정의를 통째로 내려받는다.
 */
export const CodeBlock = ({ code, lines, title, highlighted }: CodeBlockProps): ReactElement => {
  const [isCopied, setIsCopied] = useState(false);

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
              key={`${String(index)}:${textOf(line)}`}
            >
              {textOf(line) === ''
                ? ' '
                : line.map((token, tokenIndex) => (
                    <span key={`${String(tokenIndex)}:${token.content}`} style={toneOf(token)}>
                      {token.content}
                    </span>
                  ))}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
};
