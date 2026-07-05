import Image from "next/image"
import { format } from "date-fns"
import { ArrowUpRightIcon, CircleCheckBigIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/base/ui/separator"
import {
  AccentureIcon,
  AnimationsDevIcon,
  CourseraIcon,
  GoogleIcon,
  MetaIcon,
  MicrosoftIcon,
  VercelIcon,
} from "@/components/icons"

import type { Certification } from "../../types/certifications"

/**
 * Issuer logos referenced by name in the data layer (`issuerIconName`).
 * Closed map so the bundle only retains the icons that can actually appear
 * here; unknown names fall back to a generic check badge in the UI below.
 */
const ISSUER_ICONS: Record<string, React.ReactNode> = {
  accenture: <AccentureIcon />,
  animationsdev: <AnimationsDevIcon />,
  coursera: <CourseraIcon />,
  google: <GoogleIcon />,
  meta: <MetaIcon />,
  microsoft: <MicrosoftIcon />,
  vercel: <VercelIcon />,
}

export function CertificationItem({
  className,
  certification,
}: {
  className?: string
  certification: Certification
}) {
  return (
    <div
      className={cn(
        "relative flex items-center pr-2 hover:bg-accent-muted",
        className
      )}
    >
      {certification.issuerLogoURL ? (
        <Image
          src={certification.issuerLogoURL}
          alt={certification.issuer}
          width={32}
          height={32}
          quality={100}
          className="mx-4 flex size-6 shrink-0 select-none dark:grayscale"
          unoptimized
          aria-hidden
        />
      ) : (
        <div
          className={cn(
            "mx-4 flex size-6 shrink-0 items-center justify-center rounded-md select-none",
            "border border-muted-foreground/15 ring-1 ring-line ring-offset-1 ring-offset-background",
            "bg-muted text-muted-foreground [&_svg]:size-4"
          )}
        >
          {(certification.issuerIconName
            ? ISSUER_ICONS[certification.issuerIconName]
            : null) ?? <CircleCheckBigIcon />}
        </div>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-line p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance">
          <a href={certification.credentialURL} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {certification.title}
          </a>
        </h3>

        <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <div>
            <dt className="sr-only">Issued by</dt>
            <dd>
              <span aria-hidden>@</span>
              <span className="ml-0.5">{certification.issuer}</span>
            </dd>
          </div>

          <Separator
            className="data-vertical:h-4 data-vertical:self-center"
            orientation="vertical"
            aria-hidden
          />

          <div>
            <dt className="sr-only">Issued on</dt>
            <dd>
              <time dateTime={new Date(certification.issueDate).toISOString()}>
                {format(new Date(certification.issueDate), "dd.MM.yyyy")}
              </time>
            </dd>
          </div>
        </dl>
      </div>

      {certification.credentialURL && (
        <ArrowUpRightIcon className="size-4 text-muted-foreground" />
      )}
    </div>
  )
}
