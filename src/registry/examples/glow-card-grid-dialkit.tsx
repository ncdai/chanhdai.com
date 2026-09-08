"use client"

import { useDialKit } from "dialkit"

import {
  GlowCard,
  GlowCardGrid,
} from "@/registry/transformed/components/glow-card-grid"

export default function GlowCardGridDialKit() {
  const params = useDialKit("GlowCard", {
    cardRadius: [16, 0, 32, 1],
    icon: {
      blur: [25, 0, 100, 1], // [default, min, max, step]
      saturate: [5.0, 0, 10, 0.1],
      brightness: [1.3, 0, 4, 0.1],
      scale: [4, 1, 6, 0.1],
      opacity: [0.3, 0, 1, 0.01],
    },
    border: {
      width: [3, 1, 6, 1],
      blur: [10, 0, 100, 1],
      saturate: [4.2, 0, 10, 0.1],
      brightness: [2.5, 0, 4, 0.1],
      contrast: [2.5, 0, 3, 0.1],
    },
  })

  return (
    <div className="container px-4 py-8">
      <GlowCardGrid
        className="lg:grid-cols-4"
        // Card parameters
        cardRadius={params.cardRadius}
        // Icon parameters
        iconBlur={params.icon.blur}
        iconSaturate={params.icon.saturate}
        iconBrightness={params.icon.brightness}
        iconScale={params.icon.scale}
        iconOpacity={params.icon.opacity}
        // Border parameters
        borderWidth={params.border.width}
        borderBlur={params.border.blur}
        borderSaturate={params.border.saturate}
        borderBrightness={params.border.brightness}
        borderContrast={params.border.contrast}
      >
        {CARDS.map((card) => (
          <GlowCard
            key={card.name}
            name={card.name}
            handle={card.handle}
            avatar={card.avatar}
          />
        ))}
      </GlowCardGrid>
    </div>
  )
}

const CARDS = [
  {
    name: "Deepanshu Yadav",
    handle: "@deepanshuyadav22",
    avatar: "https://unavatar.io/github/deepanshuyadav22",
  },
]
