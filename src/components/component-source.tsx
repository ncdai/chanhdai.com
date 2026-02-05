import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper"

export function ComponentSource({
  className,
  collapsible = true,
  children,
}: React.ComponentProps<"div"> & {
  name: string
  src?: string
  title?: string
  showLineNumbers?: boolean
  collapsible?: boolean
}) {
  if (!collapsible) {
    return <div className={className}>{children}</div>
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      {children}
    </CodeCollapsibleWrapper>
  )
}
