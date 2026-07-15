import type { ReactElement } from 'react';

import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { Suspense } from 'react';

import { MdxContentFallback } from './mdx-content-fallback';

interface MdxContentProps {
  /** frontmatter를 제거한 MDX 본문 문자열 */
  source: string;
}

/** MDX 본문 문자열을 렌더 결과. 파신 실패 시, Fallback으로 대체. */
export const MdxContent = ({ source }: MdxContentProps): ReactElement => {
  return (
    <Suspense>
      <MDXRemote source={source} onError={MdxContentFallback} />
    </Suspense>
  );
};
