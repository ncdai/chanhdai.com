import { Prose } from "@/components/base/ui/typography"
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

      <PanelContent className="pt-5 pb-6">
        <Prose className="prose-p:mt-[0.5em] prose-p:mb-[0.5em] prose-p:first:mt-0 prose-p:last:mb-0">
          <Markdown>{USER.about}</Markdown>
        </Prose>
      </PanelContent>
    </Panel>
  )
}
