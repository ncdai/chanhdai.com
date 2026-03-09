"use client"

import { useTheme } from "next-themes"
import type { ToasterProps } from "sonner"
import { Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: cn(
            "group-[.toaster]:border-none! group-[.toaster]:shadow-lg!",
            "group-[.toaster]:ring-1! group-[.toaster]:ring-foreground/10! dark:group-[.toaster]:ring-border!"
          ),
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-xl)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
