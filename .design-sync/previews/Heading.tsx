import { Heading, Text, VStack } from '@audemodo/design-system';

/** Ported from apps/devlog post-detail-page: page title over a supporting summary. */
export const PageTitle = () => (
  <VStack gap={2} maxWidth={520}>
    <Heading level={1}>createdAt을 시각 단위로 바꾸고 비교·표시를 맞춘다</Heading>

    <Text as="p" color="secondary">
      날짜만 저장하던 필드를 시각까지 담도록 바꾸면서, 정렬 비교와 화면 표시가 같은 기준을 쓰도록
      정리했다.
    </Text>
  </VStack>
);

/** The primary axis: level drives both semantics (h1–h6) and visual size. */
export const Levels = () => (
  <VStack gap={3} maxWidth={520}>
    <Heading level={1}>Level 1 — 페이지 제목</Heading>
    <Heading level={2}>Level 2 — 섹션 제목</Heading>
    <Heading level={3}>Level 3 — 하위 섹션</Heading>
    <Heading level={4}>Level 4</Heading>
    <Heading level={5}>Level 5</Heading>
    <Heading level={6}>Level 6</Heading>
  </VStack>
);

/** Display types override the level's sizing with the larger display scale. */
export const DisplayTypes = () => (
  <VStack gap={3} maxWidth={520}>
    <Heading level={1} type="display-1">
      Display 1
    </Heading>

    <Heading level={2} type="display-2">
      Display 2
    </Heading>

    <Heading level={3} type="display-3">
      Display 3
    </Heading>
  </VStack>
);

export const Colors = () => (
  <VStack gap={2}>
    <Heading color="primary" level={3}>
      Primary
    </Heading>

    <Heading color="secondary" level={3}>
      Secondary
    </Heading>

    <Heading color="accent" level={3}>
      Accent
    </Heading>

    <Heading color="disabled" level={3}>
      Disabled
    </Heading>
  </VStack>
);

/** Alignment and truncation — statically renderable layout behaviours. */
export const Layout = () => (
  <VStack gap={3} maxWidth={320}>
    <Heading justify="start" level={4}>
      start 정렬
    </Heading>

    <Heading justify="center" level={4}>
      center 정렬
    </Heading>

    <Heading justify="end" level={4}>
      end 정렬
    </Heading>

    <Heading level={4} maxLines={1}>
      maxLines가 1이면 한 줄을 넘어가는 제목은 말줄임표로 잘린다
    </Heading>
  </VStack>
);
