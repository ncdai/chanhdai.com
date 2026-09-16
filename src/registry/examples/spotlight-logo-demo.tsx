import { SpotlightLogo } from "@/registry/components/spotlight-logo"

export default function SpotlightLogoDemo() {
  return (
    <div className="relative w-full text-foreground">
      <div className="mx-auto w-full max-w-lg px-8 pb-12">
        <SpotlightLogo />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-xs text-muted-foreground select-none">
        <span className="hidden pointer-fine:inline-block">
          Move your cursor around, then click the mark
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Press the mark below
        </span>
      </div>
    </div>
  )
}
