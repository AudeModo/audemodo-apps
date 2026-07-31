/**
 * 게시글 날짜를 화면에 보여줄 문자열로 바꿈다.
 *
 * createdAt은 시각까지 담은 ISO 8601 문자열이라 그대로 보여주면 읽기 어렵다.
 * 표시 시간대를 Asia/Seoul로 고정하는 이유는, 빌드 환경의 시간대에 따라 정적 페이지에
 * 박히는 날짜가 달라지는 것을 막기 위해서다(로컬은 KST, CI·Vercel은 UTC).
 */
const FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatPostDate = (isoDate: string): string => {
  return FORMATTER.format(new Date(isoDate));
};
