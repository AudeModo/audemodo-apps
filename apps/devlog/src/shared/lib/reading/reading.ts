/**
 * 읽는 시간.
 *
 * 분당 500자는 한국어 기술 문서의 보수적인 값이다. 코드블록을 글자로 세면 실제보다
 * 짧게 나오고 여백·이미지는 길게 나오는데, 대체로 상쇄된다. 코드가 많은 글에서
 * 눈에 띄게 어긋나면 그때 고친다.
 *
 * 화면에 적히는 수는 전부 계산값이어야 한다 — 손으로 적으면 글이 자라도 그대로 남는다.
 */

const CHARS_PER_MINUTE = 500;

/**
 * 본문 글자 수로 분을 센다. 0분은 없다 — 한 문장짜리 글도 읽는 데 시간이 든다.
 */
export const readingTime = (body: string): number =>
  Math.max(1, Math.ceil(body.length / CHARS_PER_MINUTE));
