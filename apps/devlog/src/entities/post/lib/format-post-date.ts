/**
 * 게시글 날짜를 화면에 보여줄 문자열로 바꾼다.
 *
 * 형식은 `2026.08.03` 하나로 고정한다. 상대 시간(「3일 전」)을 쓰지 않는 이유는
 * SSG에서 빌드 시점에 굳어 시간이 지나면 거짓이 되기 때문이다.
 *
 * 표시 시간대를 Asia/Seoul로 고정하는 이유는, 빌드 환경의 시간대에 따라 정적 페이지에
 * 박히는 날짜가 달라지는 것을 막기 위해서다(로컬은 KST, CI·Vercel은 UTC).
 */
const FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatPostDate = (isoDate: string): string => {
  const parts = FORMATTER.formatToParts(new Date(isoDate));
  const valueOf = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${valueOf('year')}.${valueOf('month')}.${valueOf('day')}`;
};
