import type { Route } from "next"
import Link from "next/link"
import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"
import { getUsedBy } from "@/features/doc/data/used-by"
import type { DocDependency } from "@/features/doc/lib/doc-dependencies"
import { getDocDependencies } from "@/features/doc/lib/doc-dependencies"

export function DocDependencies({ name }: { name: string }) {
  const { packages, registryItems } = getDocDependencies(name)
  const usedBy = getUsedBy(name).map(({ name, url }) => ({ name, href: url }))

  if (
    packages.length === 0 &&
    registryItems.length === 0 &&
    usedBy.length === 0
  ) {
    return null
  }

  return (
    <div className="not-prose screen-dashed-line-top screen-dashed-line-bottom -mx-(--page-padding) my-8 before:opacity-80 after:opacity-80">
      <dl className="screen-line-top screen-line-bottom grid grid-cols-1 gap-px overflow-x-clip bg-line py-px sm:auto-cols-fr sm:grid-flow-col">
        <DependencyField label="Dependencies" dependencies={packages} />
        <DependencyField label="Registry" dependencies={registryItems} />
        {/* Followed links credit the products that use the component. */}
        <DependencyField label="Used by" dependencies={usedBy} follow />
      </dl>
    </div>
  )
}

function DependencyField({
  label,
  dependencies,
  follow = false,
}: {
  label: string
  dependencies: DocDependency[]
  follow?: boolean
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
              <DependencyName {...dependency} follow={follow} />
            </li>
          ))}
        </ul>
      </dd>
    </div>
  )
}

function DependencyName({
  name,
  href,
  follow,
}: DocDependency & { follow: boolean }) {
  if (!href) {
    return name
  }

  const isExternal = !href.startsWith("/")

  return (
    <Link
      className="link-underline"
      href={(isExternal ? addQueryParams(href, UTM_PARAMS) : href) as Route}
      target="_blank"
      rel={isExternal && !follow ? "nofollow noopener" : "noopener"}
    >
      {name}
    </Link>
  )
}
