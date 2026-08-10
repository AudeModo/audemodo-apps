import type { Metadata } from 'next';

import { About } from '@/_pages/about';

export const metadata: Metadata = {
  title: '소개',
  description: '프론트엔드로 시작해 양쪽을 다 설명할 수 있는 사람이 되려고 한다.',
};

/** 소개 페이지 */
export default function Page() {
  return <About />;
}
