import Image from "next/image"
import { CopyrightIcon, Stamp01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { ArrowUpRightIcon, CircleCheckBigIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { IconTile } from "@/components/ui/icon-tile"
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
 * Icons referenced by name in the data layer (`issuerIconName`): issuer
 * brand logos plus credential-kind marks ("trademark", "copyright").
 * Closed map so the bundle only retains the icons that can actually appear
 * here; unknown names fall back to a generic check badge in the UI below.
 */
const ISSUER_ICONS: Record<string, React.ReactNode> = {
  accenture: <AccentureIcon />,
  animationsdev: <AnimationsDevIcon />,
  copyright: <HugeiconsIcon icon={CopyrightIcon} />,
  coursera: <CourseraIcon />,
  google: <GoogleIcon />,
  meta: <MetaIcon />,
  microsoft: <MicrosoftIcon />,
  trademark: <HugeiconsIcon icon={Stamp01Icon} />,
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
        <IconTile className="mx-4">
          {(certification.issuerIconName
            ? ISSUER_ICONS[certification.issuerIconName]
            : null) ?? <CircleCheckBigIcon />}
        </IconTile>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-line p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance">
          <a href={certification.credentialURL} target="_blank" rel="noopener">
            <span className="absolute inset-0" aria-hidden />
            {certification.title}
          </a>
        </h3>

        <dl className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
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
