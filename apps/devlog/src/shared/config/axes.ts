/**
 * 글을 좁히는 다섯 축의 어휘.
 *
 * 축의 가능한 값과 실제 쓰인 값은 다른 개념이다. 그래서 이 목록을 글에서 추출하지 않고
 * 여기에 손으로 둔다. 추출하면 0편인 값이 목록에서 사라져 「아직 안 썼다」를 말할 자리가
 * 없어진다 — 감추면 「그건 안 한다」로 읽히고, 흐리게 두면 「아직 안 썼다」로 읽힌다.
 *
 * 새 값이 필요하면 글보다 이 파일을 먼저 고친다.
 */

/** 글의 성격 */
export const KIND_VALUES = ['회고', '트러블슈팅', '학습', '예비'] as const;

/** 글이 다루는 직무 */
export const TRACK_VALUES = ['FE', 'BE', '인프라'] as const;

/*
 * 아래 세 축은 아직 비어 있다. 시안이 들고 있던 값은 목업 픽스처였고, 실제 어휘는
 * 손으로 정한다. 어휘가 비면 그 축은 화면에 나오지 않는다 — 고를 값이 없는 축은
 * 아무것도 좁히지 못하고, 빈 팝오버는 「값이 0편이다」와 다른 말이라 섞이면 안 된다.
 */

const PROJECT_VALUES: string[] = [];

const STACK_VALUES: string[] = [];

const TAG_VALUES: string[] = [];

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
