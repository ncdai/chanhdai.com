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

// Demo avatars only. Replace them with your own URLs.
const CARDS = [
  {
    name: "shadcn",
    handle: "@shadcn",
    avatar: "https://assets.chanhdai.com/avatars/x/shadcn.webp",
  },
  {
    name: "Evil Rabbit",
    handle: "@evilrabbit_",
    avatar: "https://assets.chanhdai.com/avatars/x/evilrabbit_.webp",
  },
  {
    name: "OrcDev",
    handle: "@orcdev",
    avatar: "https://assets.chanhdai.com/avatars/x/orcdev.webp",
  },
  {
    name: "David Haz",
    handle: "@davidhaz",
    avatar: "https://assets.chanhdai.com/avatars/x/davidhaz.webp",
  },
  {
    name: "Shu",
    handle: "@shuding",
    avatar: "https://assets.chanhdai.com/avatars/x/shuding.webp",
  },
  {
    name: "Emil Kowalski",
    handle: "@emilkowalski",
    avatar: "https://assets.chanhdai.com/avatars/x/emilkowalski.webp",
  },
  {
    name: "Aaron",
    handle: "@aaronmahlke",
    avatar: "https://assets.chanhdai.com/avatars/x/aaronmahlke.webp",
  },
  {
    name: "Chánh Đại",
    handle: "@iamncdai",
    avatar: "https://assets.chanhdai.com/avatars/x/iamncdai.webp",
  },
]
