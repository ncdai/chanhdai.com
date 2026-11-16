import { registry } from "@/registry"
import { getRegistryItemNamespace, getRegistryItemUrl } from "@/utils/registry"
import type { RegistryItem } from "shadcn/schema"

import { registryConfig } from "@/config/registry"

// Listing every file of a large item buries the steps that matter.
const MAX_LISTED_FILES = 5

const TYPE_DIRECTORIES: Record<string, string> = {
  "registry:component": "components",
  "registry:ui": "components/ui",
  "registry:hook": "hooks",
  "registry:lib": "lib",
}

type InstallPromptExpectations = {
  files: string[]
  shadcnItems: string[]
  registryItems: string[]
  packages: string[]
  hasCss: boolean
}

export function getInstallPrompt(
  name: string,
  items: RegistryItem[] = registry.items
) {
  const item = items.find((item) => item.name === name)

  if (!item) {
    return null
  }

  const expected = getInstallExpectations(name, items)
  const title = item.title ?? item.name

  const steps = [
    [
      "Check the project setup:",
      "   - components.json must exist at the project root. If it doesn't, stop and ask me before running `shadcn init`.",
      "   - The project must use Tailwind CSS v4. If it uses v3, stop and tell me.",
    ],
    [
      "Run this with the project's package manager (npx, pnpm dlx, yarn dlx or bunx):",
      `   shadcn@latest add ${getRegistryItemNamespace(item.name)}`,
      "   If the CLI asks to overwrite a file, answer no and tell me which file.",
    ],
    [
      "Confirm the CLI added (paths are relative to the aliases in components.json):",
      ...formatFiles(expected.files).map((file) => `   - ${file}`),
      ...toListLine("shadcn/ui", expected.shadcnItems),
      ...toListLine("Registry items", expected.registryItems),
      ...toListLine("npm packages", expected.packages),
      ...(expected.hasCss
        ? ["   - CSS rules or variables in the CSS file from components.json"]
        : []),
    ],
    ...(expected.shadcnItems.length > 0
      ? [
          [
            "Only if the project uses Radix UI (`style` in components.json is `radix-*`, `new-york` or `default`): convert Base UI props on shadcn/ui components to Radix, e.g. `render={<a />}` becomes `asChild` with an `<a>` child and `nativeButton` is dropped. Keep behavior and styling.",
          ],
        ]
      : []),
    ["Run the project's type check and fix only errors in the files above."],
    ...(item.docs
      ? [
          [
            `Read ${item.docs}.md for usage and props, then tell me what was installed.`,
          ],
        ]
      : [["Tell me what was installed."]]),
  ]

  return [
    `Install ${title} from the ${registryConfig.namespace} shadcn registry into this project.`,
    ...steps.map((lines, index) => `${index + 1}. ${lines.join("\n")}`),
  ].join("\n\n")
}

export function getInstallExpectations(
  name: string,
  items: RegistryItem[] = registry.items
): InstallPromptExpectations {
  const itemsByUrl = new Map(
    items.map((item) => [getRegistryItemUrl(item.name), item])
  )
  const rootItem = items.find((item) => item.name === name)

  const shadcnItems = new Set<string>()
  const packages = new Set<string>()
  const visited = new Set<string>()
  let hasCss = false

  // Follows local items because `shadcn add` installs their dependencies too.
  const collect = (item: RegistryItem) => {
    if (visited.has(item.name)) {
      return
    }
    visited.add(item.name)

    hasCss ||= Boolean(item.css || item.cssVars)

    for (const packageName of [
      ...(item.dependencies ?? []),
      ...(item.devDependencies ?? []),
    ]) {
      packages.add(packageName)
    }

    for (const dependency of item.registryDependencies ?? []) {
      const localItem = itemsByUrl.get(dependency)

      if (localItem) {
        collect(localItem)
      } else if (!dependency.includes("/")) {
        shadcnItems.add(dependency)
      }
    }
  }

  if (rootItem) {
    collect(rootItem)
  }

  return {
    files: (rootItem?.files ?? []).map(getFilePath),
    shadcnItems: [...shadcnItems],
    registryItems: (rootItem?.registryDependencies ?? [])
      .filter((dependency) => dependency.includes("/"))
      .map((dependency) => {
        const localItem = itemsByUrl.get(dependency)
        return localItem ? getRegistryItemNamespace(localItem.name) : dependency
      }),
    packages: [...packages],
    hasCss,
  }
}

function getFilePath(file: NonNullable<RegistryItem["files"]>[number]) {
  if (file.target) {
    return file.target.replace(/^@/, "")
  }

  const fileName = file.path.split("/").pop()
  const directory = TYPE_DIRECTORIES[file.type]

  return directory ? `${directory}/${fileName}` : `${fileName}`
}

function formatFiles(files: string[]) {
  if (files.length <= MAX_LISTED_FILES) {
    return files
  }

  return [`${getCommonDirectory(files)}/ (${files.length} files)`]
}

function getCommonDirectory(files: string[]) {
  const [first, ...rest] = files.map((file) => file.split("/").slice(0, -1))
  const length = first.findIndex(
    (segment, index) => !rest.every((parts) => parts[index] === segment)
  )

  return first.slice(0, length === -1 ? undefined : length).join("/")
}

function toListLine(label: string, values: string[]) {
  return values.length > 0 ? [`   - ${label}: ${values.join(", ")}`] : []
}
