import { CopyButton } from "@/registry/components/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton variant="secondary" text="Text 1" />

      <CopyButton
        className="pr-3 pl-2.5 will-change-transform"
        variant="outline"
        size="default"
        text="Text 2"
      >
        Copy
      </CopyButton>
    </div>
  )
}
