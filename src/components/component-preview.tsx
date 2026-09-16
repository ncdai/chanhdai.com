import type { ComponentPreviewTabsProps } from "./component-preview-tabs"
import { ComponentPreviewTabs } from "./component-preview-tabs"
import { ComponentSource } from "./component-source"

export function ComponentPreview({
  name,
  "data-code-meta": codeMeta,
  ...props
}: ComponentPreviewTabsProps & {
  "data-code-meta"?: string
}) {
  return (
    <ComponentPreviewTabs
      name={name}
      code={
        <ComponentSource
          name={name}
          collapsible="false"
          data-code-meta={codeMeta}
        />
      }
      {...props}
    />
  )
}
