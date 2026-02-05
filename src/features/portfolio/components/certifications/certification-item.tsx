import { format } from "date-fns"
import { ArrowUpRightIcon, CircleCheckBigIcon } from "lucide-react"
import Image from "next/image"

import { getIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

import type { Certification } from "../../types/certifications"

export function CertificationItem({
  className,
  certification,
}: {
  className?: string
  certification: Certification
}) {
  return (
    <a
      className={cn(
        "group flex items-center pr-2 hover:bg-accent-muted",
        className
      )}
      href={certification.credentialURL}
      target="_blank"
      rel="noopener"
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
            "mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg select-none",
            "border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background",
            "bg-muted text-muted-foreground [&_svg]:size-4"
          )}
          aria-hidden
        >
          {getIcon(certification.issuerIconName) ?? <CircleCheckBigIcon />}
        </div>
      )}

      <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance underline-offset-4 group-hover:underline">
          {certification.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <dl>
            <dt className="sr-only">Issued by</dt>
            <dd>
              <span aria-hidden>@</span>
              <span className="ml-0.5">{certification.issuer}</span>
            </dd>
          </dl>

          <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          />

          <dl>
            <dt className="sr-only">Issued on</dt>
            <dd>
              <time dateTime={new Date(certification.issueDate).toISOString()}>
                {format(new Date(certification.issueDate), "dd.MM.yyyy")}
              </time>
            </dd>
          </dl>
        </div>
      </div>

      {certification.credentialURL && (
        <ArrowUpRightIcon
          className="size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45"
          aria-hidden
        />
      )}
    </a>
  )
}
