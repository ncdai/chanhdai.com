"use client"

import type { ComponentProps, ReactNode } from "react"

import {
  Collapsible,
  CollapsibleChevronDownIcon,
} from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import { Prose } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export interface ParameterNode {
  name: string
  description: ReactNode
}

export interface TypeNode {
  /**
   * Additional description of the field
   */
  description?: ReactNode

  /**
   * type signature (short)
   */
  type: ReactNode

  /**
   * type signature (full)
   */
  typeDescription?: ReactNode

  /**
   * Optional `href` for the type
   */
  typeDescriptionLink?: string

  default?: ReactNode

  required?: boolean
  deprecated?: boolean

  /**
   * a list of parameters info if the type is a function.
   */
  parameters?: ParameterNode[]

  example?: ReactNode

  returns?: ReactNode
}

export function TypeTable({
  id,
  type,
  className,
  ...props
}: ComponentProps<"div"> & { type: Record<string, TypeNode> }) {
  return (
    <div
      id={id}
      className={cn(
        "@container my-[1.25em] flex flex-col gap-px overflow-hidden rounded-xl bg-code p-1 text-sm",
        className
      )}
      {...props}
    >
      <div className="not-prose flex items-center px-3 py-2 font-medium text-muted-foreground">
        <p className="w-1/4">Prop</p>
        <p className="@max-xl:hidden">Type</p>
      </div>

      {Object.entries(type).map(([key, value]) => (
        <Item key={key} parentId={id} name={key} item={value} />
      ))}
    </div>
  )
}

function Item({
  parentId,
  name,
  item: {
    parameters = [],
    description,
    required = false,
    deprecated,
    typeDescription,
    default: defaultValue,
    type,
    typeDescriptionLink,
    example,
    returns,
  },
}: {
  parentId?: string
  name: string
  item: TypeNode
}) {
  const id = parentId ? `${parentId}-${name}` : undefined

  return (
    <Collapsible
      id={id}
      className="group/type-item rounded-lg ring-border ring-inset data-open:bg-background data-open:ring-1 data-open:not-last:mb-0.75"
    >
      <CollapsibleTrigger className="not-prose relative flex w-full flex-row items-center rounded-lg px-3 py-2 text-start text-[0.8125rem] ring-border outline-none ring-inset group-data-open/type-item:rounded-b-none group-data-open/type-item:ring-1 hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring/50 dark:hover:bg-[color-mix(in_oklab,var(--accent)_60%,var(--code))] [&_svg]:size-4">
        <code
          className={cn(
            "[--shiki-dark:#79B8FF] [--shiki-light:#005CC5]",
            "w-1/4 min-w-fit shrink-0 pe-2 font-mono font-medium text-(--shiki-light) dark:text-(--shiki-dark)",
            deprecated && "line-through opacity-50"
          )}
        >
          {name}
          {!required && "?"}
        </code>

        {typeDescriptionLink ? (
          <a
            href={typeDescriptionLink}
            className="underline underline-offset-4 @max-xl:hidden"
          >
            {type}
          </a>
        ) : (
          <span className="@max-xl:hidden">{type}</span>
        )}

        <div className="ml-auto shrink-0 text-muted-foreground" aria-hidden>
          <CollapsibleChevronDownIcon duration={0.15} />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="grid grid-cols-[1fr_3fr] gap-y-3 p-3 text-sm">
          <CustomProse className="col-span-full empty:hidden">
            {description}
          </CustomProse>

          {typeDescription != null && (
            <>
              <p className="not-prose pe-3 leading-5 text-muted-foreground">
                Type
              </p>
              <p className="not-prose my-auto">{typeDescription}</p>
            </>
          )}

          {defaultValue != null && (
            <>
              <p className="not-prose pe-3 leading-6 text-muted-foreground">
                Default
              </p>
              <p className="not-prose my-auto">{defaultValue}</p>
            </>
          )}

          {parameters.length > 0 && (
            <>
              <p className="not-prose pe-3 leading-6 text-muted-foreground">
                Parameters
              </p>
              <div className="grid gap-3">
                {parameters.map((param) => (
                  <div
                    key={param.name}
                    className="flex flex-wrap items-center gap-1"
                  >
                    <p className="not-prose leading-6 font-medium text-nowrap">
                      {param.name}
                      <span className="ml-1 font-normal">–</span>
                    </p>
                    <CustomProse>{param.description}</CustomProse>
                  </div>
                ))}
              </div>
            </>
          )}

          {example != null && (
            <>
              <p className="not-prose pe-3 leading-6 text-muted-foreground">
                Example
              </p>
              <CustomProse className="overflow-hidden">{example}</CustomProse>
            </>
          )}

          {returns != null && (
            <>
              <p className="not-prose pe-3 leading-6 text-muted-foreground">
                Returns
              </p>
              <CustomProse className="my-auto">{returns}</CustomProse>
            </>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CustomProse({ className, ...props }: ComponentProps<typeof Prose>) {
  return (
    <Prose
      className={cn(
        "prose-sm prose-no-margin prose-code:py-[1.5px] prose-code:text-[0.8125rem]",
        className
      )}
      {...props}
    />
  )
}
