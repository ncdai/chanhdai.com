import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Callout({
  title,
  icon,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode
}) {
  return (
    <Alert
      role="note"
      className={cn(
        "not-prose rounded-xl border-none bg-surface text-surface-foreground inset-ring-1 inset-ring-border/64",
        className
      )}
      {...props}
    >
      {icon}
      {title && (
        <AlertTitle className="[&_a]:link-underline">{title}</AlertTitle>
      )}
      <AlertDescription className="text-surface-foreground/80 [&_a]:link-underline [&_strong]:font-medium">
        {children}
      </AlertDescription>
    </Alert>
  )
}
