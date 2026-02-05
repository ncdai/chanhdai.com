import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/nextjs"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { ConsentManagerClient } from "./consent-manager-client"

export function ConsentManager({ children }: { children: React.ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "offline",
        consentCategories: ["necessary", "measurement"],
        // ignoreGeoLocation: process.env.NODE_ENV === "development", // Useful for development to always view the banner.
      }}
    >
      <CookieBanner
        theme={{
          "banner.card": {
            noStyle: true,
            className: cn(
              "relative w-full max-w-(--banner-max-width) divide-y overflow-hidden rounded-2xl",
              "bg-popover text-popover-foreground shadow-popover ring ring-popover-border"
            ),
          },
          "banner.header.title": {
            noStyle: true,
            className: "text-lg font-semibold text-foreground",
          },
          "banner.header.description": {
            noStyle: true,
            className: "text-sm text-muted-foreground",
          },
          "banner.footer": {
            style: {
              "--banner-footer-background-color": "transparent",
              "--banner-footer-background-color-dark": "transparent",
            },
          },
          "banner.footer.reject-button": {
            noStyle: true,
            className: buttonVariants({ variant: "secondary" }),
          },
          "banner.footer.accept-button": {
            noStyle: true,
            className: buttonVariants({ variant: "secondary" }),
          },
          "banner.footer.customize-button": {
            noStyle: true,
            className: buttonVariants({ variant: "default" }),
          },
        }}
      />

      <ConsentManagerDialog
        theme={{
          "dialog.root": {
            noStyle: true,
            style: {
              "--dialog-card-radius": "1rem",

              "--dialog-background-color": "var(--background)",
              "--dialog-background-color-dark": "var(--background)",

              "--dialog-border-color": "var(--border)",
              "--dialog-border-color-dark": "var(--border)",
            },
            className:
              "rounded-2xl border-none bg-background shadow-popover ring ring-popover-border",
          },
          "dialog.overlay": {
            className:
              "[--dialog-overlay-background-color-dark:var(--color-black)]/50",
          },
          "dialog.title": {
            noStyle: true,
            className: "text-lg leading-none font-semibold text-foreground",
          },
          "dialog.description": {
            noStyle: true,
            className: "text-sm text-muted-foreground",
          },
          "dialog.footer": {
            style: {
              "--dialog-stroke-color": "var(--border)",
              "--dialog-stroke-color-dark": "var(--border)",

              "--dialog-branding-icon-height": "1.125rem",
              "--dialog-branding-font-size": "0.875rem",

              "--dialog-branding-focus-color":
                "color-mix(in oklab, var(--ring) 50%, transparent)",
              "--dialog-branding-focus-color-dark":
                "color-mix(in oklab, var(--ring) 50%, transparent)",

              "--dialog-foreground-color": "var(--muted-foreground)",
              "--dialog-foreground-color-dark": "var(--muted-foreground)",
            },
          },
          "widget.accordion.item": {
            noStyle: true,
            className: "rounded-lg border",
          },
          "widget.accordion.trigger": {
            noStyle: true,
            className: "flex items-center gap-3 pr-3",
          },
          "widget.accordion.trigger-inner": {
            noStyle: true,
            className: cn(
              "flex flex-1 items-center rounded-lg px-4 py-3 text-sm font-semibold text-foreground **:[svg]:hidden",
              "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            ),
          },
          "widget.accordion.content": {
            noStyle: true,
            className:
              "overflow-hidden px-4 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          },
          "widget.accordion.content-inner": {
            noStyle: true,
            className: "pb-4 text-sm text-muted-foreground",
          },
          "widget.switch": {
            noStyle: true,
            className: cn(
              "inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-all",
              "border border-transparent shadow-xs",
              "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80"
            ),
          },
          "widget.switch.track": {
            noStyle: true,
          },
          "widget.switch.thumb": {
            noStyle: true,
            className: cn(
              "pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform",
              "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
            ),
          },
          "widget.footer.sub-group": {
            noStyle: true,
            className: "grid grid-cols-2 gap-4 sm:flex",
          },
          "widget.footer.reject-button": {
            noStyle: true,
            className: buttonVariants({ variant: "secondary" }),
          },
          "widget.footer.accept-button": {
            noStyle: true,
            className: buttonVariants({ variant: "secondary" }),
          },
          "widget.footer.save-button": {
            noStyle: true,
            className: buttonVariants({ variant: "default" }),
          },
        }}
      />

      <ConsentManagerClient>{children}</ConsentManagerClient>
    </ConsentManagerProvider>
  )
}
