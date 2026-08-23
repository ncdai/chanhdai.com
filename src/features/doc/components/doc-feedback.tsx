"use client"

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { useTiks } from "@rexa-developer/tiks/react"
import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { CheckIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { trackEvent } from "@/lib/events"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/base/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/base/ui/field"
import { Callout } from "@/components/callout"
import { StatusButton } from "@/registry/components/status-button"
import { sendDocFeedback } from "@/features/doc/actions/send-doc-feedback"
import {
  DOC_FEEDBACK_MESSAGE_MAX_LENGTH,
  type DocFeedbackState,
  type DocFeedbackVote,
} from "@/features/doc/lib/doc-feedback"

const VOTE_OPTIONS = [
  { value: "yes", label: "Yes", icon: <ThumbsUpIcon className="-mr-0.5" /> },
  { value: "no", label: "No", icon: <ThumbsDownIcon /> },
] as const satisfies ReadonlyArray<{
  value: DocFeedbackVote
  label: string
  icon: React.ReactElement
}>

const NOTE_PROMPT: Record<DocFeedbackVote, string> = {
  yes: "What did you like? (optional)",
  no: "What could be better? (optional)",
}

const feedbackVotesAtom = atomWithStorage<Record<string, DocFeedbackVote>>(
  "doc_feedback_v1",
  {}
)

const initialNoteState: DocFeedbackState = { status: "idle" }

type DocFeedbackProps = {
  category: string
  slug: string
}

export function DocFeedback({ category, slug }: DocFeedbackProps) {
  const headingId = useId()
  const messageId = useId()
  const errorId = `${messageId}-error`
  const key = `${category}/${slug}`

  const [votes, setVotes] = useAtom(feedbackVotesAtom)
  const vote = votes[key]
  const hasVoted = vote !== undefined

  // Unlike `hasVoted`, this is not persisted: the thanks message and note form
  // only appear right after voting, not for a returning visitor.
  const [justVoted, setJustVoted] = useState(false)

  const { success } = useTiks()

  const [noteState, sendNote, isSending] = useActionState(
    async (previousState: DocFeedbackState, formData: FormData) => {
      const nextState = await sendDocFeedback(previousState, formData)
      if (nextState.status === "success") {
        success()
      }
      return nextState
    },
    initialNoteState
  )

  const hasError = noteState.status === "error"
  const noteSent = noteState.status === "success"

  // Keeps the form mounted until the send button has finished its success state.
  const [sendConfirmed, setSendConfirmed] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)

  // Each step removes the control that had focus (vote buttons get disabled,
  // the form unmounts), so move focus to the next meaningful element. On a
  // validation error that is the textarea again.
  useEffect(() => {
    if (!justVoted) {
      return
    }

    const next =
      noteState.status === "success" ? alertRef.current : textareaRef.current
    next?.focus()
  }, [justVoted, noteState])

  const handleVote = (value: DocFeedbackVote) => {
    trackEvent({
      name: "doc_feedback",
      properties: { category, slug, vote: value },
    })
    setVotes((prev) => ({ ...prev, [key]: value }))
    setJustVoted(true)
    success()
  }

  return (
    <>
      <div className="screen-dashed-line-top before:opacity-80">
        <div className="screen-line-top h-px overflow-x-clip" />
      </div>

      <section className="flex flex-col gap-2 p-4" aria-labelledby={headingId}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 id={headingId} className="text-sm font-medium">
            Was this helpful?
          </h2>

          <div
            className="flex items-center gap-2"
            role="group"
            aria-labelledby={headingId}
          >
            {VOTE_OPTIONS.map((option) => {
              const selected = vote === option.value

              return (
                <Button
                  key={option.value}
                  className="gap-2 disabled:opacity-100"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  aria-pressed={selected}
                  disabled={hasVoted}
                  onClick={() => handleVote(option.value)}
                >
                  {option.icon}
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {vote && justVoted && (
          <>
            <Callout
              ref={alertRef}
              className="outline-none has-[>svg]:gap-x-3"
              icon={<CheckIcon />}
              tabIndex={-1}
            >
              {noteSent
                ? "Your note has been sent. Thanks for taking the time to write."
                : "Thanks for your feedback!"}
            </Callout>

            {!sendConfirmed && (
              <form
                className="flex flex-col gap-2"
                // Submitting through `action` would reset the fields after a
                // validation error; dispatching manually keeps the typed text.
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  startTransition(() => sendNote(formData))
                }}
              >
                <input type="hidden" name="category" value={category} />
                <input type="hidden" name="slug" value={slug} />
                <input type="hidden" name="vote" value={vote} />

                {/* Honeypot: hidden from people, bots tend to fill every field. */}
                <div className="hidden" aria-hidden>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <Field data-invalid={hasError}>
                  {/* The placeholder repeats it, but a placeholder alone is not
                      an accessible name. */}
                  <FieldLabel className="sr-only" htmlFor={messageId}>
                    {NOTE_PROMPT[vote]}
                  </FieldLabel>

                  <Textarea
                    ref={textareaRef}
                    id={messageId}
                    name="message"
                    className="resize-none rounded-xl px-4 pt-3"
                    placeholder={NOTE_PROMPT[vote]}
                    maxLength={DOC_FEEDBACK_MESSAGE_MAX_LENGTH}
                    disabled={isSending || noteSent}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? errorId : undefined}
                    onKeyDown={(event) => {
                      if (
                        (event.metaKey || event.ctrlKey) &&
                        event.key === "Enter"
                      ) {
                        event.preventDefault()
                        event.currentTarget.form?.requestSubmit()
                      }
                    }}
                  />

                  <FieldError id={errorId}>
                    {hasError ? noteState.message : null}
                  </FieldError>
                </Field>

                <StatusButton
                  className="self-start px-4"
                  type="submit"
                  size="sm"
                  status={isSending ? "loading" : noteSent ? "success" : "idle"}
                  onStatusChange={(status) => {
                    if (status === "idle" && noteSent) {
                      setSendConfirmed(true)
                    }
                  }}
                  successLabel="Sent"
                >
                  Send
                </StatusButton>
              </form>
            )}
          </>
        )}
      </section>
    </>
  )
}
