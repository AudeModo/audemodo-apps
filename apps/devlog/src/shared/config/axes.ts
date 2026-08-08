/**
 * 글을 좁히는 다섯 축의 어휘.
 *
 * 축의 가능한 값과 실제 쓰인 값은 다른 개념이다. 그래서 이 목록을 글에서 추출하지 않고
 * 여기에 손으로 둔다. 추출하면 0편인 값이 목록에서 사라져 「아직 안 썼다」를 말할 자리가
 * 없어진다 — 감추면 「그건 안 한다」로 읽히고, 흐리게 두면 「아직 안 썼다」로 읽힌다.
 *
 * 새 값이 필요하면 글보다 이 파일을 먼저 고친다.
 */

/**
 * 글의 성격. 하나만 고른다.
 *
 * 회고는 한 일과 그 판단을 돌아보는 것, 트러블슈팅은 막혔던 것,
 * 학습은 새로 배운 것을 정리하는 것이다.
 *
 * 색 문서가 노랑을 「분류 · 예비」로 적어 혼동이 있었으나, 그것은 노랑을 네 번째 분류
 * 자리로 남겨둔다는 뜻이지 「예비」라는 성격이 있다는 말이 아니다. 독자에게 「이 글의
 * 성격은 예비」는 말이 되지 않는다. 네 번째가 실제로 필요해지면 그때 값을 준다.
 */
export const KIND_VALUES = ['회고', '트러블슈팅', '학습'] as const;

/**
 * 글이 다루는 직무. 여러 개 고를 수 있다.
 *
 * FE와 BE는 한글 대응이 없어 그대로 쓰고, 인프라와 디자인은 한글이 자연스럽다.
 * 규칙은 「영문을 안 쓴다」가 아니라 「한글 대응이 있으면 한글을 쓴다」이다.
 */
export const TRACK_VALUES = ['FE', 'BE', '인프라', '디자인'] as const;

/**
 * 글이 속한 프로젝트. 하나만 고른다.
 *
 * 레포 이름이 아니라 프로젝트 이름이다 — `audemodo-apps`는 모노레포이고
 * 그 안의 `devlog`가 프로젝트다.
 */
const PROJECT_VALUES = ['Audemodo', 'devlog', 'design-system', 'eslint-config'] as const;

/**
 * 글이 다루는 기술. 통제 어휘라 새 값은 여기 먼저 추가한다.
 *
 * 표기는 공식 표기를 따른다 — `Next.js`이지 `NextJS`가 아니다.
 * 표기가 흔들리면 같은 기술이 두 값으로 갈려 필터가 쪼개진다.
 */
const STACK_VALUES = [
  'TypeScript',
  'React',
  'Next.js',
  'StyleX',
  'MDX',
  'pnpm',
  'GitHub Actions',
] as const;

/**
 * 보조 축. 개방 어휘이지만 여기 선언한 것만 필터에 나온다.
 *
 * 글에서 추출하지 않는 이유는 위와 같다 — 0편인 값을 흐리게 보여주려면
 * 목록이 글보다 먼저 있어야 한다.
 */
const TAG_VALUES = ['FSD', 'CI', '아키텍처', '접근성', '성능', '테스트'] as const;

/** 축의 순서. 화면의 버튼 순서가 이 순서다. */
export const AXIS_KEYS = ['kind', 'project', 'track', 'stack', 'tag'] as const;

export type AxisKey = (typeof AXIS_KEYS)[number];

/** 축별 가능한 값 */
export const AXIS_VALUES: Record<AxisKey, readonly string[]> = {
  kind: KIND_VALUES,
  project: PROJECT_VALUES,
  track: TRACK_VALUES,
  stack: STACK_VALUES,
  tag: TAG_VALUES,
};

/** 축별로 고른 값. 고르지 않은 축은 없거나 빈 배열이다. */
export type AxisSelection = Readonly<Partial<Record<AxisKey, readonly string[]>>>;
