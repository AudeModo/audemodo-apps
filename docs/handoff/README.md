# devlog 핸드오프 — 공용 문서

화면 아홉 장의 디자인 참조 묶음. **이 문서는 아홉이 공유하는 것만** 담는다.
화면별 레이아웃과 고유 계산은 `screens/`의 각 문서에 있다.

| 문서 | 화면 |
|---|---|
| `screens/home.md` | 홈 `/` |
| `screens/posts-list.md` | 글 목록 `/posts` |
| `screens/post-detail.md` | 글 상세 `/posts/[slug]` |
| `screens/projects-list.md` | 프로젝트 목록 `/projects` |
| `screens/project-detail.md` | 프로젝트 상세 `/projects/[slug]` |
| `screens/about.md` | 소개 `/about` |
| `screens/dashboard.md` | 대시보드 `/dashboard` |
| `screens/component-sheet.md` | P1 부품 카탈로그 (라우트 아님) |
| `screens/state-sheet.md` | P2 상태 카탈로그 (라우트 아님) |

---

## 이 묶음의 파일에 대하여

`designs/`의 `.dc.html`은 **HTML로 만든 디자인 참조**다. 의도한 모양과 동작을 보여주는
시안이고 그대로 복사해 쓸 제품 코드가 아니다.

할 일은 **이 디자인을 대상 코드베이스의 기존 환경에서 다시 만드는 것**이다 —
React · Next.js · FSD 레이어 · 아래의 래퍼 패키지를 쓴다.

### 충실도: 하이파이

색 · 타이포 · 간격 · 상호작용이 모두 확정값이다. 픽셀 단위로 재현한다.
문서의 수치는 브라우저에서 실측한 계산값이고 추정치가 아니다.

---

## 대상 라이브러리

`@audemodo/design-system`이 이 앱이 쓸 래퍼다. 벤더를 감싸고 있고 **앱은 이 패키지만 본다.**

### 제공되는 것 — 아홉 + 프로바이더

`Card` `Divider` `Heading` `HStack` `Link` `List` `ListItem` `Text` `VStack`
`DesignSystemProvider`

- **프로바이더로 트리를 감싼다.** 없으면 토큰도 색도 타입 스케일도 안 붙는다.
- **클래스가 없다. 프롭으로 스타일한다.** `className`을 이 컴포넌트들에 쓰지 않는다.
- **간격은 숫자 스텝이다** — `0 · 0.5 · 1 · 1.5 · 2 · 3 · 4 · 5 · 6 · 8 · 10`.
  `gap={4}`로 쓰고 `gap="16px"`로 쓰지 않는다.
- 레이아웃은 `VStack` / `HStack`. 생 flex div를 쓰지 않는다.
- 글자는 전부 `Text` / `Heading`.
  `Text type=`은 `body | large | label | supporting | code | display-*`.
- 표면은 `Card` — `variant` `elevation` `padding`.

### 공통 매핑

| 시안 요소 | 래퍼 |
|---|---|
| 섹션 세로 리듬 | `VStack gap={6}` |
| 제목 + 카운트 한 줄 | `HStack gap={3} vAlign="baseline"` |
| 화면 제목 | `Heading level={1}` |
| 섹션 제목 | `Heading level={2}` |
| 카운트 · 메타 · 날짜 | `Text type="supporting" color="secondary"` |
| 부제 · 요약 | `Text as="p" color="secondary"` |
| 면 교차 구분 | `Divider` 또는 섹션 배경 토큰 |
| 카드 | `Card variant="default" padding={5}` |

**`List` / `ListItem hasDividers`는 글 목록에 쓰지 않는다.** 그 목록은 구분선이 없고
항목 간 44px 여백으로 끊는다. `ListItem`의 라벨/설명 구조로는 kind 라벨 · 날짜 ·
2줄 클램프 · 썸네일 배치가 안 나온다. 대시보드의 할 일 · 읽을거리처럼 단순한 행에는 맞다.

### 래퍼에 없는 것 — 앱 안에 짠다

필터 축 버튼 · 팝오버 · 칩 · 배지 · 상태 점 · 진행 막대 · 썸네일 행 · 플로팅 버튼 ·
빈 상태 · 스켈레톤 · 콜아웃 · 형광펜 · 코드블록은 래퍼에 없다.
`VStack`/`HStack`으로 골격을 잡고 나머지는 테마 토큰으로 칠한다.

**두 번째 소비자가 생기기 전에는 래퍼로 올리지 않는다.** 오지 않은 요구에 맞춘 추상은
대개 틀리고, 틀린 추상을 되돌리는 비용이 중복을 참는 비용보다 크다.
세 화면 이상에서 같은 형태로 쓰이면 그때 올린다 — 배지 · 상태 점 · 진행 막대가 후보다.

### 경계

**앱에서 벤더를 직접 import하지 않는다.** 래퍼만 통한다.
경계 검사기가 매 커밋 확인하고 위반이 있으면 머지가 막힌다.

이 확인을 무디게 만들지 않도록 **주석에도 벤더 패키지명을 리터럴로 적지 않는다.**

---

## FSD 배치

도구가 FSD를 모르므로 우리가 정한다. **각 슬라이스는 `index.ts` public API로만 노출한다.**

```
_pages/<screen>/          화면 조립 — 라우트 하나에 하나
widgets/<feature>/        여러 엔티티를 엮는 덩어리 · 그 덩어리의 훅
entities/<entity>/ui/     엔티티 표현 — 다른 화면에서도 같은 모양으로 쓰이는 것
shared/ui/                도메인을 모르는 것
```

의존 방향은 `_pages → widgets → entities → shared` 한 방향뿐이다.
같은 층끼리 서로 import하지 않는다.

| 슬라이스 | 내용 |
|---|---|
| `_pages/posts-list/` | `PostsList` |
| `_pages/post-detail/` | `PostDetail` |
| `_pages/home/` | `Home` |
| `_pages/projects-list/` | `ProjectsList` |
| `_pages/project-detail/` | `ProjectDetail` |
| `_pages/about/` | `About` |
| `_pages/dashboard/` | `Dashboard` |
| `widgets/post-filter/` | `AxisFilters` · `ActiveFilterStrip` · `usePostFilters` |
| `widgets/post-toc/` | `Toc` · `useActiveHeading` |
| `widgets/project-timeline/` | `Timeline` |
| `widgets/contribution-grid/` | `ContributionGrid` |
| `widgets/review-table/` | `ReviewTable` (대시보드) |
| `entities/post/ui/` | `PostRow` · `PostCard` · `KindLabel` |
| `entities/project/ui/` | `ProjectCard` · `StatusDot` |
| `entities/series/ui/` | `SeriesCard` |
| `shared/ui/` | `EmptyState` · `Skeleton` · `Callout` · `ProgressBar` · `Badge` · `FloatingTools` |
| `shared/lib/` | `formatDate` · `readingTime` · 패싯 계산 |

**`KindLabel`이 `entities/post`에 있는 이유**: kind → 색 매핑이 글이라는 엔티티의 표현이다.
색 값을 문자열로 들고 다니지 않고 이 컴포넌트 안에 가둔다.

**`FloatingTools`가 `shared/ui`에 있는 이유**: 전역 크롬이고 도메인을 모른다. 아홉 화면 전부에 있다.

---

## 걷어낼 것 — 아홉 화면 공통

| 시안의 것 | 이유 |
|---|---|
| 상단 「미리보기 · 데스크톱 / 모바일 390」 스위처 | 한 파일에서 두 대역을 보여주기 위한 장치. 제품은 실제 뷰포트가 결정한다 |
| 「빈 상태 조합 넣기」 프리셋 버튼 | 빈 상태를 시연하려고 만든 것 |
| 하단 `/posts?kind=…` URL 표시 줄 | 상태가 URL에 들어감을 눈에 보이게 한 것. 제품에서는 실제 라우터가 담당 |
| 시트 간 링크 (「P1 컴포넌트 시트」 등) | 시안 내부 항해 |
| 투명 `::before` 오버레이 | 인라인 스타일로 자손 호버를 만들 수 없어 쓴 우회. 제품에서는 `.card:hover .title` |
| `window.DEVLOG_*` 전역 | 시안이 수치를 한 배열에서 세기 위한 것. 제품은 MDX 프론트매터 + 빌드 타임 집계 |
| 모바일 프레임(390 × 844 테두리 · 라운드) | 기기 흉내. 제품은 그냥 화면이다 |
| 사양 캡션 (작은 글씨로 hex · 열 번호) | P1 · P2 시트만의 요구사항. 제품 화면에는 없다 |
| `data-screen-label` · `data-spec` 속성 | 시안 계측용 |

---

## 디자인 토큰

### 두 갈래를 섞지 않는다

래퍼는 벤더 테마 토큰을 싣고 온다.

- **겹치는 것은 벤더 이름을 그대로 쓴다** — `--color-text-primary` · `--color-text-secondary`
  · `--color-background-body` · `--color-background-card` · `--color-background-muted`
  · `--color-border` · `--color-border-emphasized` · `--color-accent`
  · `--radius-inner|element|container` · `--shadow-low|med|high`
  · `--font-family-body|heading` · `--font-size-*` · `--duration-*`
- **브랜드 고유값만 `--devlog-*`로 추가한다** — 4색 3단계 · 형광펜 · `--devlog-solid`
- 그 층은 **래퍼 안에만** 둔다 (`reference/devlog-theme.css`). 앱에서 재정의하지 않는다.
- **간격은 토큰으로 노출되지 않는다.** 컴포넌트의 스텝 프롭을 쓴다.

시안의 `--bg` `--ink` 같은 이름은 **시안 내부 이름**이다. 제품에서는 위 매핑을 따른다.

### 색

| 시안 이름 | 라이트 | 다크 | 제품 이름 |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#111112` | `--color-background-body` |
| `--surf` | `#F1F4F7` | `#1A1A1D` | `--color-background-muted` |
| `--card` | `#FFFFFF` | `#1F1F22` | `--color-background-card` |
| `--ink` | `#0A1317` | `#F1F4F7` | `--color-text-primary` |
| `--ink-2` | `#4E606F` | `#A4B0BC` | `--color-text-secondary` |
| `--ink-3` | `#A4B0BC` | `#4A5560` | `--devlog-disabled` |
| `--line` | `#05365919` | `rgba(255,255,255,.09)` | `--color-border` |
| `--line-soft` | `#05365910` | `rgba(255,255,255,.05)` | `--devlog-line-soft` |
| `--line-hard` | `#CCD3DB` | `#3A3B40` | `--color-border-emphasized` |
| `--track` | `#EDF0F3` | `#2A2A2E` | `--devlog-track` |
| `--blue` | `#3655FF` | `#5C77FF` | `--devlog-blue` (= `--color-accent`) |
| `--coral` | `#F65660` | `#FF7A83` | `--devlog-coral` |
| `--yellow` | `#FFC940` | `#FFD470` | `--devlog-yellow` |
| `--green` | `#37A878` | `#4FCF9B` | `--devlog-green` |
| `--blue-strong` | `#1B2E99` | `#A8B8FF` | `--devlog-blue-strong` |
| `--coral-strong` | `#A3282F` | `#FFB0B6` | `--devlog-coral-strong` |
| `--yellow-strong` | `#6B4E00` | `#FFE3A3` | `--devlog-yellow-strong` |
| `--green-strong` | `#1B5E42` | `#8ADFBB` | `--devlog-green-strong` |
| `--blue-pale` | `#E6EAFF` | `#1A2140` | `--devlog-blue-pale` |
| `--coral-pale` | `#FFE6E8` | `#3A1D22` | `--devlog-coral-pale` |
| `--yellow-pale` | `#FFF4D6` | `#33290F` | `--devlog-yellow-pale` |
| `--green-pale` | `#E3F5EC` | `#153328` | `--devlog-green-pale` |
| `--on-fill` | `#FFFFFF` | `#111112` | `--devlog-on-fill` |
| `--solid` | `#0A1317` | `#26262A` | `--devlog-solid` |
| `--on-solid` | `#FFFFFF` | `#F1F4F7` | `--devlog-on-solid` |
| `--hl-main` | `#C9D3FF` | `#2C3A7A` | `--devlog-hl-main` |
| `--hl-alt` | `#FFE3AC` | `#4A3A16` | `--devlog-hl-alt` |
| `--hl-ink` | `#0A1317` | `#FFFFFF` | `--devlog-hl-ink` |
| `--code-bg` | `#F1F4F7` | `#1F1F22` | `--devlog-code-bg` |
| `--code-head` | `#E7ECF1` | `#28292C` | `--devlog-code-head` |
| `--code-mark` | `rgba(54,85,255,.11)` | `rgba(92,119,255,.22)` | `--devlog-code-mark` |

### 면 규칙 — 조건은 안 바뀌고 답이 뒤집힌다

- **글자·글리프가 올라가는 면** → `*-strong`. 그 위 글자는 `on-fill`.
  채운 배지 · 콜아웃 아이콘 원 · 소제목 번호 배지 · 라벨 있는 막대 · 상태 원
- **글자가 없는 면** → 기본색.
  상태 점 · 진행 막대 · 콜아웃 좌측 바 · 형광펜 · 분포 막대

라이트: 옅은 면(밝음) → 기본색 → 텍스트 단계(어두움)
다크: 옅은 면(어두움) → 기본색 → 밝은 단계(밝음)

**노랑만 예외인 규칙은 없다. 네 색이 같은 취급이다.**

### 두 가지 예외 — 알고 안고 간다

1. **제목 호버**는 기본색을 쓴다. 코럴 3.3:1 · 초록 3.0:1로 미달.
   정지 상태가 18.9:1이고, 호버는 마우스 전용이며, 밑줄이 색과 무관한 두 번째 신호다.
2. **면 자체가 콘텐츠일 때**는 색을 바꾸지 않는다 (P1 색 스와치).
   글자를 흰 칩 위로 올려 대비를 만든다.

### 상속 대 명시

- 위계를 따라가야 하면 **상속** — 아이콘 색은 항상 부모 텍스트 색을 물려받는다
- 값이 정해져 있어야 하면 **명시** — 형광펜 글자색은 항상 적는다
  (`--devlog-hl-ink`. 부모색을 물려받으면 보조 문단에서 4.41:1로 미달한다)

### 간격 · 그리드

컨테이너 **1080** · 좌우 **32** · 콘텐츠 **1016** · 12열 · 간격 **20** · 열 폭 **66.3**

검산: `66.3 × 12 + 20 × 11 = 1016`, `1016 + 32 × 2 = 1080`
**1144는 브레이크포인트이지 컨테이너 폭이 아니다.**

| 열 수 | 폭 | 쓰임 |
|---|---|---|
| 2 | 153 | — |
| 3 | 239 | 썸네일 · 목차 |
| 8 | 671 | 본문 최대 폭 |
| 12 | 1016 | 콘텐츠 |

| 자리 | 데스크톱 | 모바일 |
|---|---|---|
| 컨테이너 좌우 | 32 | 20 |
| 그리드 간격 | 20 | 20 |
| 카드 패딩 | 20 | 18 |
| 목록 항목 간 | 44 | 36 |
| 섹션 상하 | 52 / 56 | 40 / 44 |
| 플로팅 여백 | 32 | 20 |
| 하단 여백 | — | 66 |

**`auto-fit`을 제품 화면에 쓰지 않는다.** 항목 수가 그 대역에서 나올 수 있는 모든 열 수로
나눠떨어지지 않으면 고아가 생긴다 — 4는 3열이 되는 순간 3+1, 3은 2열이 되는 순간 2+1.
`matchMedia('(min-width:1144px)')` + 상태 분기로 열 수를 못 박는다.

### 타이포 — 17단계

헤드라인 **SUITE**, 본문·UI **SUIT**. 둘 다 가변 폰트이고 **굵기 축만 쓴다.**

| 용도 | 데스크톱 | 모바일 | 자간 |
|---|---|---|---|
| 홈 히어로 | 44 | 29 | −.035em |
| 소개 히어로 | 38 | 29 | −.035em |
| 프로젝트 상세 제목 | 36 | 29 | −.03em |
| 화면 제목 | 32 | 24 | −.03em |
| 글 제목 (상세) | 32 | 26 | −.03em |
| 대시보드 제목 | 28 | 24 | −.03em |
| 섹션 제목 | 26 | 22 | −.03em |
| 글 제목 (목록) | 23 | 20 | −.025em |
| 본문 소제목 | 21 | 19 | −.025em |
| 프로젝트 카드 이름 | 21 | 19 | −.025em |
| 인용 | 19 | 17 | — |
| 위젯 제목 | 15 | 유지 | — |
| **읽기 본문** | **17 / 1.75** | **유지** | — |
| **UI 본문 · 요약** | **14 / 1.6** | **유지** | — |
| 카드 설명 | 12.5 | 유지 | — |
| **메타 · 날짜** | **12** | **유지** | tabular-nums |
| **kind 라벨** | **11 / 500** | **유지** | .1em |

**줄이는 것은 제목 계열뿐이다.** 읽기 본문을 줄이면 모바일에서 오히려 읽기 어려워진다.
한글은 정사각 글자꼴이라 라틴 기준 행간이 좁게 느껴진다 — 1.75를 지킨다.

**한글 UI다. 영문 대문자 라벨을 쓰지 않는다.**
문장 안 숫자는 한글(`여섯 개` `서른네 편`), 데이터는 아라비아(`412` `91`).

### 라운드 · 그림자 · 모션

| 항목 | 값 |
|---|---|
| 카드 · 팝오버 | 12 |
| 콜아웃 | 10 |
| 버튼 · 칩 · 입력 · 썸네일 | 8 |
| 배지 | 6 |
| 체크 상자 | 4 |
| 원 · 알약 · 막대 | 9999 |
| 카드 호버 그림자 | `0 2px 4px shadow-a, 0 12px 28px shadow-b` |
| 카드 호버 이동 | `translateY(-2px)` 180ms |
| 색 전환 | 120–140ms |
| 밑줄 | 280ms |
| 누름 | 100ms `scale(.98)` |
| 이징 | `cubic-bezier(.24, 1, .4, 1)` |

카드 호버는 **테두리를 지우고 그림자로 바꾼다** — 선이 사라지고 공간이 생기는 교환이다.
다크에서는 그림자 대신 테두리와 면 밝기 단계가 깊이를 만든다.

---

## 상태 — 아홉 화면 공통

**호버와 포커스는 절대 같은 표현을 쓰지 않는다.** 마우스는 「누를 수 있다」를 묻고
키보드는 「지금 여기」를 묻는다. 다른 질문에 같은 답을 주면 키보드 사용자는 자기 위치를 잃는다.

| 상태 | 표현 |
|---|---|
| 호버 | 요소마다 다름 (제목은 색+밑줄, 카드는 그림자, 행은 배경) |
| 포커스 | `box-shadow: 0 0 0 2px <bg>, 0 0 0 4px <accent>` — 파랑 2px 링 + 2px 간격. `box-shadow`라 레이아웃을 밀지 않는다 |
| 눌림 | `transform: scale(.98)` 100ms |
| 비활성 | `opacity: .4` · `cursor: not-allowed` · 호버도 포커스도 받지 않는다 |

`prefers-reduced-motion: reduce`에서 모든 전환이 0이다. **예외 없다.**

### 3상태 규칙

데이터를 읽는 화면은 **로딩 · 빈 상태 · 오류** 셋을 다 갖는다.

- **로딩 스켈레톤은 최종 레이아웃과 같은 자리에 같은 크기로.** 도착했을 때 화면이 튀지 않아야 한다.
  면은 `--devlog-track`, 반짝임 1.4s 무한, 감소 모션에서는 면만 남는다.
- **빈 상태와 404는 평서형 담백한 말투.** 존댓말이나 느낌표를 쓰지 않는다.
- **강조는 항상 최소 개입 쪽.** 받아든 링크의 의도를 최대한 지키는 행동이 강조를 가진다.
  빈 상태는 `[N만 빼기]`가 검정 채움, `[필터 해제]`가 테두리.
  404는 `[전체 글 보기]`가 검정, `[홈으로]`가 테두리.

### 위계

- 강조는 **화면당 하나, 검정 채움.**
- 파랑 채움은 두 곳만 — 소개의 `메일 보내기`, 모바일 필터의 `N편 보기`.

---

## 전역 크롬

**§9는 전역 규칙이다.** 각 화면 문서에 안 적혀 있어도 아홉 화면 전부에 있다.

### 네비 (sticky)

- 높이 60 (모바일 56) · `--color-background-body` · 하단 `1px solid --color-border`
- 로고 `devlog` — SUITE 500 · 21px (모바일 19) · `letter-spacing: -.035em`
- 링크 4개 (글 · 프로젝트 · 소개 · 대시보드) — 14px · 기본 `secondary`,
  현재 화면은 `primary` + 하단 `2px solid` · `padding-bottom: 2`
- 우측 아이콘 3개 (`search` `brand-github` `mail`) — 20px · 히트 34 × 34 · 라운드 8
- **모바일**: 로고 + `search` + `menu-2` (22px · 히트 36 × 36)

### 푸터

- `--color-background-muted` 면 · 상단 `1px solid --color-border`
- 이름 + 한 줄 + 우측 링크 3개 (GitHub↗ · 메일 보내기 · 글 구독)
- 하단 `© 2026 devlog` + 현재 경로 · 12px `secondary`

### 플로팅

- 우하단 고정 · 46 × 46 · 라운드 9999
- `linear-gradient(135deg, blue, coral)` · 글리프 `on-fill` 20px
- 그림자 `0 2px 4px shadow-c, 0 12px 28px shadow-fab`
- 호버 `translateY(-2px)` 160ms · 누름 `scale(.98)`
- 펼치면 위로 알약 두 개: 「맨 위로」 · 「다크 모드」
  - 알약 높이 38 · `padding: 0 14` · 라운드 9999 · `1px solid border` · 13px
- **여백 = 콘텐츠 여백** (32 / 20). 정렬선과 어긋나면 화면 밖에 뜬 것처럼 보인다.
- 본문 위에 겹치는 것은 플로팅의 정의다. 스크롤하면 빠져나온다.
  스크롤로 못 푸는 것(페이지 끝)만 실제 손실이고 모바일 하단 66px으로 해결한다.

**「다크 모드」가 여기 있다.** 이 버튼이 다크를 켜는 유일한 경로다 —
`document.documentElement`에 `data-theme="dark"`를 심는다. 선택을 저장한다.

### 면 교차

흰 → 회색 → 흰 → 회색으로 번갈아 쓴다. 스크롤에 리듬이 생긴다.
**배경색은 화면당 두 개까지** (`body` · `muted`).
**대시보드만 페이지 배경이 `muted`다** — 흰 위젯 카드가 떠 있어야 벤토가 벤토로 보인다.

---

## 아이콘

**Tabler** 하나로 통일한다. 16px 인라인 · 20px 단독.
**색은 부모 텍스트 색을 상속한다** — 아이콘에 색을 직접 지정하지 않는다.

**외부 링크에는 `external-link`(↗)를 붙인다.** 그 아이콘이 곧 새 탭 신호다.
내부 이동에는 붙이지 않는다. 외부는 새 탭, 내부는 현재 탭.

대체품 둘: StyleX는 Tabler에 마크가 없어 `brand-css3`, FSD는 `sitemap`.

---

## 접근성

- 대비: 본문 4.5:1 · 큰 글자 3:1 · 비텍스트 3:1. **비활성은 면제**다.
- 포커스 링은 모든 대화 가능 요소에. 호버와 다른 표현으로.
- `aria-hidden`: 장식 구분자(`·`)와 의미가 겹치는 그래픽(404 숫자).
- 모바일 히트 영역 최소 44.
- `prefers-reduced-motion`에서 전환 0.
- 날짜는 `<time dateTime>`. **`2026.08.03` 형식 고정, 상대 시간을 쓰지 않는다** —
  SSG에서 빌드 시점에 굳어 거짓이 된다.
- 알려진 예외 둘은 위 「토큰」 절 참조.

---

## 데이터

시안은 `window.DEVLOG_*` 전역을 쓴다. **제품에서는 걷어낸다** — MDX 프론트매터 +
빌드 타임 집계로 대체한다.

```ts
type Post = {
  slug: string;
  kind: '회고' | '트러블슈팅' | '학습' | '예비';
  project: string;
  track: 'FE' | 'BE' | '인프라';
  stack: string[];
  tag: string[];
  date: string;          // '2026.08.03'
  isoDate: string;
  thumbnail?: { src: string; width: number; height: number };
  title: string;
  summary: string;
  series?: string;
  seriesOrder?: number;
  needsUpdate?: '6mo' | '1y';
  lastReviewed?: string;
};
```

### 축 어휘를 따로 둔다

```ts
const AXIS_VALUES = {
  kind: ['회고','트러블슈팅','학습','예비'],
  project: [...],
  track: ['FE','BE','인프라'],
  stack: [...],
  tag: [...],
};
```

**글에서 값을 추출하면 안 된다.** 지금 `BE`는 0편인데, 추출하면 목록에서 사라져
「아직 안 썼다」를 말할 자리가 없어진다. 감추면 「BE는 안 한다」로 읽히고
흐리게 두면 「아직 안 썼다」로 읽힌다.
**축의 가능한 값과 실제 쓰인 값은 다른 개념이다.**

### 화면에 적힌 수는 전부 계산값이어야 한다

편수 · 비율 · 기간 · 시간을 손으로 적지 않는다. 시안에서 이 규칙을 어겼을 때
「여덟 편」(실제 10) · 「여섯 시간 반」(실제 일곱 시간)이 틀린 채 나갔다.

**그림과 문장이 같은 배열에서 나와야 한다** — 잔디를 84칸으로 자르면
문구도 「12주 · 84일」이 되어야 한다.

---

## 검증

- **「검사를 통과했다」를 신호로 믿지 않는다. 계산값을 확인한다.**
- 호버·포커스는 규칙이 생성됐는지가 아니라 **그 규칙 안에 해당 선언이 있는지**를 본다.
- 대비는 실측한다. 밑줄·형광펜은 `background-image`를 쓰므로 배경색 추출이 오탐을 낸다.
- **반응형 값을 만지면 세 구간(모바일 · 태블릿 · 데스크톱) 전부에서 재측정한다.**
  한 분기를 고치려고 공유 값을 바꾸면 다른 구간이 조용히 깨진다.
- 토큰을 도입할 때 **정의와 사용을 구분한다.** 일괄 치환이 정의 블록을 삼키면
  `--bg: var(--card)` 같은 자기참조가 생기고, 라이트에서는 정상으로 보인다.

---

## 미해결 — 아홉 공통

| # | 항목 |
|---|---|
| 1 | 라틴 모노 서체 — 지금은 시스템 모노 |
| 2 | 신택스 하이라이터 테마 (다크 배경값은 정해졌고 색은 테마가 정한다) |
| 3 | 태그 오타 의심 판정 규칙 (편집 거리? 수기 별칭 표?) |
| 4 | GitHub API 빌드 타임 호출 — rate limit · 캐싱 |
