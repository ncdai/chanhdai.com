"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import type {
  ChevronDownIconHandle,
  ChevronDownIconProps,
} from "@/components/animated-icons/chevron-down-icon"
import { ChevronDownIcon } from "@/components/animated-icons/chevron-down-icon"
import { Collapsible as CollapsibleRoot } from "@/components/base/ui/collapsible"
import type {
  ChevronsUpDownIconHandle,
  ChevronsUpDownIconProps,
} from "@/registry/components/chevrons-up-down-icon"
import { ChevronsUpDownIcon } from "@/registry/components/chevrons-up-down-icon"

type CollapsibleContextType = {
  open: boolean
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null)

const useCollapsible = () => {
  const context = useContext(CollapsibleContext)

  if (!context) {
    throw new Error(
      "Collapsible components must be used within a CollapsibleWithContext"
    )
  }

  return context
}

function CollapsibleWithContext({
  defaultOpen,
  open: controlledOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof CollapsibleRoot>) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const open = controlledOpen ?? uncontrolledOpen

  return (
    <CollapsibleContext.Provider value={{ open }}>
      <CollapsibleRoot
        open={open}
        onOpenChange={(open, eventDetails) => {
          if (controlledOpen === undefined) {
            setUncontrolledOpen(open)
          }
          onOpenChange?.(open, eventDetails)
        }}
        {...props}
      />
    </CollapsibleContext.Provider>
  )
}

function useCollapsibleAnimation<
  T extends { startAnimation: () => void; stopAnimation: () => void },
>(ref: React.RefObject<T | null>) {
  const { open } = useCollapsible()

  useEffect(() => {
    const controls = ref.current
    if (!controls) return

    if (open) {
      controls.startAnimation()
    } else {
      controls.stopAnimation()
    }
  }, [open, ref])
}

function CollapsibleChevronsIcon(props: Omit<ChevronsUpDownIconProps, "ref">) {
  const ref = useRef<ChevronsUpDownIconHandle>(null)
  useCollapsibleAnimation(ref)
  return <ChevronsUpDownIcon ref={ref} {...props} />
}

function CollapsibleChevronDownIcon(props: Omit<ChevronDownIconProps, "ref">) {
  const ref = useRef<ChevronDownIconHandle>(null)
  useCollapsibleAnimation(ref)
  return <ChevronDownIcon ref={ref} {...props} />
}

export {
  CollapsibleWithContext as Collapsible,
  CollapsibleChevronDownIcon,
  CollapsibleChevronsIcon,
  useCollapsible,
  useCollapsibleAnimation,
}
