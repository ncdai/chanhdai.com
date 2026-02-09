"use client"

import { motion } from "motion/react"
import { useRef } from "react"

import { registryConfig } from "@/config/registry"
import type { PackageManager } from "@/hooks/use-package-manager"
import { usePackageManager } from "@/hooks/use-package-manager"
import { components } from "@/registry/components/_registry"
import { FlipSentences } from "@/registry/components/flip-sentences"

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
        <div className="px-4 shadow-[inset_0_-1px_0_0] shadow-edge">
          <TabsList className="h-10 rounded-none bg-transparent p-0 dark:bg-transparent [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

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

            <TabsIndicator className="h-0.5 translate-y-0 rounded-none bg-foreground shadow-none dark:bg-foreground" />
          </TabsList>
        </div>

        <pre className="-translate-y-px p-4">
          <code
            data-language="bash"
            className="block font-pixel-square text-sm text-muted-foreground max-sm:leading-6"
          >
            {Object.entries(pmCommands).map(([key, command]) => {
              return (
                <TabsContent
                  key={key}
                  value={key}
                  render={<span className="block sm:inline-block" />}
                >
                  <span className="select-none">$ </span>
                  {command} shadcn add{" "}
                  <span className="select-none sm:hidden" aria-hidden="true">
                    \
                  </span>
                </TabsContent>
              )
            })}

            <span>{registryConfig.namespace}/</span>

            <FlipSentences
              className="text-foreground"
              as={motion.span}
              variants={{
                initial: { y: -12, opacity: 0 },
                animate: { y: 0, opacity: 1 },
                exit: { y: 12, opacity: 0 },
              }}
              onIndexChange={(index: number) => {
                currentItemRef.current = registryItemNames[index]
              }}
            >
              {registryItemNames}
            </FlipSentences>
          </code>
        </pre>
      </Tabs>

      <CopyButton
        className="absolute top-1.5 right-1.5 z-10"
        size="icon-sm"
        text={() => {
          const baseCommand = pmCommands[packageManager] || pmCommands["pnpm"]
          return `${baseCommand} shadcn add ${registryConfig.namespace}/${currentItemRef.current}`
        }}
        event="copy_npm_command"
      />
    </div>
  )
}
