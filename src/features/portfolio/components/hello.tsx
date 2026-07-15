import { Markdown } from "@/components/markdown"
import { HelloTitle } from "@/features/portfolio/components/hello-title"
import {
  Panel,
  PanelContent,
  PanelHeader,
} from "@/features/portfolio/components/panel"
import { USER } from "@/features/portfolio/data/user"

const ID = "hello"

export function Hello() {
  return (
    <Panel id={ID}>
      <PanelHeader>
        <HelloTitle />
      </PanelHeader>

      <PanelContent className="typeset typeset-description">
        <Markdown>{USER.about}</Markdown>
      </PanelContent>
    </Panel>
  )
}
