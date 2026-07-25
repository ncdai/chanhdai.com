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

      <PanelContent>
        <div className="typeset typeset-description [&_li]:ps-0.5 [&_ul]:ps-3.5">
          <Markdown>{USER.about}</Markdown>
        </div>
      </PanelContent>
    </Panel>
  )
}
