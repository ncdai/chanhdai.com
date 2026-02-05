import { SponsorItem } from "@/features/sponsors/components/sponsor-item"
import { SponsorItemPlus } from "@/features/sponsors/components/sponsor-item-plus"
import { sponsors } from "@/features/sponsors/data"

import { Panel, PanelHeader, PanelTitle } from "./panel"

export function Sponsors() {
  return (
    <Panel id="sponsors">
      <PanelHeader>
        <PanelTitle>Sponsors</PanelTitle>
      </PanelHeader>

      <div className="relative pt-4">
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-edge" />
          <div className="border-l border-edge" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sponsors.map((item) => (
            <SponsorItem key={item.name} item={item} />
          ))}

          <SponsorItemPlus />
        </div>
      </div>
    </Panel>
  )
}
