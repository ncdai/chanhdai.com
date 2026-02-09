"use client"

import { useMemo } from "react"

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import type { PackageManager } from "@/hooks/use-package-manager"
import { usePackageManager } from "@/hooks/use-package-manager"
import type { NpmCommands } from "@/types/unist"

import { CopyButton } from "./copy-button"
import { getIconForPackageManager } from "./icons"

export function CodeBlockCommand({
  __pnpm__,
  __yarn__,
  __npm__,
  __bun__,
}: NpmCommands) {
  const [packageManager, setPackageManager] = usePackageManager()

  const tabs = useMemo(() => {
    return {
      pnpm: __pnpm__,
      yarn: __yarn__,
      npm: __npm__,
      bun: __bun__,
    }
  }, [__pnpm__, __yarn__, __npm__, __bun__])

  return (
    <div className="relative overflow-hidden rounded-xl bg-code">
      <Tabs
        className="gap-0"
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as PackageManager)
        }}
      >
        <div className="px-4 shadow-[inset_0_-1px_0_0] shadow-border">
          <TabsList className="h-10 rounded-none bg-transparent p-0 dark:bg-transparent [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

            {Object.entries(tabs).map(([key]) => {
              return (
                <TabsTrigger
                  key={key}
                  className="h-7 rounded-lg p-0 px-2 font-mono"
                  value={key}
                >
                  {key}
                </TabsTrigger>
              )
            })}

            <TabsIndicator className="h-0.5 translate-y-0 rounded-none bg-foreground shadow-none dark:bg-foreground" />
          </TabsList>
        </div>

        {Object.entries(tabs).map(([key, value]) => {
          return (
            <TabsContent key={key} value={key}>
              <pre>
                <code
                  data-slot="code-block"
                  data-language="bash"
                  className="font-mono text-sm leading-none text-muted-foreground"
                >
                  <span className="select-none">$ </span>
                  {value}
                </code>
              </pre>
            </TabsContent>
          )
        })}
      </Tabs>

      <CopyButton
        className="absolute top-2 right-2 z-10"
        text={tabs[packageManager] || ""}
        event="copy_npm_command"
      />
    </div>
  )
}
