import { CollapsibleList } from "@/components/collapsible-list"

import { CERTIFICATIONS } from "../../data/certifications"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { CertificationItem } from "./certification-item"

export function Certifications() {
  return (
    <Panel id="certs">
      <PanelHeader>
        <PanelTitle>
          Certifications
          <PanelTitleSup>({CERTIFICATIONS.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <CollapsibleList
        items={CERTIFICATIONS}
        max={3}
        renderItem={(item) => <CertificationItem certification={item} />}
      />
    </Panel>
  )
}
