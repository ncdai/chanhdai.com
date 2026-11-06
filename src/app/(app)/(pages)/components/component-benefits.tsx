import { AstroidIcon, CodeXmlIcon, HeartIcon, TerminalIcon } from "lucide-react"

import { IconTile } from "@/components/ui/icon-tile"

export function ComponentBenefits() {
  return (
    <section aria-labelledby="component-benefits-title">
      <h2 id="component-benefits-title" className="sr-only">
        What you get
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2">
        <Benefit
          icon={<HeartIcon />}
          title="Built with care"
          description="Every pixel and interaction carefully refined."
        />
        <Benefit
          icon={<TerminalIcon />}
          title="One-command install"
          description="Add components with one shadcn command."
        />
        <Benefit
          icon={<CodeXmlIcon />}
          title="Yours to own"
          description="The source is in your repo. Make it your own."
        />
        <Benefit
          icon={<AstroidIcon />}
          title="Agent-ready"
          description="Markdown docs help agents use each one."
        />
      </ul>
    </section>
  )
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <li className="screen-line-bottom flex gap-3 border-line p-4 sm:odd:border-r">
      <IconTile aria-hidden>{icon}</IconTile>
      <div className="flex-1">
        <h3 className="mb-1 text-base/6 font-medium">{title}</h3>
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  )
}
