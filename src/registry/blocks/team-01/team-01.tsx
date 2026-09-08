import { GlowCard, GlowCardGrid } from "@/registry/components/glow-card-grid"

export default function Team01() {
  return (
    <div className="container px-4 py-8">
      <GlowCardGrid className="lg:grid-cols-4">
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
