import type { Testimonial as TestimonialType } from "@/features/portfolio/types/testimonials"
import { cn } from "@/lib/utils"

export function Testimonial({
  className,
  authorName,
  authorTagline,
  url,
  quote,
}: TestimonialType & { className?: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className={cn("not-prose my-12 flex flex-col gap-6 pl-3", className)}
    >
      <div className="relative block w-full font-serif text-2xl text-foreground md:w-lg">
        <span className="absolute -left-3 text-muted-foreground">“</span>
        <p className="inline text-pretty">{quote}</p>
        <span className="absolute translate-x-0.5 text-muted-foreground">
          ”
        </span>
      </div>

      <div className="ml-auto flex w-full items-center gap-2 md:w-1/2">
        <div className="hidden h-px grow translate-y-px bg-border md:block" />

        <div className="flex flex-col md:ml-auto md:text-right">
          <span className="text-sm leading-none font-medium">
            {authorName}
            <span className="mt-1 block text-muted-foreground md:mt-0 md:inline">
              <span className="hidden text-foreground md:inline">, </span>
              {authorTagline}
            </span>
          </span>
        </div>
      </div>
    </a>
  )
}
