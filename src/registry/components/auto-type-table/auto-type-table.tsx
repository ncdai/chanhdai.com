import "server-only"

import type { ResolvedShikiConfig } from "fumadocs-core/highlight/config"
import type { GeneratedDoc, Generator } from "fumadocs-typescript"
import type { Nodes } from "hast"
import { type Jsx, toJsxRuntime } from "hast-util-to-jsx-runtime"
import type { ComponentProps, ReactNode } from "react"
import * as runtime from "react/jsx-runtime"

import { mdxCodeBlockComponents } from "@/components/mdx-code-block"
import {
  type ParameterNode,
  type TypeNode,
  TypeTable,
} from "@/registry/components/type-table"

import { markdownRenderer } from "./markdown"
import { parseTags } from "./parse-tags"

export interface BaseTypeTableProps {
  /**
   * The path to source TypeScript file.
   */
  path?: string

  /**
   * Exported type name to generate from.
   */
  name?: string

  /**
   * Set the type to generate from.
   *
   * When used with `name`, it generates the type with `name` as export name.
   *
   * ```ts
   * export const myName = MyType;
   * ```
   *
   * When `type` contains multiple lines, `export const` is not added.
   * You need to export it manually, and specify the type name with `name`.
   *
   * ```tsx
   * <AutoTypeTable
   *   path="./file.ts"
   *   type={`import { ReactNode } from "react"
   *   export const MyName = ReactNode`}
   *   name="MyName"
   * />
   * ```
   */
  type?: string
}

export interface GenerateTypeTableOptions {
  basePath?: string
  allowInternal?: boolean
}

export interface AutoTypeTableProps
  extends BaseTypeTableProps,
    ComponentProps<"div"> {
  generator: Generator

  shiki?: ResolvedShikiConfig
  options?: GenerateTypeTableOptions

  renderMarkdown?: (md: string) => Promise<ReactNode>
  renderType?: (type: string) => Promise<ReactNode>
}

export async function AutoTypeTable({
  generator,
  options,
  renderType: customRenderType,
  renderMarkdown: customRenderMarkdown,
  shiki,
  name,
  path,
  type,
  ...props
}: AutoTypeTableProps) {
  let renderType = customRenderType
  let renderMarkdown = customRenderMarkdown

  if (!renderType || !renderMarkdown) {
    const renderer = markdownRenderer(shiki)
    renderType ??= async (v) => toJsx(await renderer.renderTypeToHast(v))
    renderMarkdown ??= async (v) =>
      toJsx(await renderer.renderMarkdownToHast(v))
  }

  const output = (await generator.generateTypeTable(
    { name, path, type },
    options
  )) as GeneratedDoc[]

  return output.map(async (item) => {
    const entries = item.entries.map(
      async (entry): Promise<[string, TypeNode]> => {
        const tags = parseTags(entry.tags)
        const paramNodes: ParameterNode[] = []

        for (const param of tags.params ?? []) {
          paramNodes.push({
            name: param.name,
            description: param.description
              ? await renderMarkdown!(param.description)
              : undefined,
          })
        }

        return [
          entry.name,
          {
            type: await renderType!(entry.simplifiedType),
            typeDescription: await renderType!(entry.type),
            typeDescriptionLink: entry.typeHref,
            description: await renderMarkdown!(entry.description),
            default: tags.default ? await renderType!(tags.default) : undefined,
            parameters: paramNodes,
            required: entry.required,
            deprecated: entry.deprecated,
            returns: tags.returns
              ? await renderMarkdown!(tags.returns)
              : undefined,
          },
        ]
      }
    )

    return (
      <TypeTable
        key={item.name}
        id={`type-table-${item.id}`}
        type={Object.fromEntries(await Promise.all(entries))}
        {...props}
      />
    )
  })
}

function toJsx(hast: Nodes) {
  return toJsxRuntime(hast, {
    Fragment: runtime.Fragment,
    jsx: runtime.jsx as Jsx,
    jsxs: runtime.jsxs as Jsx,
    components: {
      ...mdxCodeBlockComponents,
    },
  })
}
