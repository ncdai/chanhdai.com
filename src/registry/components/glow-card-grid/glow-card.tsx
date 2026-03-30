import { cn } from "@/lib/utils"

export type GlowCardProps = {
  name: string
  handle: string
  avatar: string
  className?: string
}

export function GlowCard({ name, handle, avatar, className }: GlowCardProps) {
  return (
    <div
      data-slot="glow-card"
      className={cn(
        "@container-[size] relative h-52 w-full overflow-hidden rounded-(--card-radius) ring-1 ring-border transition-[translate,scale] select-none active:scale-[0.98]",
        className
      )}
    >
      <div className="flex size-full overflow-hidden rounded-(--card-radius) [clip-path:inset(0_round_var(--card-radius))]">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            "translate-x-[calc(var(--pointer-x,-10)*50cqi)] translate-y-[calc(var(--pointer-y,-10)*50cqh)] translate-z-0 scale-(--card-icon-scale)",
            "blur-(--card-icon-blur) brightness-(--card-icon-brightness) saturate-(--card-icon-saturate)",
            "opacity-(--card-icon-opacity) will-change-[transform,filter]"
          )}
        >
          <img className="size-20" src={avatar} alt={name} />
        </div>

        <div className="z-1 flex flex-1 flex-col items-center justify-center gap-4">
          <img className="size-20 rounded-full" src={avatar} alt={name} />

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-base leading-none font-semibold text-foreground">
              {name}
            </h2>
            <p className="text-sm leading-none text-foreground/50">{handle}</p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 translate-z-0 rounded-(--card-radius)",
          "border-(length:--card-border-width) border-solid border-transparent",
          "backdrop-blur-(--card-border-blur) backdrop-brightness-(--card-border-brightness) backdrop-contrast-(--card-border-contrast) backdrop-saturate-(--card-border-saturate)",
          "[clip-path:inset(0_round_var(--card-radius))]"
        )}
        style={
          {
            maskImage:
              "linear-gradient(#fff 0 100%), linear-gradient(#fff 0 100%)",
            maskOrigin: "border-box, padding-box",
            maskClip: "border-box, padding-box",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          } as React.CSSProperties
        }
      />
    </div>
  )
}
