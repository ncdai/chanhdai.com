"use client"

import { useDialKit } from "dialkit"

import { FluidGradientText } from "@/registry/components/fluid-gradient-text"

export default function FluidGradientTextDialKit() {
  const params = useDialKit("FluidGradientText", {
    text: "shadcn",
    svgViewBoxWidth: 1200,
    svgViewBoxHeight: 300,
  })

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 text-center text-sm text-muted-foreground select-none">
        <span className="hidden pointer-fine:inline-block">
          Move your cursor within the text below
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Press anywhere within the text below
        </span>
      </div>

      <FluidGradientText
        text={params.text || "shadcn"}
        svgViewBoxWidth={params.svgViewBoxWidth}
        svgViewBoxHeight={params.svgViewBoxHeight}
      />
    </div>
  )
}
