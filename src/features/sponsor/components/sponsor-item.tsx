import { cn } from "@/lib/utils"

export function SponsorItem({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex items-center justify-center transition-[background-color] ease-out hover:bg-accent-muted",
        "max-sm:screen-line-top max-sm:screen-line-bottom",
        "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom",
        className
      )}
      target="_blank"
      rel="noopener sponsored"
      {...props}
    />
  )
}
