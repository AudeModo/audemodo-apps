# 글 목록 `/posts`

34편 중 다섯 축을 좁혀 원하는 글을 찾는다. 독자는 채용 담당자와 동료 개발자.

공용 규칙(토큰 · 타이포 · 상태 · 전역 크롬 · 걷어낼 목록)은 `../README.md`.

## 구조

```
제목 「글」 + 카운트 34 · 부제
필터 드롭다운 5축
활성 필터 스트립 (칩 + 모두 지우기 + 결과 수)
─────────────
글 목록 10편 — 항목 간 44 · 구분선 없음
더 보기
```

## 레이아웃 매핑

| 요소 | 래퍼 | 값 |
|---|---|---|
| 페이지 | `VStack gap={6} maxWidth={1016}` | 좌우 32 / 20 |
| 제목 줄 | `HStack gap={3} vAlign="baseline"` | `Heading level={1}` 32 / 24 |
| 카운트 | `Text type="label" color="secondary"` | 15 · tabular-nums |
| 부제 | `Text as="p" color="secondary"` | 14 / 1.65 · max 671 |
| 축 버튼 줄 | `HStack gap={2} wrap` | 앱 컴포넌트 |
| 스트립 | `HStack gap={2.5}` + `Divider` 위아래 | `min-height: 53` |
| 목록 | `VStack gap={10}` | 44 / 36 |
| 더 보기 | `HStack justify="center"` | — |

**`List`/`ListItem`을 쓰지 않는다** (공용 문서 참조).

### 필터 축 버튼 — 세 상태

| 상태 | 테두리 | 배지 |
|---|---|---|
| 기본 | `1px solid border` | 없음 |
| 활성 (n개) | `1px solid text-primary` | 원형 `ink` 채움 + `on-fill` · 11px/600 · 최소 17 |
| 열림 | `border` | 포커스 링과 같은 `box-shadow` |

13px · `padding: 8px 12px 8px 14px` · 라운드 8 · `gap: 7` · `chevron-down` 16px,
열리면 `rotate(180deg)`.

**활성 필터 칩에 색을 쓰지 않는다.** 색은 kind 인코딩 전용.

### 팝오버

`position: absolute` · `top: calc(100% + 6px)` · `z-index: 30` ·
`min-width: 236` · `max-height: 328` · `overflow: auto` ·
`card` 배경 · 라운드 12 · 그림자 2단.

**열어도 아래 목록이 밀리지 않아야 한다.** 하나만 열리고 바깥 클릭으로 닫힌다.

옵션 행 — `padding: 8px 10px` · 라운드 8 · 호버 `muted`:

| 상태 | 체크 상자 | 이름 | 카운트 |
|---|---|---|---|
| 선택됨 | 16 × 16 · 라운드 4 · `ink` 채움 + `on-fill` 체크 13px | `primary` | `secondary` |
| 선택 가능 | `1px solid border-emphasized` · `card` | `primary` | `secondary` |
| **결과 0** | `1px solid border-emphasized` · `muted` | `disabled` | `disabled` · 항상 `0` |

결과 0인 값은 **지우지 않고 흐리게** 둔다. `cursor: not-allowed`, 클릭 불가.
하단에 「이 축만 지우기」 12px 파랑.

**모바일**: 전체 화면 패널 · 옵션 행 `min-height: 44` · 체크 상자 18 ·
이름 14px · 4개 초과 시 「N개 더 보기」 · 하단 고정 `N편 보기`(파랑 채움 예외).

### 목록 행

```
[kind]  [날짜]                          [썸네일 239 × 134]
제목 (2줄 클램프)
요약 (2줄 클램프)
```

`HStack gap={5} vAlign="center"` · 텍스트 열 `flex: 1 1 0; min-width: 0`.

- 구분선 없음. **홀짝 배경도 쓰지 않는다** — kind 인코딩과 충돌한다.
- kind 라벨 11px/500/.1em · **텍스트 단계** 색
- 날짜 12px `secondary` tabular-nums
- 제목 SUITE 500 · 23 / 1.4 · −.02em · 2줄 클램프
- 요약 14 / 1.6 `secondary` · 2줄 (모바일 13.5)
- 썸네일 239 × 134 · 라운드 8 · `object-fit: cover` · **모바일 숨김**
- **없는 항목은 자리 자체를 없앤다.** 폴백 이미지를 만들지 않는다.

### 제목 호버 — 이 화면의 핵심

**제목이 분류 색으로 물들고 같은 색 밑줄이 왼쪽에서 오른쪽으로.**
색 140ms · 밑줄 280ms.

`background-image: linear-gradient(currentColor, currentColor)` +
`background-position: 0 100%` + `background-size: 0% 2px` → 호버 `100% 2px`.

**`display: inline`이 필수다.** 블록이면 밑줄이 컨테이너 폭을 채운다.
호버 색은 **기본색**. 대비 예외를 안고 간다 (공용 문서 참조).

같은 kind가 라벨(텍스트 단계)과 호버(기본색) 두 값을 갖는 것은 의도한 것이다 —
라벨은 계속 읽히는 정보, 호버는 스쳐 가는 상태다.

## 이 화면 고유 계산

### 패싯 카운트

각 옵션의 숫자는 **다른 축의 현재 선택을 반영한 결과 수**다. 자기 축은 제외하고 센다.

```
count(axis, value) = posts.filter(p =>
  AXIS_KEYS.every(k => k === axis
    ? true
    : (sel[k] ?? []).length === 0 || valuesOf(p, k).some(v => sel[k].includes(v)))
  && valuesOf(p, axis).includes(value)
).length
```

이래야 「이걸 고르면 몇 편이 되는가」가 맞는다. 전체 코퍼스 기준으로 세면 거짓말이 된다.

### 빈 상태 — 어느 축을 뺄지

```
culprit = argmax over axes with selection of
          posts.filter(p => matches(p, { ...sel, [axis]: [] })).length
```

하드코딩하지 않는다. 축을 특정할 수 없으면 「필터 해제」가 유일한 행동이 되므로
그때만 검정을 가져간다.

**빈 상태는 UI 조작으로 닿을 수 없다.** 패싯 카운트가 정확하면 실수로 0편에 도달할
경로가 막힌다. 빈 상태는 URL 직접 진입에서만 나온다 — 북마크 · 공유 링크 · 낡은 링크.
사용자가 그 조합을 **받아든** 것이므로 축 하나만 빼는 쪽이 최소 개입이다.

문구:
```
이 조합으로는 아직 쓴 글이 없다.        ← 26 / 22
회고 · PostgreSQL · 접근성 를           ← 14 / 1.65 · 칩 이름으로 조립
모두 만족하는 글이 없어.
[PostgreSQL만 빼기]  [필터 해제]        ← 강조 / 기본
```
세로 여백 88 / 96 · 가운데 · max 520 · **아이콘도 삽화도 쓰지 않는다.**
「N만 빼기」가 가리키는 칩의 테두리만 진하게 — 어느 축이 문제인지 화면이 먼저 말한다.

### 노출 편수

초기 10 · 증분 10. 필터가 바뀌면 초기값으로 되돌린다.

### URL

필터 상태는 URL이 진실이다 — `/posts?kind=회고&track=FE`.
공유 가능하고 북마크 가능해야 하며 뒤로 가기가 필터 이력을 따라야 한다.

## FSD

| 슬라이스 | 내용 |
|---|---|
| `_pages/posts-list/` | `PostsList` |
| `widgets/post-filter/` | `AxisFilters` · `ActiveFilterStrip` · `usePostFilters` |
| `entities/post/ui/` | `PostRow` · `KindLabel` |
| `shared/ui/` | `EmptyState` |

참조 구현: `../reference/`

## 미해결

정렬 옵션(지금 「최신순」 고정) · 축 다섯이 모두 차면 쿼리가 길어진다
