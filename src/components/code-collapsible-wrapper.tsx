import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  return (
    <Collapsible
      className={cn(
        "group/collapsible not-prose relative my-[1.25em] overflow-hidden rounded-xl",
        className
      )}
      {...props}
    >
      <CollapsibleContent
        className="overflow-hidden *:data-rehype-pretty-code-figure:my-0 **:data-rehype-pretty-code-figure:rounded-none data-[state=closed]:max-h-80"
        forceMount
      >
        {children}
      </CollapsibleContent>

      <div className="absolute inset-x-0 bottom-0 flex h-32 items-end justify-center bg-linear-to-t from-code from-50% to-transparent pb-4 group-data-[state=open]/collapsible:hidden">
        <CollapsibleTrigger asChild>
          <Button variant="outline">Expand</Button>
        </CollapsibleTrigger>
      </div>
    </Collapsible>
  )
}
