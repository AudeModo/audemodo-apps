/**
 * 세는 수를 한글 수사로.
 *
 * 문장 안의 수는 한글로 적고 지표·메타는 아라비아로 적는다. 「지금까지 여섯 개를
 * 만들었고」는 문장이고 「412」는 데이터라, 같은 수라도 자리에 따라 표기가 다르다.
 *
 * 손으로 적지 않는 이유는 늘 같다 — 코퍼스가 자라면 문장이 먼저 거짓이 된다.
 */

/** 단위 앞에 서는 꼴. 하나가 아니라 「한」이다 */
const ONES = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉'];

/** 열의 자리가 홀로 설 때. 스물이 아니라 「스무」다 */
const TENS_ALONE = ['', '열', '스무', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

/** 뒤에 낱개가 붙을 때. 「스물한」이지 「스무한」이 아니다 */
const TENS_WITH_ONES = ['', '열', '스물', '서른', '마흔', '쉰', '예순', '일흔', '여든', '아흔'];

/**
 * 1~99를 한글 수사로, 그 밖은 아라비아 숫자 그대로.
 *
 * 백부터 한자어 수사(백·천)로 갈리는데 「백서른네 편」은 문장에서 오히려 읽기 어렵다.
 * 두 자리까지만 한글로 적고 그 위는 숫자로 두는 편이 문장을 덜 방해한다.
 *
 * 0은 숫자로 둔다 — 「영 편」이라고 쓰는 사람은 없다.
 */
export const toKoreanCount = (value: number): string => {
  if (!Number.isInteger(value) || value < 1 || value > 99) {
    return String(value);
  }

  const tens = Math.floor(value / 10);
  const ones = value % 10;

  if (tens === 0) {
    return ONES[ones] ?? String(value);
  }

  const tensWord = ones === 0 ? TENS_ALONE[tens] : TENS_WITH_ONES[tens];

  return `${tensWord ?? ''}${ONES[ones] ?? ''}`;
};
