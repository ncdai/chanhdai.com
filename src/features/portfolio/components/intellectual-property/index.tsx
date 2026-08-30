import { CollapsibleList } from "@/components/collapsible-list"
import { CertificationItem } from "@/features/portfolio/components/certifications/certification-item"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import { INTELLECTUAL_PROPERTY } from "@/features/portfolio/data/intellectual-property"

const ID = "ip"

export function IntellectualProperty() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Intellectual property</a>
          <PanelTitleSup>({INTELLECTUAL_PROPERTY.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={INTELLECTUAL_PROPERTY}
        max={3}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  )
}
