import { Text, VStack } from '@audemodo/design-system';

/** The canonical use, ported from apps/devlog post-detail-page. */
export const Paragraph = () => (
  <VStack gap={2} maxWidth={520}>
    <Text as="p">
      디자인 시스템은 앱이 벤더를 직접 참조하지 않도록 경계를 소유한다. 벤더가 바뀌어도 앱은
      그대로 둘 수 있다.
    </Text>

    <Text as="p" color="secondary">
      주소가 바뀌었거나 삭제된 글일 수 있습니다.
    </Text>
  </VStack>
);

/** The primary variant axis: semantic type determines size, weight and line-height. */
export const Types = () => (
  <VStack gap={3} maxWidth={520}>
    <Text type="display-1" as="h1">
      Display 1
    </Text>

    <Text type="display-2" as="h2">
      Display 2
    </Text>

    <Text type="display-3" as="h3">
      Display 3
    </Text>

    <Text type="large">Large — 본문보다 한 단계 큰 텍스트</Text>

    <Text type="body" as="p">
      Body — 기본 본문 텍스트. 대부분의 문단은 이 타입을 쓴다.
    </Text>

    <Text type="label">Label — 폼 레이블이나 짧은 설명</Text>

    <Text type="supporting" as="p">
      Supporting — 보조 설명. 색이 secondary로 기본 지정된다.
    </Text>

    <Text type="code">const theme = neutralTheme;</Text>
  </VStack>
);

export const Colors = () => (
  <VStack gap={2}>
    <Text color="primary">Primary — 기본 본문 색</Text>
    <Text color="secondary">Secondary — 보조 텍스트</Text>
    <Text color="accent">Accent — 강조</Text>
    <Text color="placeholder">Placeholder — 입력 자리표시</Text>
    <Text color="disabled">Disabled — 비활성</Text>
  </VStack>
);

export const Weights = () => (
  <VStack gap={2}>
    <Text weight="normal">Normal — 400</Text>
    <Text weight="medium">Medium — 500</Text>
    <Text weight="semibold">Semibold — 600</Text>
    <Text weight="bold">Bold — 700</Text>
  </VStack>
);

/** Truncation and tabular numbers — statically renderable text behaviours. */
export const Truncation = () => (
  <VStack gap={3} maxWidth={320}>
    <Text as="p" maxLines={2}>
      maxLines가 2이면 두 줄을 넘어가는 순간 말줄임표로 잘린다. 이 문단은 그 동작을 보여주기
      위해 일부러 길게 썼고, 잘린 뒤에는 hover 시 툴팁으로 전체 내용을 보여준다.
    </Text>

    <Text hasStrikethrough>취소선이 적용된 텍스트</Text>

    <Text hasTabularNumbers as="p">
      1,234,567 — tabular numbers
    </Text>
  </VStack>
);
