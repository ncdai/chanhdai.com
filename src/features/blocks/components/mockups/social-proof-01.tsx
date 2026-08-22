import { cn } from "@/lib/utils"

import { Bar } from "./primitives"

const LOGOS = [
  { mark: "triangle", word: "w-8" },
  { mark: "circle", word: "w-9" },
  { mark: "asterisk", word: "w-7" },
  { mark: "pill", word: "w-9" },
] as const

export function SocialProof01Mockup() {
  return (
    <div className="flex size-full flex-col justify-center px-3">
      <div className="border-x border-line">
        <div className="flex justify-center border-y border-line py-1.5">
          <Bar className="h-0.75 w-14" />
        </div>

        <div className="grid grid-cols-4 border-b border-line">
          {LOGOS.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center gap-1 border-dashed border-line py-5 not-last:border-r"
            >
              <LogoMark kind={logo.mark} />
              <Bar className={cn("h-2 rounded-xs bg-foreground", logo.word)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LogoMark({ kind }: { kind: (typeof LOGOS)[number]["mark"] }) {
  switch (kind) {
    case "triangle":
      return (
        <svg viewBox="0 0 10 10" className="size-2.5 fill-foreground">
          <path d="M5 1 9.5 9H.5Z" />
        </svg>
      )
    case "circle":
      return <div className="size-2.5 rounded-full bg-foreground" />
    case "asterisk":
      return (
        <svg
          viewBox="0 0 10 10"
          className="size-2.5 stroke-foreground"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M5 1v8M1 5h8M2.2 2.2l5.6 5.6M7.8 2.2 2.2 7.8" />
        </svg>
      )
    case "pill":
      return (
        <div className="flex items-end gap-px">
          <div className="h-2.5 w-1.5 rounded-full bg-foreground" />
          <div className="h-2.5 w-1 rounded-full bg-foreground" />
          <div className="h-1.5 w-1 rounded-full bg-foreground" />
        </div>
      )
  }
}
