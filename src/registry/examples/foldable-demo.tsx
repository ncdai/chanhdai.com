import { Fragment } from "react"
import type { ReactNode } from "react"

import { ChanhDaiMark } from "@/components/chanhdai-mark"
import {
  Foldable,
  FoldableCover,
  FoldableInsideLeft,
  FoldableInsideRight,
  FoldableSlider,
  FoldableStage,
} from "@/registry/components/foldable"

const PROFILE = {
  username: "ncdai",
  displayName: "Chánh Đại",
  jobTitle: "Design Engineer",
  bio: "Creating with code. Small details matter.",
  pronouns: "he/him",
  avatar: "https://assets.chanhdai.com/images/chanhdai-avatar-ghibli.webp",
}

const CONTACTS = [
  { label: "Web", value: "chanhdai.com" },
  { label: "GitHub", value: "ncdai" },
  { label: "X", value: "@iamncdai" },
  { label: "LinkedIn", value: "ncdai" },
]

export default function FoldableDemo() {
  return (
    <Foldable className="[--foldable-radius:--spacing(3)] [--foldable-surface:var(--card)] [--foldable-w:min(16rem,calc(50vw-2rem))]">
      <FoldableStage>
        <FoldableInsideRight>
          <CardFrame>
            <ContactList />
          </CardFrame>
        </FoldableInsideRight>
        <FoldableCover>
          <CardFrame />
        </FoldableCover>
        <FoldableInsideLeft>
          <CardInside />
        </FoldableInsideLeft>
      </FoldableStage>

      <FoldableSlider />
    </Foldable>
  )
}

/**
 * Shared by the cover and the page beneath it, so what the lifting cover
 * uncovers lines up with what it just showed.
 */
function CardFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="flex size-full flex-col p-5">
      <div className="flex items-start justify-between">
        <ChanhDaiMark className="h-5 w-10" />
        <span className="font-mono text-xs text-muted-foreground">
          @{PROFILE.username}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">{children}</div>

      <div>
        <p className="text-xl font-medium tracking-tight">
          {PROFILE.displayName}
        </p>
        <p className="text-sm text-muted-foreground">{PROFILE.jobTitle}</p>
      </div>
    </div>
  )
}

function ContactList() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs">
      {CONTACTS.map(({ label, value }) => (
        <Fragment key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="truncate text-right">{value}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

function CardInside() {
  return (
    <div className="flex size-full flex-col justify-between p-5">
      <img
        className="size-16 rounded-full border object-cover"
        src={PROFILE.avatar}
        alt=""
        draggable={false}
      />

      <div className="flex flex-col gap-2">
        <p className="text-lg/snug font-medium tracking-tight text-balance">
          {PROFILE.bio}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {PROFILE.pronouns}
        </p>
      </div>
    </div>
  )
}
