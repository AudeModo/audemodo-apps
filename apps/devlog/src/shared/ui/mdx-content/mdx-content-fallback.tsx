import type { ReactElement } from 'react';

/** MDX 파싱 실패 시, Fallback */
export const MdxContentFallback = (): ReactElement => {
  return <p role="alert">본문을 불러오지 못했습니다.</p>;
};
