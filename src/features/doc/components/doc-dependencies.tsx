import type { Route } from "next"
import Link from "next/link"
import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import type { DocDependency } from "@/features/doc/lib/doc-dependencies"
import { getDocDependencies } from "@/features/doc/lib/doc-dependencies"

export function DocDependencies({ name }: { name: string }) {
  const { packages, registryItems } = getDocDependencies(name)

  if (packages.length === 0 && registryItems.length === 0) {
    return null
  }

  return (
    <div className="not-prose screen-dashed-line-top screen-dashed-line-bottom -mx-(--page-padding) my-8 before:opacity-80 after:opacity-80">
      <dl className="screen-line-top screen-line-bottom grid grid-cols-1 gap-px overflow-x-clip bg-line py-px sm:auto-cols-fr sm:grid-flow-col">
        <DependencyField label="Dependencies" dependencies={packages} />
        <DependencyField label="Registry" dependencies={registryItems} />
      </dl>
    </div>
  )
}

function DependencyField({
  label,
  dependencies,
}: {
  label: string
  dependencies: DocDependency[]
}) {
  if (dependencies.length === 0) {
    return null
  }

  return (
    <div className="flex min-w-0 flex-col gap-1 bg-background px-4 py-3">
      <dt className="text-[0.625rem]/4 font-medium tracking-wider text-muted-foreground uppercase">
        {label} ({dependencies.length})
      </dt>
      <dd>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.8125rem]/5">
          {dependencies.map((dependency) => (
            <li key={dependency.name}>
              <DependencyName {...dependency} />
            </li>
          ))}
        </ul>
      </dd>
    </div>
  )
}

function DependencyName({ name, href }: DocDependency) {
  if (!href) {
    return name
  }

  const isExternal = !href.startsWith("/")

  return (
    <Link
      className="link-underline"
      href={(isExternal ? addQueryParams(href, UTM_PARAMS) : href) as Route}
      target="_blank"
      rel={isExternal ? "nofollow noopener" : "noopener"}
    >
      {name}
    </Link>
  )
}
