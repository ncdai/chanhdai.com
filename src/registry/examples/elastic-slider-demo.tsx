"use client"

import { useState } from "react"

import { ElasticSlider } from "@/registry/components/elastic-slider"

export default function ElasticSliderDemo() {
  const [opacity, setOpacity] = useState(0.5)

  return (
    <div className="flex w-50 flex-col gap-4">
      <ElasticSlider
        label="Opacity"
        min={0}
        max={1}
        value={opacity}
        onValueChange={setOpacity}
      />

      <ElasticSlider
        label="Blur"
        min={0}
        max={100}
        step={1}
        defaultValue={20}
        formatValue={(v) => `${v}px`}
      />

      <ElasticSlider
        label="Saturation"
        min={0}
        max={10}
        step={0.1}
        defaultValue={8}
      />
    </div>
  )
}
