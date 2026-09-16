import { FluidGradientText } from "@/registry/components/fluid-gradient-text"

export default function FluidGradientTextDemo() {
  return (
    <div className="relative w-full text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 text-center text-xs text-muted-foreground select-none">
        <span className="hidden pointer-fine:inline-block">
          Move your cursor within the text below
        </span>
        <span className="hidden pointer-coarse:inline-block">
          Press anywhere within the text below
        </span>
      </div>

      <FluidGradientText text="shadcn" />
    </div>
  )
}
