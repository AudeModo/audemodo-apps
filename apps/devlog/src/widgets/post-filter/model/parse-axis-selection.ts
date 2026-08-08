import type { AxisKey, AxisSelection } from '@/shared/config';
import { AXIS_KEYS, AXIS_VALUES } from '@/shared/config';

/** URLSearchParams와 라우터가 주는 읽기 전용 버전이 함께 만족하는 최소 모양 */
interface ReadableParams {
  get: (name: string) => string | null;
}

/**
 * 쿼리 스트링을 축 선택으로 읽는다. 필터 상태는 URL이 진실이다.
 *
 * 어휘에 없는 값은 버린다. 남기면 낡은 링크나 손으로 고친 URL이 아무 글도 만나지 못하는
 * 칩을 만들어, 지울 수는 있지만 무엇이었는지는 알 수 없는 상태가 된다.
 *
 * 어휘를 인자로 받는 이유: 이 함수가 지키는 것은 「선언된 값만 통과시킨다」는 규칙이지
 * 지금 선언된 값들이 아니다. 어휘를 밖에서 넣을 수 있어야 그 규칙을 실제 어휘와 무관하게
 * 확인할 수 있고, 어휘가 바뀔 때마다 검증이 따라 흔들리지 않는다.
 */
export const parseAxisSelection = (
  params: ReadableParams,
  vocabulary: Record<AxisKey, readonly string[]> = AXIS_VALUES,
): AxisSelection => {
  const selection: Partial<Record<AxisKey, string[]>> = {};

  for (const key of AXIS_KEYS) {
    const text = params.get(key);

    if (text === null || text === '') {
      continue;
    }

    const allowed = vocabulary[key];
    const values = [...new Set(text.split(','))].filter((value) => allowed.includes(value));

    if (values.length > 0) {
      selection[key] = values;
    }
  }

  return selection;
};
