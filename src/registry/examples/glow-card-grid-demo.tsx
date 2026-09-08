import {
  GlowCard,
  GlowCardGrid,
} from "@/registry/transformed/components/glow-card-grid"

export default function GlowCardGridDemo() {
  return (
    <div className="w-full p-4">
      <GlowCardGrid>
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
