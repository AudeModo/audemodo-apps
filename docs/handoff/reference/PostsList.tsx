// 참조 구현 — @audemodo/design-system 래퍼만 쓴다.
// 벤더를 앱에서 직접 import하지 않는다. 경계 검사기가 매 커밋 확인한다.
//
// _pages/posts-list/ui/PostsList.tsx
//
// 이 파일은 "형태"를 보여주는 것이고 그대로 붙여 쓸 코드가 아니다.
// 래퍼가 아직 내보내지 않는 것(필터 칩 · 팝오버 · 플로팅)은
// VStack/HStack + 테마 토큰으로 앱 안에 짜고, 두 번째 소비자가 생기면 래퍼로 올린다.

import {
  DesignSystemProvider,
  VStack, HStack, Card, Divider,
  Heading, Text, Link, List, ListItem,
} from '@audemodo/design-system';

// 슬라이스는 index.ts public API로만 노출한다.
// 의존 방향은 _pages → widgets → entities → shared 한 방향뿐이다.
import { AxisFilters, ActiveFilterStrip, usePostFilters } from '@/widgets/post-filter';
import { PostRow } from '@/entities/post';
import { EmptyState } from '@/shared/ui';

export function PostsList() {
  const {
    posts, total, results, shown, hasMore, remaining, showMore,
    axes, chips, sel, culprit, clearAll, clearAxis,
  } = usePostFilters();

  return (
    <DesignSystemProvider>
      {/* 간격은 숫자 스텝이다 — gap={4}, gap="16px"가 아니다 */}
      <VStack gap={6} maxWidth={1016} paddingInline={4}>
        <VStack gap={2}>
          <HStack gap={3} vAlign="baseline">
            <Heading level={1}>글</Heading>
            <Text type="label" color="secondary">{total}편</Text>
          </HStack>
          <Text as="p" color="secondary" maxWidth={671}>
            막힌 자리와 풀어낸 방법을 남긴다. 회고 · 트러블슈팅 · 학습 세 갈래.
          </Text>
        </VStack>

        {/* 축 다섯. 팝오버는 position:absolute — 열어도 아래 목록이 밀리지 않는다 */}
        <AxisFilters axes={axes} />

        <ActiveFilterStrip
          chips={chips}
          count={results.length}
          onClearAll={clearAll}
        />

        <Divider />

        {results.length === 0 ? (
          <EmptyState
            chips={chips}
            culprit={culprit}          {/* 계산으로 정한다 — 하드코딩 금지 */}
            onDropCulprit={() => culprit && clearAxis(culprit.key)}
            onClearAll={clearAll}
          />
        ) : (
          <>
            {/* 구분선 없음 · 항목 간 44 → gap={10}. hasDividers를 쓰지 않는다 */}
            <VStack gap={10}>
              {shown.map(post => (
                <PostRow key={post.slug} post={post} />
              ))}
            </VStack>

            {hasMore && (
              <HStack justify="center">
                <button type="button" onClick={showMore}>
                  더 보기 · {remaining}편 남음
                </button>
              </HStack>
            )}
          </>
        )}
      </VStack>
    </DesignSystemProvider>
  );
}
