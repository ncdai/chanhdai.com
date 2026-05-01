import { UTM_PARAMS } from "@/config/site"
import { SPONSORS } from "@/features/sponsor/data"
import { addQueryParams } from "@/utils/url"

const GOLD_SPONSORS = SPONSORS.filter((sponsor) => sponsor.tier === "gold")

export function DocSponsors() {
  return (
    <aside
      className="not-prose my-[1.25em] rounded-xl bg-surface p-1"
      aria-labelledby="doc-sponsors-heading"
    >
      <h2
        id="doc-sponsors-heading"
        className="px-3 pt-2 pb-3 font-heading text-sm/none font-medium text-muted-foreground"
      >
        Gold Sponsors
      </h2>

      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
        {GOLD_SPONSORS.map((item) => (
          <li key={item.name}>
            <a
              className="flex items-center justify-center rounded-[9px] border bg-background text-foreground [&_svg]:w-full [&_svg]:max-w-75 [&_svg]:shrink-0"
              href={addQueryParams(item.url, UTM_PARAMS)}
              target="_blank"
              rel="noopener sponsored"
              aria-label={`${item.name} logo`}
            >
              <item.logo aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
