// devlog 공용 콘텐츠 — 홈·목록·상세가 같은 배열을 센다.
// 화면에 적힌 편수는 전부 여기서 계산된 값이어야 한다.
window.DEVLOG_POSTS = [
  { kind:'회고', project:'devlog', track:'FE', stack:['TypeScript','React'], tag:['FSD'], date:'2026.08.03', thumb:true,
    title:'여섯 달 만에 처음부터 다시 쓰기로 한 이유와 그 판단의 근거', summary:'구조를 고치는 것보다 다시 세우는 편이 빨랐다. 무엇을 버렸고 무엇을 지켰는지 남긴다.' },
  { kind:'트러블슈팅', project:'devlog', track:'FE', stack:['Vite'], tag:['성능'], date:'2026.07.28', thumb:true,
    title:'로컬에서는 멀쩡한데 빌드에서만 죽는 SSG 페이지를 추적한 기록', summary:'상대 시간이 빌드 시점에 굳는다는 걸 배포하고 나서야 알았다.' },
  { kind:'학습', project:'devlog', track:'FE', stack:['StyleX'], tag:['타이포그래피'], date:'2026.07.21', thumb:true,
    title:'한글 본문의 행간을 1.43에서 1.75로 옮기며 정리한 근거', series:'한글 타이포를 정하는 일', seriesOrder:3, summary:'정사각 글자꼴은 라틴 기준값보다 넓은 행간을 요구한다.' },
  { kind:'회고', project:'audemodo-apps', track:'FE', stack:['TypeScript'], tag:['FSD','CI'], date:'2026.07.14', thumb:true,
    title:'문서에 적어둔 FSD 경계를 CI 파이프라인으로 옮긴 과정', series:'경계를 기계에 맡기기', seriesOrder:4, summary:'규칙을 문서에 적어두면 지켜지지 않는다. 사람에게서 기계로 옮겼다.' },
  { kind:'트러블슈팅', project:'audemodo-apps', track:'인프라', stack:['PostgreSQL'], tag:['성능'], date:'2026.07.07', thumb:false,
    title:'인덱스를 더할수록 느려지던 테이블에서 인덱스를 걷어낸 이야기', summary:'쓰기가 많은 테이블이었다. 실행 계획을 다시 읽는 데서 출발했다.' },
  { kind:'학습', project:'audemodo-apps', track:'인프라', stack:['Vite'], tag:['CI'], date:'2026.06.30', thumb:true,
    title:'모노레포 빌드 캐시가 매번 빗나가던 이유는 해시 키에 있었다', summary:'들어가지 말아야 할 것이 키에 섞여 있었다. 직접 찍어보는 것부터.' },
  { kind:'회고', project:'ssg-time', track:'FE', stack:['React'], tag:['접근성'], date:'2026.06.23', thumb:false,
    title:'「3일 전」이라는 친절한 거짓말을 전부 고정 날짜로 바꾼 사흘', summary:'정적 사이트에서 상대 시간은 배포 순간에 멈춘 시계가 된다.' },
  { kind:'트러블슈팅', project:'ssg-time', track:'FE', stack:['React'], tag:['접근성'], date:'2026.06.16', thumb:true,
    title:'스크린 리더가 날짜를 두 번 읽던 문제와 숨김 텍스트의 경계', summary:'시각적으로 숨긴 텍스트와 time 요소가 겹쳤다. 무엇을 남길지의 문제였다.' },
  { kind:'학습', project:'devlog', track:'FE', stack:['StyleX'], tag:['타이포그래피'], date:'2026.06.09', thumb:true,
    title:'가변 폰트에서 굵기 축만 쓰고 나머지를 잠그기로 한 결정', series:'한글 타이포를 정하는 일', seriesOrder:2, summary:'선택지를 줄이는 것이 시스템을 지키는 방법일 때가 있다.' },
  { kind:'회고', project:'grid-texture', track:'FE', stack:['StyleX'], tag:['타이포그래피'], date:'2026.06.02', thumb:false,
    title:'격자 질감 실험을 접으면서 근거만 남겨두기로 한 이유', summary:'예쁜 것과 필요한 것은 다르다. 아쉬울 때 다시 꺼내려고 적어둔다.' },
  { kind:'트러블슈팅', project:'devlog', track:'인프라', stack:['PostgreSQL'], tag:['CI'], date:'2026.05.26', thumb:false,
    title:'마이그레이션이 로컬에서는 통과하고 CI에서만 실패하던 이유', summary:'러너와 내 노트북의 타임존이 달랐다. 재현에 대부분의 시간을 썼다.' },
  { kind:'학습', project:'audemodo-apps', track:'인프라', stack:['TypeScript'], tag:['FSD'], date:'2026.05.19', thumb:true,
    title:'브랜디드 타입으로 레이어 경계를 표현할 수 있는지 실험했다', series:'경계를 기계에 맡기기', seriesOrder:3, summary:'컴파일러가 잡아주는 것과 끝내 못 잡는 것을 갈라두었다.' },
  { kind:'회고', project:'ssg-time', track:'인프라', stack:['Vite'], tag:['성능'], date:'2026.05.12', thumb:false,
    title:'빌드 시간을 절반으로 줄인 것은 병렬화가 아니라 삭제였다', summary:'하지 않아도 될 일을 찾아 지우는 것이 가장 큰 이득이었다.' },
  { kind:'예비', project:'grid-texture', track:'FE', stack:['StyleX'], tag:['타이포그래피'], date:'2026.05.05', thumb:false,
    title:'아직 자리를 못 찾은 질감 실험들을 스크린샷과 함께 남긴다', summary:'언젠가 쓸지도 모르니 판단의 맥락까지 함께 붙여둔다.' },
  { kind:'학습', project:'hanbit-docs', track:'FE', stack:['Playwright'], tag:['테스트'], date:'2026.04.28', thumb:true,
    title:'문서 사이트의 링크 검사를 사람 손에서 떼어낸 방법', summary:'깨진 링크는 언제나 가장 늦게 발견된다. 그래서 기계에 맡겼다.' },
  { kind:'트러블슈팅', project:'hanbit-docs', track:'인프라', stack:['Playwright'], tag:['테스트'], date:'2026.04.21', thumb:false,
    title:'CI에서만 간헐적으로 깨지던 E2E를 재현하는 데 쓴 방법', summary:'열 번에 한 번 실패하는 테스트는 없는 테스트보다 나쁘다.' },
  { kind:'회고', project:'hanbit-docs', track:'FE', stack:['React','TypeScript'], tag:['접근성'], date:'2026.04.14', thumb:true,
    title:'접근성을 나중에 붙이려다 결국 처음부터 다시 쓴 문서 사이트', summary:'나중은 오지 않는다. 초안에서 정하지 않으면 영영 정해지지 않는다.' },
  { kind:'학습', project:'devlog', track:'FE', stack:['React'], tag:['성능'], date:'2026.04.07', thumb:false,
    title:'리스트 가상화를 넣기 전에 먼저 지워야 했던 것들', summary:'느린 이유가 개수가 아니라 항목 하나의 무게일 때가 많다.' },
  { kind:'트러블슈팅', project:'audemodo-apps', track:'FE', stack:['StyleX'], tag:['성능'], date:'2026.03.31', thumb:true,
    title:'스타일 런타임이 첫 페인트를 늦추던 자리를 찾아낸 기록', summary:'측정하지 않고 최적화하면 엉뚱한 곳을 고치게 된다.' },
  { kind:'회고', project:'devlog', track:'FE', stack:['TypeScript'], tag:['FSD'], date:'2026.03.24', thumb:false,
    title:'폴더 구조를 세 번 갈아엎고 나서야 알게 된 경계의 의미', series:'경계를 기계에 맡기기', seriesOrder:2, summary:'경계는 폴더가 아니라 의존 방향으로 정해진다는 것을 늦게 알았다.' },
  { kind:'학습', project:'ssg-time', track:'인프라', stack:['PostgreSQL'], tag:['테스트'], date:'2026.03.17', thumb:true,
    title:'시간대가 얽힌 쿼리를 테스트로 고정하는 몇 가지 방법', summary:'시간을 다루는 코드는 시간을 멈출 수 있어야 검증된다.' },
  { kind:'트러블슈팅', project:'devlog', track:'FE', stack:['Vite'], tag:['CI'], date:'2026.03.10', thumb:false,
    title:'의존성 하나를 올렸더니 번들이 두 배가 된 이유를 찾았다', summary:'트리 셰이킹이 멈춘 지점을 번들 분석기로 짚어 들어갔다.' },
  { kind:'회고', project:'audemodo-apps', track:'인프라', stack:['Vite'], tag:['CI'], date:'2026.03.03', thumb:false,
    title:'배포 파이프라인을 손으로 굴리던 습관을 버리기까지', summary:'손으로 하면 빠르다는 착각이 가장 비쌌다.' },
  { kind:'학습', project:'grid-texture', track:'FE', stack:['StyleX'], tag:['타이포그래피'], date:'2026.02.24', thumb:true,
    title:'격자 위에 글자를 앉히는 일이 왜 그렇게 어려웠는지', series:'한글 타이포를 정하는 일', seriesOrder:1, summary:'글자는 격자를 따르지 않는다. 격자가 글자를 따라야 했다.' },
  { kind:'트러블슈팅', project:'hanbit-docs', track:'인프라', stack:['PostgreSQL'], tag:['성능'], date:'2026.02.17', thumb:false,
    title:'느린 쿼리 하나가 문서 검색 전체를 붙잡고 있었다', summary:'전체가 느린 게 아니라 하나가 느렸다. 찾는 데 이틀이 걸렸다.' },
  { kind:'회고', project:'devlog', track:'FE', stack:['React','StyleX'], tag:['타이포그래피'], date:'2026.02.10', thumb:true,
    title:'디자인 시스템을 먼저 만들고 화면을 나중에 그린 결과', summary:'부품을 먼저 정하니 화면마다 다시 정할 일이 사라졌다.' },
  { kind:'학습', project:'audemodo-apps', track:'FE', stack:['TypeScript'], tag:['테스트'], date:'2026.02.03', thumb:false,
    title:'타입 테스트를 실제 테스트처럼 다루기 시작하면서 생긴 변화', summary:'타입이 깨지는 것도 실패다. 실패로 다루기 시작하니 달라졌다.' },
  { kind:'예비', project:'hanbit-docs', track:'FE', stack:['Playwright'], tag:['테스트'], date:'2026.01.27', thumb:false,
    title:'시각 회귀 테스트를 붙일지 아직 결정하지 못한 이유', summary:'거짓 실패가 많으면 아무도 보지 않게 된다. 그 선을 못 정했다.' },
  { kind:'트러블슈팅', project:'ssg-time', track:'FE', stack:['React'], tag:['성능'], date:'2026.01.20', thumb:true,
    title:'하이드레이션 불일치가 날짜에서만 터지던 이유', summary:'서버와 브라우저가 서로 다른 지금을 보고 있었다.' },
  { kind:'회고', project:'hanbit-docs', track:'인프라', stack:['Playwright'], tag:['CI'], date:'2026.01.13', thumb:false,
    title:'테스트를 늘릴수록 배포가 느려지던 문제를 다시 본 기록', summary:'전부 돌릴 필요는 없었다. 무엇을 언제 돌릴지가 문제였다.' },
  { kind:'학습', project:'devlog', track:'인프라', stack:['PostgreSQL'], tag:['FSD'], date:'2026.01.06', thumb:false,
    title:'데이터 계층에도 경계가 필요한지 한참 고민한 흔적', series:'경계를 기계에 맡기기', seriesOrder:1, summary:'스키마는 경계를 모른다. 경계를 아는 것은 언제나 코드 쪽이었다.' },
  { kind:'트러블슈팅', project:'grid-texture', track:'FE', stack:['StyleX'], tag:['접근성'], date:'2025.12.23', thumb:false,
    title:'대비를 맞추려다 질감을 잃어버린 자리에서 배운 것', summary:'대비는 협상 대상이 아니다. 질감이 물러나야 했다.' },
  { kind:'학습', project:'ssg-time', track:'인프라', stack:['Vite'], tag:['성능'], date:'2025.12.16', thumb:true,
    title:'정적 사이트에서 이미지 최적화를 어디까지 자동화할까', summary:'자동화의 경계는 기술이 아니라 검수 비용이 정한다.' },
  { kind:'회고', project:'audemodo-apps', track:'FE', stack:['React'], tag:['접근성'], date:'2025.12.09', thumb:false,
    title:'키보드만으로 앱 전체를 한 번 지나가 본 하루의 기록', summary:'마우스를 치우자 빠져 있던 자리가 한꺼번에 드러났다.' }
];
window.DEVLOG_PROJECT_COUNT = 6;

// 축 어휘 — 글이 0편인 값도 목록에 남는다. 지우면 「아직 없음」을 말할 수 없다.
window.DEVLOG_AXES = {
  kind: ['회고', '트러블슈팅', '학습', '예비'],
  project: ['devlog', 'audemodo-apps', 'ssg-time', 'grid-texture', 'hanbit-docs'],
  track: ['FE', 'BE', '인프라'],
  stack: ['TypeScript', 'React', 'StyleX', 'Vite', 'PostgreSQL', 'Playwright'],
  tag: ['FSD', '접근성', '성능', '타이포그래피', 'CI', '테스트']
};

// 시리즈 — 계획 편수는 계산할 수 없으므로 여기 둔다. 쓴 편수는 글에서 센다.
window.DEVLOG_SERIES = [
  { name: '경계를 기계에 맡기기', total: 6,
    desc: '문서에 적은 규칙이 왜 안 지켜지는지에서 시작해, 검사기를 CI에 물리기까지.' },
  { name: '한글 타이포를 정하는 일', total: 3,
    desc: '행간 1.75의 근거부터 가변 폰트 축을 하나만 쓰기로 한 결정까지. 끝났다.' }
];

// 주제 묶음 — 사람이 고른 것이라 태그와 다를 수 있다. 숫자는 목록 길이에서 나온다.
window.DEVLOG_COLLECTIONS = [
  { name: '혼자 만들 때의 품질', dates: ['2026.07.14','2026.06.30','2026.04.28','2026.04.21','2026.03.10','2026.02.03','2026.01.13'] },
  { name: '느린 이유 찾기', dates: ['2026.07.28','2026.07.07','2026.05.12','2026.04.07','2026.03.31','2026.02.17','2025.12.16'] },
  { name: '읽을 수 있게', dates: ['2026.06.23','2026.06.16','2026.04.14','2025.12.23','2025.12.09'] }
];

// 검수 신고 — 프론트매터에서 오는 값. 썸네일 유무는 글에서 직접 세므로 여기 없다.
window.DEVLOG_REVIEW = {
  '2026.07.28': { tag: 'suspect', note: 'NextJS · Next.js 표기 혼용', links: 0 },
  '2026.05.19': { links: 2 },
  '2026.03.24': { tag: 'missing' },
  '2026.02.10': { summary: 'missing' },
  '2025.12.23': { tag: 'suspect', note: 'a11y · 접근성 중복', links: 1 }
};
// 갱신 주기 신고 — needsUpdate / lastReviewed
window.DEVLOG_NEEDS_UPDATE = [
  { date: '2025.12.09', every: '6mo', reviewed: '2025.12.09' },
  { date: '2026.01.06', every: '6mo', reviewed: '2026.01.06' },
  { date: '2026.02.24', every: '6mo', reviewed: '2026.03.02' },
  { date: '2026.03.17', every: '1y', reviewed: '2026.03.17' }
];
