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
      className={cn("not-prose bg-surface text-surface-foreground", className)}
      {...props}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-surface-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  )
}
