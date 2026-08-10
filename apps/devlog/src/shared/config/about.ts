/**
 * 소개 화면의 내용.
 *
 * 연표와 답변은 수기 데이터다 — 자주 바뀌지 않고 계산으로 나오지도 않는다.
 * 화면 컴포넌트가 아니라 여기 모아두는 이유는 고칠 곳을 한 군데로 두기 위해서다.
 *
 * 「구직 중」은 취업하면 거짓이 되는 유일한 값이다. 플래그로 끄고 켤 수 있게 둔다.
 */

export interface CareerEntry {
  /** `YYYY.MM` */
  at: string;
  title: string;
  body: string;
  /** 점 색. 최근이 초록, 이전이 파랑, 시작은 선 색이다 */
  tone: 'recent' | 'past' | 'start';
}

export interface WorkAnswer {
  question: string;
  /** 답의 앞부분 */
  body: string;
  /** 형광펜이 그어지는 핵심 문장 */
  highlight: string;
  /** 형광펜 뒤에 이어지는 말. 없으면 문장이 형광펜으로 끝난다 */
  tail?: string;
  /** 답이 가리키는 실제 경로 — 문서가 말한 연결을 링크로 만든다 */
  link?: { href: string; label: string };
}

/*
 * `as const`를 붙이지 않는다. 붙이면 값이 리터럴로 굳어 `isOpenToWork`를 끄는 순간
 * 조건문이 「항상 참」으로 잡히고, 바뀌라고 둔 값이 바뀔 수 없게 된다.
 * 배열의 모양은 아래에서 satisfies가 지킨다.
 */
export const ABOUT = {
  /** 취업하면 false로. 갱신하지 않으면 거짓이 된다 */
  isOpenToWork: true,
  openToWorkLabel: '구직 중 · 2026년 하반기 합류 가능',

  /** 대괄호 부분만 강조색이 된다 */
  headline: {
    before: '프론트엔드로 시작해 ',
    accent: '양쪽을 다 설명할 수 있는',
    after: ' 사람이 되려고 한다.',
  },

  intro: [
    '화면부터 들어왔다. 버튼이 왜 여기 있어야 하는지 설명할 수 있게 되자, 그 버튼이 부르는 쿼리가 왜 느린지도 설명할 수 있어야 한다는 걸 알았다.',
  ],

  /** 형광펜이 그어지는 문단 — 앞뒤와 강조를 나눠 둔다 */
  introHighlighted: {
    before: '만든 것보다 ',
    highlight: '왜 그렇게 만들었는지를 남기는 편',
    after: '이 나중에 더 쓸모 있었다. 그래서 이 사이트는 전시장이 아니라 작업 기록이다.',
  },

  /** 없으면 「이력서 PDF」 버튼이 나오지 않는다 */
  resumeUrl: undefined as string | undefined,
  /** `YYYY.MM`. 있으면 버튼 옆에 갱신 시점을 적는다 */
  resumeUpdatedAt: undefined as string | undefined,

  careerNote: '경력이 아니라 범위가 넓어진 순서다.',

  career: [
    {
      at: '2026.07',
      title: 'devlog 시작',
      body: '만든 것과 그 판단을 한자리에 두기로 했다. 지금 보고 있는 이 사이트다.',
      tone: 'recent',
    },
    {
      at: '2026.07',
      title: 'Audemodo 시작',
      body: '혼자 굴리는 모노레포에서 경계를 CI가 지키게 만들었다. 지금 가장 시간을 쓰는 곳이다.',
      tone: 'start',
    },
  ] satisfies CareerEntry[],

  /** 실제로 프로젝트에 들어간 것만 적는다. 이름을 아는 것과 쓴 것은 다르다 */
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'StyleX',
    'MDX',
    'pnpm',
    'Turborepo',
    'GitHub Actions',
    'ESLint',
    'Prettier',
    'Vitest',
    'FSD',
  ],

  /** 면접에서 자주 나오는 질문 셋. 지어낸 원칙이 아니라 실제로 지키고 있는 것들이다 */
  answers: [
    {
      question: '기술을 고를 때 무엇을 먼저 보나',
      body: '새 것이 좋아 보여서 고르지 않는다. ',
      highlight: '기존 것으로는 왜 안 되는가에 먼저 답한다',
      tail: '. 답이 안 나오면 고르지 않을 이유가 이미 나온 것이다.',
    },
    {
      question: '혼자 만들 때 품질을 어떻게 지키나',
      body: '규율에 맡기면 바쁠 때 먼저 무너진다. ',
      highlight: '규율 대신 도구로 강제한다',
      tail: '. 경계를 어기면 머지가 막히고, 죽은 코드는 검사기가 먼저 찾는다.',
      link: { href: '/projects/audemodo', label: '핵심 결정 보기' },
    },
    {
      question: '추상화는 언제 하나',
      body: '오지 않은 요구에 맞춘 추상은 대개 틀린다. ',
      highlight: '두 번째 소비자가 생기기 전에는 안 한다',
      tail: '. 틀린 추상을 되돌리는 비용이 중복을 참는 비용보다 크다.',
    },
  ] satisfies WorkAnswer[],
};
