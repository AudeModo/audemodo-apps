import type { ReactElement } from 'react';

import { MDXRemote } from 'next-mdx-remote-client/rsc';
import { Suspense } from 'react';

interface MdxContentProps {
  /** frontmatter를 제거한 MDX 본문 문자열 */
  source: string;
}

/** MDX 렌더 실패 시 대체 표시. 서버 컴포넌트라 사용자에겐 일반 메시지만 보인다. */
const MdxRenderError = (): ReactElement => {
  return <p role="alert">본문을 불러오지 못했습니다.</p>;
};

/**
 * MDX 본문 문자열을 서버에서 렌더한다. 파싱 실패 시 onError로 대체한다.
 * next-mdx-remote-client/rsc의 MDXRemote는 async 서버 컴포넌트라 Suspense로 감싸야 한다.
 */
export const MdxContent = ({ source }: MdxContentProps): ReactElement => {
  return (
    <Suspense>
      <MDXRemote source={source} onError={MdxRenderError} />
    </Suspense>
  );
};
