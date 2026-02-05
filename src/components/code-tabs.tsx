"use client"

import type { InstallationType } from "@/hooks/use-config"
import { useConfig } from "@/hooks/use-config"
import { cn } from "@/lib/utils"

import { Tabs } from "./base/ui/tabs"

export function CodeTabs({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  const [config, setConfig] = useConfig()

  const installationType = config.installationType || "cli"

  return (
    <Tabs
      className={cn(
        "gap-0 **:data-rehype-pretty-code-figure:last:mb-0",
        className
      )}
      value={installationType}
      onValueChange={(value) => {
        setConfig((prev) => ({
          ...prev,
          installationType: value as InstallationType,
        }))
      }}
      {...props}
    />
  )
}
