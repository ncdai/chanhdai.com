import { unstable_cache } from "next/cache"
import { addQueryParams } from "@/utils/url"
import { z } from "zod"

import { registryConfig } from "@/config/registry"
import { UTM_PARAMS } from "@/config/site"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const REGISTRIES_URL = "https://ui.shadcn.com/r/registries.json"
const DOCS_URL = "https://ui.shadcn.com/docs/registry/health"

// Checks run hourly, so anything older means the data stopped updating, either
// on their side or because our own fetch keeps failing and serving stale cache.
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000

const healthSchema = z.object({
  // BREAKDOWN maximums only hold for score version 1. Any other version fails
  // parsing, which hides the badge.
  scoreVersion: z.literal(1),
  status: z.enum(["observing", "healthy", "degraded", "unavailable"]),
  statusReason: z.object({ message: z.string() }),
  score: z.number(),
  breakdown: z.object({
    reliability: z.number(),
    correctness: z.number(),
    installability: z.number(),
    hygiene: z.number(),
  }),
  checkedAt: z.string().datetime(),
})

const registriesSchema = z.array(
  z.object({ name: z.string(), health: z.unknown().optional() })
)

type Health = z.infer<typeof healthSchema>

const STATUS: Record<Health["status"], { label: string; className: string }> = {
  observing: { label: "Observing", className: "bg-muted-foreground" },
  healthy: { label: "Healthy", className: "bg-success" },
  degraded: { label: "Degraded", className: "bg-amber-500" },
  unavailable: { label: "Unavailable", className: "bg-destructive" },
}

const BREAKDOWN: {
  key: keyof Health["breakdown"]
  label: string
  max: number
}[] = [
  { key: "reliability", label: "Reliability", max: 45 },
  { key: "correctness", label: "Correctness", max: 25 },
  { key: "installability", label: "Installability", max: 20 },
  { key: "hygiene", label: "Setup", max: 10 },
]

const POINTS_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
})

const CHECKED_AT_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
})

const getCachedHealth = unstable_cache(
  async () => {
    const response = await fetch(REGISTRIES_URL)

    // Throwing instead of returning null keeps the last good value in the cache
    // when ui.shadcn.com has a transient failure.
    if (!response.ok) {
      throw new Error(`Failed to fetch registries: ${response.status}`)
    }

    const registries = registriesSchema.parse(await response.json())
    const registry = registries.find(
      (item) => item.name === registryConfig.namespace
    )

    return healthSchema.safeParse(registry?.health).data ?? null
  },
  ["registry-health"],
  // Same interval as the header's GitHub stars, so the badge never makes the
  // page regenerate more often than it already does.
  { revalidate: 86400 }
)

async function getHealth(): Promise<Health | null> {
  try {
    const health = await getCachedHealth()

    if (!health) {
      return null
    }

    const age = Date.now() - new Date(health.checkedAt).getTime()
    return age > MAX_AGE_MS ? null : health
  } catch {
    return null
  }
}

export async function RegistryHealth({ className }: { className?: string }) {
  const health = await getHealth()

  if (!health) {
    return null
  }

  const status = STATUS[health.status]

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={0.1}
        closeDelay={0.1}
        render={
          <Button
            className={cn(
              "h-7 gap-1.5 rounded-full px-2.5 aria-expanded:bg-muted/80",
              className
            )}
            variant="outline"
            size="sm"
          >
            <span
              className={cn("size-2 rounded-full", status.className)}
              aria-hidden
            />
            <span className="sr-only">Registry health: </span>
            {status.label}
            <span className="text-muted-foreground tabular-nums">
              {POINTS_FORMATTER.format(health.score)}
              <span className="sr-only"> out of 100</span>
            </span>
          </Button>
        }
      />

      <PopoverContent className="gap-0 rounded-2xl bg-surface p-0" side="top">
        <PopoverHeader className="px-4 pt-4 pb-3">
          <PopoverTitle>Registry health</PopoverTitle>
          <PopoverDescription className="text-pretty">
            {health.statusReason.message}
          </PopoverDescription>
        </PopoverHeader>

        <dl className="mx-1 grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 rounded-xl bg-background p-3 tabular-nums ring-1 ring-border">
          {BREAKDOWN.map(({ key, label, max }) => (
            <div key={key} className="contents">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-right">
                {POINTS_FORMATTER.format(health.breakdown[key])}
                <span className="text-muted-foreground"> / {max}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-1 px-4 py-3 text-xs text-muted-foreground">
          <p>
            Checked {CHECKED_AT_FORMATTER.format(new Date(health.checkedAt))}{" "}
            UTC
          </p>
          <a
            className="w-fit text-foreground link-underline"
            href={addQueryParams(DOCS_URL, UTM_PARAMS)}
            target="_blank"
            rel="noopener"
          >
            How health is scored
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}
