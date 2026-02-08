import { visit } from "unist-util-visit"

import type { UnistNode, UnistTree } from "@/types/unist"

export function rehypeNpmCommand() {
  // Thanks @shadcn/ui
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return
      }

      // npm install
      if (node.properties?.["__rawString__"]?.startsWith("npm install")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__pnpm__"] = npmCommand.replaceAll(
          "npm install",
          "pnpm add"
        )
        node.properties["__yarn__"] = npmCommand.replaceAll(
          "npm install",
          "yarn add"
        )
        node.properties["__npm__"] = npmCommand
        node.properties["__bun__"] = npmCommand.replaceAll(
          "npm install",
          "bun add"
        )
      }

      // npx create-
      if (node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__pnpm__"] = npmCommand.replace(
          "npx create-",
          "pnpm create "
        )
        node.properties["__yarn__"] = npmCommand.replace(
          "npx create-",
          "yarn create "
        )
        node.properties["__npm__"] = npmCommand
        node.properties["__bun__"] = npmCommand.replace("npx", "bunx --bun")
      }

      // npm create
      if (node.properties?.["__rawString__"]?.startsWith("npm create")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__pnpm__"] = npmCommand.replace(
          "npm create",
          "pnpm create"
        )
        node.properties["__yarn__"] = npmCommand.replace(
          "npm create",
          "yarn create"
        )
        node.properties["__npm__"] = npmCommand
        node.properties["__bun__"] = npmCommand.replace(
          "npm create",
          "bun create"
        )
      }

      // npx
      if (
        node.properties?.["__rawString__"]?.startsWith("npx") &&
        !node.properties?.["__rawString__"]?.startsWith("npx create-")
      ) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__pnpm__"] = npmCommand.replace("npx", "pnpm dlx")
        node.properties["__yarn__"] = npmCommand.replace("npx", "yarn")
        node.properties["__npm__"] = npmCommand
        node.properties["__bun__"] = npmCommand.replace("npx", "bunx --bun")
      }

      // npm run
      if (node.properties?.["__rawString__"]?.startsWith("npm run")) {
        const npmCommand = node.properties?.["__rawString__"]
        node.properties["__pnpm__"] = npmCommand.replace("npm run", "pnpm")
        node.properties["__yarn__"] = npmCommand.replace("npm run", "yarn")
        node.properties["__npm__"] = npmCommand
        node.properties["__bun__"] = npmCommand.replace("npm run", "bun")
      }
    })
  }
}
