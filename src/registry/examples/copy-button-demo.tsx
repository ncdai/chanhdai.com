import { CopyButton } from "@/registry/components/copy-button"

export default function CopyButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton variant="secondary" text="Some text to copy" />
      <CopyButton
        className="pr-3 pl-2.5 will-change-transform"
        variant="secondary"
        size="default"
        text="Some text to copy"
      >
        Copy
      </CopyButton>
    </div>
  )
}
