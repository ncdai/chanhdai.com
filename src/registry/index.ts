import type { Registry } from "shadcn/schema"

import { blocks } from "./blocks/registry-blocks"
import { components } from "./components/_registry"
import { examples } from "./examples/_registry"
import { hook } from "./hooks/_registry"
import { lib } from "./lib/_registry"

export const registry = {
  name: "ncdai",
  homepage: "https://chanhdai.com/components",
  items: [
    ...lib,
    ...hook,
    ...components,
    ...blocks,

    // Internal use only
    ...examples,
  ],
} satisfies Registry
