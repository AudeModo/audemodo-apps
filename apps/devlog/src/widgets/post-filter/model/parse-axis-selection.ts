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
 */
export const parseAxisSelection = (params: ReadableParams): AxisSelection => {
  const selection: Partial<Record<AxisKey, string[]>> = {};

  for (const key of AXIS_KEYS) {
    const text = params.get(key);

    if (text === null || text === '') {
      continue;
    }

    const allowed = AXIS_VALUES[key];
    const values = [...new Set(text.split(','))].filter((value) => allowed.includes(value));

    if (values.length > 0) {
      selection[key] = values;
    }
  }

  return selection;
};
