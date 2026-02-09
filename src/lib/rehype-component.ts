import fs from "node:fs"
import path from "node:path"

import { u } from "unist-builder"
import { visit } from "unist-util-visit"

import { Index } from "@/__registry__/index"
import type { UnistNode, UnistTree } from "@/types/unist"

export function rehypeComponent() {
  // Thanks @shadcn/ui
  return async (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      // src prop overrides both name and fileName.
      const { value: srcPath } =
        (getNodeAttributeByName(node, "src") as {
          name: string
          value?: string
          type?: string
        }) || {}

      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value as string
        const fileName = getNodeAttributeByName(node, "fileName")?.value as
          | string
          | undefined

        if (!name && !srcPath) {
          return null
        }

        try {
          let src: string

          if (srcPath) {
            src = path.join(process.cwd(), srcPath)
          } else {
            const component = Index[name]
            src = fileName
              ? component.files.find((file: unknown) => {
                  if (typeof file === "string") {
                    return (
                      file.endsWith(`${fileName}.tsx`) ||
                      file.endsWith(`${fileName}.ts`)
                    )
                  }
                  return false
                }) || component.files[0]?.path
              : component.files[0]?.path
          }

          // Read the source file.
          const filePath = src
          let source = fs.readFileSync(filePath, "utf8")

          // Replace imports.
          // TODO: Use @swc/core and a visitor to replace this.
          // For now a simple regex should do.
          source = source.replaceAll(
            `@/registry/components/`,
            "@/components/ncdai/"
          )
          source = source.replaceAll(
            "@/components/base/ui/",
            "@/components/ncdai/base/"
          )
          source = source.replaceAll("export default", "export")

          const title = getNodeAttributeByName(node, "title")
          const showLineNumbers = getNodeAttributeByName(
            node,
            "showLineNumbers"
          )

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {},
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: [`language-${path.extname(filePath).slice(1)}`],
                  },
                  data: {
                    meta: [
                      title ? `title="${title.value}"` : "",
                      showLineNumbers ? "showLineNumbers" : "",
                    ].join(" "),
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            })
          )
        } catch (error) {
          console.error(error)
        }
      }

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string

        if (!name) {
          return null
        }

        try {
          const component = Index[name]

          const src = component.files[0]?.path

          // Read the source file.
          const filePath = src
          let source = fs.readFileSync(filePath, "utf8")

          // Replace imports.
          // TODO: Use @swc/core and a visitor to replace this.
          // For now a simple regex should do.
          source = source.replaceAll(
            `@/registry/components/`,
            "@/components/ncdai/"
          )
          source = source.replaceAll(
            "@/components/base/ui/",
            "@/components/ncdai/base/"
          )
          source = source.replaceAll("export default", "export")

          const codeMeta = getNodeAttributeByName(node, "data-code-meta")

          // Add code as children so that rehype can take over at build time.
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {},
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"],
                  },
                  data: {
                    meta: ["showLineNumbers"]
                      .concat(codeMeta ? [codeMeta.value as string] : [])
                      .join(" "),
                  },
                  children: [
                    {
                      type: "text",
                      value: source,
                    },
                  ],
                }),
              ],
            })
          )
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
