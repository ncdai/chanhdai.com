"use client"

import { useDialKit } from "dialkit"

import { GlowCard } from "@/registry/components/glow-card-grid/glow-card"
import { GlowCardGrid } from "@/registry/components/glow-card-grid/glow-card-grid"

export default function GlowCardGridDialKitDemo() {
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
    name: "shadcn",
    handle: "@shadcn",
    avatar: "https://unavatar.io/x/shadcn",
  },
  {
    name: "Evil Rabbit",
    handle: "@evilrabbit_",
    avatar: "https://unavatar.io/x/evilrabbit_",
  },
  {
    name: "OrcDev",
    handle: "@orcdev",
    avatar: "https://unavatar.io/x/orcdev",
  },
  {
    name: "David Haz",
    handle: "@davidhdev",
    avatar: "https://unavatar.io/x/davidhdev",
  },
  {
    name: "Shu",
    handle: "@shuding",
    avatar: "https://unavatar.io/x/shuding",
  },
  {
    name: "Emil Kowalski",
    handle: "@emilkowalski",
    avatar: "https://unavatar.io/x/emilkowalski",
  },
  {
    name: "Aaron",
    handle: "@aaronmahlke",
    avatar: "https://unavatar.io/x/aaronmahlke",
  },
  {
    name: "Chánh Đại",
    handle: "@iamncdai",
    avatar: "https://unavatar.io/x/iamncdai",
  },
]
