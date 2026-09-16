import fs from "node:fs"
import path from "node:path"
import { u } from "unist-builder"
import { visit } from "unist-util-visit"

import type { UnistNode, UnistTree } from "@/types/unist"
import { Index } from "@/registry/__index__"

import { fixImport } from "./registry"

type NodeToProcess = {
  node: UnistNode
  type: "ComponentSource" | "ComponentPreview"
  name: string
  fileName?: string
  srcPath?: string
}

export function rehypeComponent() {
  // Thanks @shadcn/ui
  return async (tree: UnistTree) => {
    const nodesToProcess: NodeToProcess[] = []

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

        if (name || srcPath) {
          nodesToProcess.push({
            node,
            type: "ComponentSource",
            name,
            fileName,
            srcPath,
          })
        }
      }

      if (node.name === "ComponentPreview") {
        const name = getNodeAttributeByName(node, "name")?.value as string

        if (name) {
          nodesToProcess.push({
            node,
            type: "ComponentPreview",
            name,
          })
        }
      }
    })

    await Promise.all(
      nodesToProcess.map(async (item) => {
        if (item.type === "ComponentSource") {
          try {
            let src: string

            if (item.srcPath) {
              src = path.join(
                /*turbopackIgnore: true*/ process.cwd(),
                item.srcPath
              )
            } else {
              const component = Index[item.name]
              src = item.fileName
                ? component.files.find((file: unknown) => {
                    if (typeof file === "string") {
                      return (
                        file.endsWith(`${item.fileName}.tsx`) ||
                        file.endsWith(`${item.fileName}.ts`)
                      )
                    }
                    return false
                  }) || component.files[0]?.path
                : component.files[0]?.path
            }

            // Read the source file.
            const filePath = src
            const raw = fs.readFileSync(
              /*turbopackIgnore: true*/ filePath,
              "utf8"
            )
            const source = fixImport(raw)

            const title = getNodeAttributeByName(item.node, "title")
            const showLineNumbers = getNodeAttributeByName(
              item.node,
              "showLineNumbers"
            )
            const codeMeta = getNodeAttributeByName(item.node, "data-code-meta")

            // Add code as children so that rehype can take over at build time.
            item.node.children?.push(
              u("element", {
                tagName: "pre",
                properties: {},
                children: [
                  u("element", {
                    tagName: "code",
                    properties: {
                      className: [
                        `language-${path.extname(filePath).slice(1)}`,
                      ],
                    },
                    data: {
                      meta: [
                        title ? `title="${title.value}"` : "",
                        showLineNumbers ? "showLineNumbers" : "",
                      ]
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

        if (item.type === "ComponentPreview") {
          try {
            const component = Index[item.name]

            const src = component.files[0]?.path

            // Read the source file.
            const filePath = src
            const raw = fs.readFileSync(
              /*turbopackIgnore: true*/ filePath,
              "utf8"
            )
            const source = fixImport(raw)

            const codeMeta = getNodeAttributeByName(item.node, "data-code-meta")

            // Add code as children so that rehype can take over at build time.
            item.node.children?.push(
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
                      meta: codeMeta?.value ?? "",
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
    )
  }
}

function getNodeAttributeByName(node: UnistNode, name: string) {
  return node.attributes?.find((attribute) => attribute.name === name)
}
