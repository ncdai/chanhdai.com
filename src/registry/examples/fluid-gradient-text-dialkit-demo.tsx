"use client"

import { useDialKit } from "dialkit"

import { FluidGradientText } from "@/registry/components/fluid-gradient-text"

export default function FluidGradientTextDialKitDemo() {
  const params = useDialKit("FluidGradientText", {
    text: "shadcn",
    svgViewBoxWidth: 1200,
    svgViewBoxHeight: 300,
  })

  return (
    <FluidGradientText
      text={params.text || "shadcn"}
      svgViewBoxWidth={params.svgViewBoxWidth}
      svgViewBoxHeight={params.svgViewBoxHeight}
    />
  )
}
