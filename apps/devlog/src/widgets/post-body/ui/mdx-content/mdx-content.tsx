import type { ReactElement } from 'react';

import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { Suspense } from 'react';

import type { Heading } from '@/shared/lib';

import { rehypeCodeMeta } from '../../lib/rehype-code-meta';
import { createMdxComponents } from './mdx-components';
import { MdxContentFallback } from './mdx-content-fallback';
import styles from './prose.module.css';

interface MdxContentProps {
  /** frontmatter를 제거한 MDX 본문 문자열 */
  source: string;
  /** 본문에서 미리 뽑아둔 소제목. 번호 배지와 앵커가 여기서 나온다 */
  headings: Heading[];
}

/** MDX 본문 문자열을 렌더한 결과. 파싱 실패 시 Fallback으로 대체한다 */
export const MdxContent = ({ source, headings }: MdxContentProps): ReactElement => {
  return (
    <div className={styles.prose}>
      <Suspense>
        <MDXRemote
          components={createMdxComponents(headings)}
          onError={MdxContentFallback}
          options={{ mdxOptions: { rehypePlugins: [rehypeCodeMeta] } }}
          source={source}
        />
      </Suspense>
    </div>
  );
};
