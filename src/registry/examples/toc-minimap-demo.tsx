import type { TOCItemType } from "@/registry/components/toc-minimap"
import { TOCMinimap } from "@/registry/components/toc-minimap"

export default function TOCMinimapDemo() {
  return <TOCMinimap items={ITEMS} />
}

const ITEMS: TOCItemType[] = [
  { title: "Installation", url: "#installation", depth: 2 },
  { title: "Usage", url: "#usage", depth: 2 },
  { title: "API Reference", url: "#api-reference", depth: 2 },
  { title: "TOCMinimap", url: "#tocminimap", depth: 3 },
  { title: "TOCItemType", url: "#tocitemtype", depth: 3 },
  { title: "References", url: "#references", depth: 2 },
]
