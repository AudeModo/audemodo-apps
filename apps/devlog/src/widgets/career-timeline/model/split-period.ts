/**
 * 기간 표기를 줄 단위로 쪼갠다.
 *
 * `2025.02–2025.08`은 82px 날짜 열에 한 줄로 들어가지 않는다. 열을 넓히면 `YYYY.MM`
 * 하나뿐인 나머지 항목이 다 헐거워지므로, 열 폭을 지키고 두 줄로 쪼갠다.
 *
 * ```
 * 2025.02
 * –2025.08
 * ```
 *
 * 이음표를 뒤쪽에 붙여 두 줄이 각각 하나의 시점을 말하게 한다. tabular-nums라
 * 자릿수가 정확히 맞물린다.
 *
 * 데이터에 줄바꿈을 넣지 않고 렌더할 때 쪼개는 이유: `at` 값은 이 화면 말고 다른 곳에서도
 * 쓰일 수 있고, 그때 줄바꿈이 딸려 가면 그 자리에서 다시 걷어내야 한다.
 */

/** 기간을 잇는 데 쓰는 글자들 */
const SEPARATORS = /[–—~]/;

export const splitPeriod = (at: string): string[] => {
  const match = SEPARATORS.exec(at);

  if (match?.index === undefined || match.index === 0) {
    // 이음표가 없거나 맨 앞이면 쪼갤 것이 없다
    return [at];
  }

  return [at.slice(0, match.index), at.slice(match.index)];
};
