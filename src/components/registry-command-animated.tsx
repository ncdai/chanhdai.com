"use client"

import { useRef } from "react"
import { motion } from "motion/react"

import { registryConfig } from "@/config/registry"
import type { PackageManager } from "@/hooks/use-package-manager"
import { usePackageManager } from "@/hooks/use-package-manager"
import { components } from "@/registry/components/_registry"
import { IconSwap, IconSwapItem } from "@/registry/components/icon-swap"
import { TextFlip } from "@/registry/components/text-flip"

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "./base/ui/tabs"
import { CopyButton } from "./copy-button"
import { getIconForPackageManager } from "./icons"

const pmCommands = {
  pnpm: "pnpm dlx",
  yarn: "yarn",
  npm: "npx",
  bun: "bunx --bun",
}

const registryItemNames = components
  .map((component) => component.name)
  .sort((a, b) =>
    a.localeCompare(b, "en", {
      sensitivity: "base",
    })
  )

export function RegistryCommandAnimated() {
  const [packageManager, setPackageManager] = usePackageManager()

  const currentItemRef = useRef(registryItemNames[0])

  return (
    <div className="relative overflow-hidden">
      <Tabs
        className="gap-0"
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as PackageManager)
        }}
      >
        <div className="px-4 shadow-[inset_0_-1px_0_0] shadow-line">
          <TabsList className="h-10 rounded-none bg-transparent p-0 inset-ring-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:text-muted-foreground">
            <IconSwap>
              <IconSwapItem className="mr-2" key={packageManager}>
                {getIconForPackageManager(packageManager)}
              </IconSwapItem>
            </IconSwap>

            {Object.entries(pmCommands).map(([key]) => {
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

            <TabsIndicator className="h-0.5 translate-y-0 rounded-none bg-foreground ring-0 dark:bg-foreground" />
          </TabsList>
        </div>

        <pre className="-translate-y-px p-4">
          <code
            data-language="bash"
            className="block font-mono text-sm text-muted-foreground max-sm:leading-6"
          >
            {Object.entries(pmCommands).map(([key, command]) => {
              return (
                <TabsContent
                  key={key}
                  value={key}
                  render={<span className="block sm:inline-block" />}
                >
                  {command} shadcn add{" "}
                  <span className="select-none sm:hidden" aria-hidden="true">
                    \
                  </span>
                </TabsContent>
              )
            })}

            <span>{registryConfig.namespace}/</span>

            <TextFlip
              className="text-foreground"
              as={motion.span}
              onIndexChange={(index: number) => {
                currentItemRef.current = registryItemNames[index]
              }}
            >
              {registryItemNames}
            </TextFlip>
          </code>
        </pre>
      </Tabs>

      <CopyButton
        className="absolute top-1.5 right-1.5 z-10 size-7 border-none text-muted-foreground"
        variant="ghost"
        size="icon-sm"
        text={() => {
          const baseCommand = pmCommands[packageManager] || pmCommands["pnpm"]
          return `${baseCommand} shadcn@latest add ${registryConfig.namespace}/${currentItemRef.current}`
        }}
        event="copy_npm_command"
      />
    </div>
  )
}
