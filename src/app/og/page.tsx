import { Overview } from "@/features/portfolio/components/overview"
import { ProfileHeader } from "@/features/portfolio/components/profile-header"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="mx-auto flex h-screen flex-col justify-center md:max-w-3xl">
        <div
          className={cn(
            "screen-line-bottom grow border-x border-line after:-bottom-px",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-line)]/56"
          )}
        >
          <div className="flex h-4" />
        </div>

        <ProfileHeader />
        <Separator />

        <Overview />

        <div
          className={cn(
            "screen-line-top grow border-x border-line before:-top-px",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-line)]/56"
          )}
        />
      </div>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-line",
        "before:absolute before:left-[-100vw] before:-z-1 before:h-8 before:w-[200vw]",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
        className
      )}
    />
  )
}
