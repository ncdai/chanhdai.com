import { cn } from "@/lib/utils"

export type Testimonial2Props = {
  /** Full display name of the person giving the testimonial. */
  authorName: string
  /** Short tagline, title, or description of the person. */
  authorTagline: string
  /** Link to the person's profile, website, or social media page. */
  url: string
  /** The testimonial text content or recommendation message. */
  quote: string
  /** Additional CSS classes to apply to the testimonial container. */
  className?: string
}

export function Testimonial2({
  className,
  authorName,
  authorTagline,
  url,
  quote,
}: Testimonial2Props) {
  return (
    <figure className={cn("relative flex flex-col gap-6 pl-3", className)}>
      <blockquote className="relative block w-full font-serif text-xl text-foreground md:w-lg md:text-2xl">
        <span
          className="absolute -left-3 text-muted-foreground select-none"
          aria-hidden="true"
        >
          “
        </span>
        <p className="inline text-pretty">{quote}</p>
        <span
          className="absolute translate-x-0.5 text-muted-foreground select-none"
          aria-hidden="true"
        >
          ”
        </span>
      </blockquote>

      <figcaption className="ml-auto flex w-full items-center gap-2 md:w-1/2">
        <div className="hidden h-px grow translate-y-px bg-border md:block" />

        <div className="flex flex-col md:ml-auto md:text-right">
          <span className="text-sm/none font-medium">
            <a href={url} target="_blank" rel="noopener">
              <span className="absolute inset-0" aria-hidden />
              {authorName}
            </a>
            <span className="mt-1 block text-muted-foreground md:mt-0 md:inline">
              <span className="hidden text-foreground md:inline">, </span>
              {authorTagline}
            </span>
          </span>
        </div>
      </figcaption>
    </figure>
  )
}
