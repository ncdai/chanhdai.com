import { registry } from "@/registry"
import { getRegistryItemUrl } from "@/utils/registry"
import type { RegistryItem } from "shadcn/schema"

import { REGISTRY_ITEM_URLS } from "@/config/registry-item-urls"

export type DocDependency = {
  name: string
  href?: string
}

type DocDependencies = {
  packages: DocDependency[]
  registryItems: DocDependency[]
}

export function getDocDependencies(
  name: string,
  items: RegistryItem[] = registry.items
): DocDependencies {
  const rootItem = items.find((item) => item.name === name)

  if (!rootItem) {
    return { packages: [], registryItems: [] }
  }

  const itemsByUrl = new Map(
    items.map((item) => [getRegistryItemUrl(item.name), item])
  )

  // Follows items hosted here so the list matches what `shadcn add` installs.
  // Items from other registries can't be resolved without a network request.
  const packages = new Set<string>()
  const visited = new Set<string>()
  const collectPackages = (item: RegistryItem) => {
    if (visited.has(item.name)) {
      return
    }
    visited.add(item.name)

    for (const packageName of [
      ...(item.dependencies ?? []),
      ...(item.devDependencies ?? []),
    ]) {
      packages.add(packageName)
    }

    for (const dependency of item.registryDependencies ?? []) {
      const localItem = itemsByUrl.get(dependency)
      if (localItem) {
        collectPackages(localItem)
      }
    }
  }
  collectPackages(rootItem)

  return {
    packages: Array.from(packages, (packageName) => ({
      name: packageName,
      href: `https://www.npmjs.com/package/${packageName}`,
    })),
    registryItems: (rootItem.registryDependencies ?? []).map((dependency) =>
      toRegistryDependency(dependency, itemsByUrl.get(dependency))
    ),
  }
}

export function getDocDependencyLines(
  name: string,
  items: RegistryItem[] = registry.items
) {
  const { packages, registryItems } = getDocDependencies(name, items)

  return [
    toTextLine("Dependencies", packages),
    toTextLine("Registry dependencies", registryItems),
  ].filter((line) => line !== null)
}

function toRegistryDependency(
  dependency: string,
  localItem?: RegistryItem
): DocDependency {
  if (localItem) {
    return { name: localItem.name, href: getDocsHref(localItem.docs) }
  }

  // Bare names resolve to shadcn/ui, this project uses its Base UI variant.
  if (!dependency.includes("/")) {
    return {
      name: dependency,
      href: `https://ui.shadcn.com/docs/components/base/${dependency}`,
    }
  }

  return { name: dependency, href: getThirdPartyItemHref(dependency) }
}

function getThirdPartyItemHref(dependency: string) {
  const [namespace, name] = dependency.split("/")

  return REGISTRY_ITEM_URLS[namespace]?.replace("{name}", name)
}

function getDocsHref(docs?: string) {
  return docs?.startsWith(`${registry.homepage}/`)
    ? new URL(docs).pathname
    : docs
}

function toTextLine(label: string, dependencies: DocDependency[]) {
  if (dependencies.length === 0) {
    return null
  }

  return `${label}: ${dependencies.map(({ name }) => name).join(", ")}`
}
