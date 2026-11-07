"use client"

import { useEffect, useId, useState } from "react"
import { useTextMorph } from "torph/react"

import { InlineScript } from "@/components/inline-script"

import { IntroItem, IntroItemContent, IntroItemIcon } from "./intro-item"

export function CurrentLocalTimeItem({ timeZone }: CurrentLocalTimeItemProps) {
  const uid = useId()
  const ids = {
    hour: `lt-hour-${uid}`,
    minute: `lt-minute-${uid}`,
    period: `lt-period-${uid}`,
    diff: `lt-diff-${uid}`,
    hands: `lt-hands-${uid}`,
  }

  const [time, setTime] = useState({ hour: "", minute: "", period: "" })
  const [diffText, setDiffText] = useState("")
  // Deterministic 12:00 for SSR; the inline script corrects it before paint.
  const [handsPath, setHandsPath] = useState(() => clockHandsPath(12, 0))

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const updateTime = () => {
      const { time, diff, hour, minute } = computeClock(timeZone)
      setTime(time)
      setDiffText(diff)
      setHandsPath(clockHandsPath(hour, minute))

      // Aligned to the wall-clock minute so the morph lands when the minute
      // actually changes, not up to 59s later.
      timeout = setTimeout(updateTime, 60000 - (Date.now() % 60000))
    }

    updateTime()

    return () => clearTimeout(timeout)
  }, [timeZone])

  return (
    <IntroItem>
      <IntroItemIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path id={ids.hands} d={handsPath} suppressHydrationWarning />
        </svg>
      </IntroItemIcon>

      <IntroItemContent>
        {/* Split so each number rolls by place value; torph treats "11:05"
            as text because of the colon. */}
        <MorphText id={ids.hour} value={time.hour} />:
        <MorphText id={ids.minute} value={time.minute} />{" "}
        <MorphText id={ids.period} value={time.period} />
        <span
          id={ids.diff}
          className="text-muted-foreground"
          aria-hidden
          suppressHydrationWarning
        >
          {diffText}
        </span>
      </IntroItemContent>

      <InlineScript html={getInlineScript(timeZone, ids)} />
    </IntroItem>
  )
}

function MorphText({ id, value }: { id: string; value: string }) {
  const { ref, update } = useTextMorph({ duration: 600 })

  // The first value adopts the text painted by the inline script, unanimated.
  useEffect(() => {
    update(value)
  }, [value, update])

  return (
    <span
      ref={ref}
      id={id}
      // Empty innerHTML leaves the children to torph instead of React.
      dangerouslySetInnerHTML={{ __html: "" }}
      suppressHydrationWarning
    />
  )
}

type CurrentLocalTimeItemProps = {
  timeZone: string
}

type ClockIds = {
  hour: string
  minute: string
  period: string
  diff: string
  hands: string
}

// The functions below are serialized via `.toString()` into the pre-hydration
// script, so they must stay self-contained: globals and arguments only, no
// module-scope references.

function clockHandsPath(hour: number, minute: number) {
  const h = hour % 12
  const round = (n: number) => Math.round(n * 1000) / 1000

  const minuteAngle = (minute / 60) * 2 * Math.PI
  const hourAngle = ((h + minute / 60) / 12) * 2 * Math.PI

  const hx = round(12 + 3.6 * Math.sin(hourAngle))
  const hy = round(12 - 3.6 * Math.cos(hourAngle))
  const mx = round(12 + 6 * Math.sin(minuteAngle))
  const my = round(12 - 6 * Math.cos(minuteAngle))

  return `M12 12 L${hx} ${hy} M12 12 L${mx} ${my}`
}

function computeClock(timeZone: string) {
  const now = new Date()

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(now)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? ""
  const time = {
    hour: part("hour"),
    minute: part("minute"),
    period: part("dayPeriod"),
  }

  // tz offset = (tz wall-clock instant) − (UTC wall-clock instant), each read
  // back as a local Date. In minutes, positive = east of UTC.
  const viewerOffset = -now.getTimezoneOffset()
  const targetOffset =
    (new Date(now.toLocaleString("en-US", { timeZone })).getTime() -
      new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime()) /
    60000
  const hoursDiff = Math.abs(targetOffset - viewerOffset) / 60
  const diff =
    hoursDiff < 1
      ? " // same time"
      : ` // ${Math.floor(hoursDiff)}h ${targetOffset > viewerOffset ? "ahead" : "behind"}`

  return {
    time,
    diff,
    hour: parseInt(time.hour, 10),
    minute: parseInt(time.minute, 10),
  }
}

function runClockScript(
  timeZone: string,
  ids: ClockIds,
  compute: typeof computeClock,
  handsPath: typeof clockHandsPath
) {
  try {
    const { time, diff, hour, minute } = compute(timeZone)
    const setText = (id: string, text: string) => {
      const el = document.getElementById(id)
      if (el) el.textContent = text
    }

    setText(ids.hour, time.hour)
    setText(ids.minute, time.minute)
    setText(ids.period, time.period)
    setText(ids.diff, diff)
    document
      .getElementById(ids.hands)
      ?.setAttribute("d", handsPath(hour, minute))
  } catch {}
}

// Blocking inline script that paints the viewer-local clock before hydration
// (Next.js "prevent flash before hydration"). Sharing `computeClock` with the
// effect guarantees the pre-hydration value matches what React renders.
function getInlineScript(timeZone: string, ids: ClockIds) {
  return `(${runClockScript.toString()})(${JSON.stringify(timeZone)},${JSON.stringify(ids)},${computeClock.toString()},${clockHandsPath.toString()})`
}
