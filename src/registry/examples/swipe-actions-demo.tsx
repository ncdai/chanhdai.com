"use client"

import { useState } from "react"
import { ArchiveIcon, FlagIcon, Trash2Icon } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import {
  SwipeAction,
  SwipeActions,
  SwipeContent,
  SwipeItem,
  SwipeRoot,
} from "@/registry/components/swipe-actions"

export default function SwipeActionsDemo() {
  const [mails, setMails] = useState(INITIAL_MAILS)
  const shouldReduceMotion = useReducedMotion()

  const removeMail = (id: string) => {
    setMails((prev) => prev.filter((mail) => mail.id !== id))
  }

  const toggleFlag = (id: string) => {
    setMails((prev) =>
      prev.map((mail) =>
        mail.id === id ? { ...mail, flagged: !mail.flagged } : mail
      )
    )
  }

  return (
    <div className="w-full overflow-clip rounded-xl border">
      <SwipeRoot render={<ul role="list" className="divide-y" />}>
        <AnimatePresence initial={false}>
          {mails.map((mail) => (
            <SwipeItem
              key={mail.id}
              render={
                <motion.li
                  layout={!shouldReduceMotion}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.1 }
                      : { duration: 0.22, ease: [0.32, 0.72, 0, 1] }
                  }
                />
              }
            >
              <SwipeActions side="left">
                <SwipeAction
                  fullSwipe
                  className="rounded-lg bg-sky-500 text-white"
                  onClick={() => removeMail(mail.id)}
                >
                  <ArchiveIcon />
                  Archive
                </SwipeAction>
              </SwipeActions>

              <SwipeActions side="right">
                <SwipeAction
                  className="rounded-lg bg-amber-500 text-white"
                  onClick={() => toggleFlag(mail.id)}
                >
                  <FlagIcon />
                  {mail.flagged ? "Unflag" : "Flag"}
                </SwipeAction>

                <SwipeAction
                  fullSwipe
                  className="rounded-lg bg-red-600 text-white"
                  onClick={() => removeMail(mail.id)}
                >
                  <Trash2Icon />
                  Delete
                </SwipeAction>
              </SwipeActions>

              <SwipeContent>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-1 rounded-xl p-4 pt-3 text-left text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    {mail.sender}
                    {mail.flagged && (
                      <FlagIcon className="size-3.5 text-amber-500" />
                    )}
                  </span>
                  <span className="text-sm">{mail.subject}</span>
                  <span className="w-full truncate text-xs text-muted-foreground">
                    {mail.preview}
                  </span>
                </button>
              </SwipeContent>
            </SwipeItem>
          ))}
        </AnimatePresence>
      </SwipeRoot>

      {mails.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          No messages left.
        </p>
      )}
    </div>
  )
}

type Mail = {
  id: string
  sender: string
  subject: string
  preview: string
  flagged: boolean
}

const INITIAL_MAILS: Mail[] = [
  {
    id: "1",
    sender: "shadcn",
    subject: "Namespaced registries",
    preview: "components.json can point at any registry URL now, take a look.",
    flagged: false,
  },
  {
    id: "2",
    sender: "Evil Rabbit",
    subject: "Spacing scale review",
    preview: "Dropped the 6px step so every surface lands on the 4px grid.",
    flagged: false,
  },
  {
    id: "3",
    sender: "Shu",
    subject: "SWR cache inspector",
    preview: "Devtools panel is in, the mutation timeline still needs work.",
    flagged: true,
  },
]
