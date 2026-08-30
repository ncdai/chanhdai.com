import { cn } from "@/lib/utils"

function HandwrittenNote({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="handwritten-note"
      className={cn(
        "pointer-events-none absolute font-handwritten text-xl/none tracking-normal text-muted-foreground select-none",
        className
      )}
      {...props}
    />
  )
}

/** Points down-left. Rotate or mirror it to aim at the subject. */
function HandwrittenArrow({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      className={cn("size-8 shrink-0 text-muted-foreground", className)}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M34 4c1 15-5 26-21 30" />
      <path d="m21 36-8-2 7-7" />
    </svg>
  )
}

export { HandwrittenArrow, HandwrittenNote }
