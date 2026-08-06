import { Divider, HStack, Heading, Text, VStack } from '@audemodo/design-system';

/** Ported from apps/devlog post-detail-page — separating header from body. */
export const ArticleSeparator = () => (
  <VStack gap={4} maxWidth={420}>
    <VStack gap={2}>
      <Heading level={2}>디자인 시스템의 경계 설계</Heading>

      <Text as="p" color="secondary">
        벤더 컴포넌트를 그대로 노출하지 않고 경계를 두면 무엇이 좋아지는가.
      </Text>
    </VStack>

    <Divider />

    <Text as="p">
      경계를 두면 벤더가 바뀌어도 앱 코드는 그대로 둘 수 있다. 대신 재수출 비용을 계속 낸다.
    </Text>
  </VStack>
);

/** Visual weight — the primary variant axis. */
export const Variants = () => (
  <VStack gap={4} maxWidth={360}>
    <VStack gap={2}>
      <Text type="label">subtle (기본)</Text>
      <Divider variant="subtle" />
    </VStack>

    <VStack gap={2}>
      <Text type="label">strong</Text>
      <Divider variant="strong" />
    </VStack>
  </VStack>
);

/** A labelled divider renders the label centred in small secondary text. */
export const WithLabel = () => (
  <VStack gap={4} maxWidth={360}>
    <Divider label="2026년 8월" />
    <Divider label="더 이전 글" variant="strong" />
  </VStack>
);

/** Vertical orientation, for separating inline content. */
export const Vertical = () => (
  <HStack gap={3} height={40} vAlign="center">
    <Text>초안</Text>
    <Divider orientation="vertical" />
    <Text>검토</Text>
    <Divider orientation="vertical" />
    <Text>발행</Text>
  </HStack>
);
