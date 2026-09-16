import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function SocialLinks01() {
  return (
    <div className="max-w-screen overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="relative border-x border-line">
          <div className="pointer-events-none absolute inset-0 -z-1 hidden gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3">
            <div className="border-r border-line" />
            <div className="border-l border-line md:border-x" />
            <div className="border-l border-line max-md:hidden" />
          </div>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {SOCIAL_LINKS.map((link, index) => {
              return (
                <li
                  key={index}
                  className={cn(
                    "max-sm:screen-line-top max-sm:screen-line-bottom",
                    "sm:max-md:nth-[2n+1]:screen-line-top sm:max-md:nth-[2n+1]:screen-line-bottom",
                    "md:nth-[3n+1]:screen-line-top md:nth-[3n+1]:screen-line-bottom"
                  )}
                >
                  <SocialLinkItem {...link} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

type SocialLink = {
  icon: string
  title: string
  href: string
}

function SocialLinkItem({ icon, title, href }: SocialLink) {
  return (
    <div className="relative flex cursor-pointer items-center gap-4 p-4 pr-2 transition-[background-color] ease-out hover:bg-accent/50 dark:hover:bg-accent/20">
      <div className="relative shrink-0 [--image-radius:var(--radius-lg)]">
        <img
          className="size-8 rounded-(--image-radius) select-none"
          src={icon}
          alt={`${title} logo`}
        />
        <div className="pointer-events-none absolute inset-0 rounded-(--image-radius) inset-ring-1 inset-ring-black/10 dark:inset-ring-white/15" />
      </div>

      <h3 className="flex-1 font-medium">
        <a href={href} target="_blank" rel="noopener">
          <span className="absolute inset-0" aria-hidden />
          {title}
        </a>
      </h3>

      <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground" />
    </div>
  )
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: "https://assets.chanhdai.com/images/link-icons/x.webp",
    title: "X",
    href: "https://x.com/iamncdai",
  },
  {
    icon: "https://assets.chanhdai.com/images/link-icons/github.webp",
    title: "GitHub",
    href: "https://github.com/ncdai",
  },
  {
    icon: "https://assets.chanhdai.com/images/link-icons/linkedin.webp",
    title: "LinkedIn",
    href: "https://linkedin.com/in/ncdai",
  },
  {
    icon: "https://assets.chanhdai.com/images/link-icons/dailydotdev.webp",
    title: "daily.dev",
    href: "https://app.daily.dev/ncdai",
  },
  {
    icon: "https://assets.chanhdai.com/images/link-icons/discord.webp",
    title: "Discord",
    href: "https://discord.com/users/1186630645443739651",
  },
  {
    icon: "https://assets.chanhdai.com/images/link-icons/youtube.webp",
    title: "YouTube",
    href: "https://www.youtube.com/@ncdai",
  },
]
