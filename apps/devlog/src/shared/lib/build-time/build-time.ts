/**
 * 빌드 시각.
 *
 * 이 한 줄이 대시보드에서 아무것도 움직이지 않는 이유를 설명한다 — 데이터가 빌드
 * 시점에 굳었다는 사실을 화면이 스스로 말해야, 누를 수 없는 것이 고장으로 읽히지 않는다.
 *
 * 표시 시간대를 Asia/Seoul로 고정하는 이유는 날짜와 같다. 빌드 환경의 시간대에 따라
 * 정적 페이지에 박히는 시각이 달라지면 안 된다(로컬은 KST, CI는 UTC).
 */
const FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** `2026.08.10 04:12` */
export const formatBuildTime = (at: Date): string => {
  const parts = FORMATTER.formatToParts(at);
  const valueOf = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  // 자정을 24시로 적는 로케일이 있다. 날짜는 이미 넘어갔으므로 00으로 맞춘다
  const hour = valueOf('hour') === '24' ? '00' : valueOf('hour');

  return `${valueOf('year')}.${valueOf('month')}.${valueOf('day')} ${hour}:${valueOf('minute')}`;
};
