import type { ReactElement, ReactNode } from 'react';

import { Heading, Link, Text } from '@audemodo/design-system';

import type { Heading as HeadingEntry } from '@/shared/lib';
import { parseCodeMeta } from '@/shared/lib';
import { Callout, CodeBlock, Details, Highlight, Quote } from '@/shared/ui';

import { highlightCode } from '../../lib/code-highlight';
import styles from './prose.module.css';

/** 번호 배지의 색은 셋을 돌린다. 의미가 아니라 리듬이다 */
const TONES = 3;

/** MDX가 넘겨주는 요소 props 중 우리가 읽는 것만 */
interface MdxProps {
  children?: ReactNode;
  className?: string;
  href?: string;
  src?: string;
  alt?: string;
  'data-meta'?: string;
}

/**
 * 본문에 쓸 컴포넌트 묶음.
 *
 * 소제목 목록을 받아서 만드는 이유: 번호 배지와 앵커가 목차와 같은 목록에서 나와야
 * 한다. 각자 세면 목차의 셋째와 본문의 셋째가 다른 곳을 가리키는 날이 온다.
 */
export const createMdxComponents = (headings: HeadingEntry[]) => {
  const byText = new Map<string, HeadingEntry[]>();

  for (const heading of headings) {
    byText.set(heading.text, [...(byText.get(heading.text) ?? []), heading]);
  }

  // 같은 제목이 여러 번 나오면 나온 순서대로 하나씩 가져간다
  const taken = new Map<string, number>();

  const takeHeading = (text: string): HeadingEntry | undefined => {
    const index = taken.get(text) ?? 0;

    taken.set(text, index + 1);

    return byText.get(text)?.[index];
  };

  return {
    h2: ({ children }: MdxProps): ReactElement => {
      const text = String(children);
      const heading = takeHeading(text);

      return (
        <Heading className={styles.heading} id={heading?.id} level={2}>
          {heading !== undefined && (
            <span className={styles.badge} data-tone={(heading.order - 1) % TONES}>
              {heading.order}
            </span>
          )}
          {children}
        </Heading>
      );
    },

    h3: ({ children }: MdxProps): ReactElement => <Heading level={3}>{children}</Heading>,

    /* 읽기 본문은 17 / 1.75다. 모바일에서도 줄이지 않는다 */
    p: ({ children }: MdxProps): ReactElement => (
      <Text as="p" type="large">
        {children}
      </Text>
    ),

    a: ({ href = '', children }: MdxProps): ReactElement => (
      // 외부는 새 탭이고 ↗가 그 신호다. 내부 이동에는 붙이지 않는다
      <Link href={href} isExternalLink={/^https?:\/\//.test(href)} type="inherit">
        {children}
      </Link>
    ),

    ul: ({ children }: MdxProps): ReactElement => <ul className={styles.list}>{children}</ul>,
    ol: ({ children }: MdxProps): ReactElement => <ol className={styles.list}>{children}</ol>,
    hr: (): ReactElement => <hr className={styles.rule} />,
    blockquote: ({ children }: MdxProps): ReactElement => <Quote>{children}</Quote>,

    /* 울타리는 CodeBlock이 통째로 그린다. pre는 자리만 내준다 */
    pre: ({ children }: MdxProps): ReactNode => children,

    code: ({ className, children, ...rest }: MdxProps): ReactElement => {
      const language = className ?? '';

      if (!language.startsWith('language-')) {
        return <code className={styles.inlineCode}>{children}</code>;
      }

      const meta = parseCodeMeta(rest['data-meta']);
      const code = String(children);

      return (
        <CodeBlock
          code={code}
          highlighted={meta.highlighted}
          lines={highlightCode(code, language.slice('language-'.length))}
          title={meta.title}
        />
      );
    },

    Callout,
    Details,
    Mark: Highlight,
  };
};
