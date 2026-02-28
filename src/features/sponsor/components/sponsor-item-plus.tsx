import { PlusIcon } from "@/components/animated-icons/plus"
import { SPONSORSHIP_URL } from "@/config/site"
import { cn } from "@/lib/utils"

export function SponsorItemPlus() {
  return (
    <a
      className={cn(
        "flex min-h-20 items-center justify-center transition-[background-color] ease-out hover:bg-accent-muted",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={SPONSORSHIP_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <PlusIcon
        className="flex size-full items-center justify-center text-muted-foreground"
        size={24}
        aria-hidden="true"
      />
      <span className="sr-only">Sponsor My Work</span>
    </a>
  )
}
