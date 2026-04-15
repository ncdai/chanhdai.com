import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

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
      className={cn(
        "not-prose rounded-xl bg-surface text-surface-foreground",
        className
      )}
      {...props}
    >
      {icon}
      {title && (
        <AlertTitle className="[&_a]:decoration-1 [&_a]:underline-offset-3">
          {title}
        </AlertTitle>
      )}
      <AlertDescription className="text-surface-foreground/80 [&_a]:decoration-1 [&_a]:underline-offset-3">
        {children}
      </AlertDescription>
    </Alert>
  )
}
