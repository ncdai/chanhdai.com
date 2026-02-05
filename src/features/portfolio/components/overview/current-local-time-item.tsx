"use client"

import { TZDate, tzOffset } from "@date-fns/tz"
import { format } from "date-fns"
import {
  Clock1Icon,
  Clock2Icon,
  Clock3Icon,
  Clock4Icon,
  Clock5Icon,
  Clock6Icon,
  Clock7Icon,
  Clock8Icon,
  Clock9Icon,
  Clock10Icon,
  Clock11Icon,
  Clock12Icon,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useState } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"

import { IntroItem, IntroItemContent, IntroItemIcon } from "./intro-item"

const CLOCK_ICONS: Record<number, LucideIcon> = {
  1: Clock1Icon,
  2: Clock2Icon,
  3: Clock3Icon,
  4: Clock4Icon,
  5: Clock5Icon,
  6: Clock6Icon,
  7: Clock7Icon,
  8: Clock8Icon,
  9: Clock9Icon,
  10: Clock10Icon,
  11: Clock11Icon,
  12: Clock12Icon,
}

type CurrentLocalTimeItemProps = {
  timeZone: string
}

export function CurrentLocalTimeItem({ timeZone }: CurrentLocalTimeItemProps) {
  const [timeString, setTimeString] = useState<string>("")
  const [diffText, setDiffText] = useState<string>("")
  const [ClockIcon, setClockIcon] = useState<LucideIcon>(Clock12Icon)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Get time in target timezone using TZDate
      const targetTime = TZDate.tz(timeZone)
      const formattedTime = format(targetTime, "HH:mm")
      setTimeString(formattedTime)

      // Get hour for clock icon (1-12)
      const hour = targetTime.getHours()
      const hour12 = hour % 12 || 12
      setClockIcon(CLOCK_ICONS[hour12])

      // Calculate timezone offset difference using tzOffset
      const viewerOffset = -now.getTimezoneOffset() // in minutes
      const targetOffset = tzOffset(timeZone, now) // in minutes

      const minutesDiff = Math.abs(targetOffset - viewerOffset)
      const hoursDiff = minutesDiff / 60

      let diff = ""
      if (hoursDiff < 1) {
        diff = " // same time"
      } else {
        const hours = Math.floor(hoursDiff)
        const isAhead = targetOffset > viewerOffset
        diff = ` // ${hours}h ${isAhead ? "ahead" : "behind"}`
      }
      setDiffText(diff)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [timeZone])

  if (!timeString) {
    return (
      <IntroItem>
        <IntroItemIcon>
          <Clock12Icon />
        </IntroItemIcon>

        <IntroItemContent>00:00</IntroItemContent>
      </IntroItem>
    )
  }

  return (
    <IntroItem>
      <IntroItemIcon>
        <ClockIcon />
      </IntroItemIcon>

      <IntroItemContent aria-label={`Current local time: ${timeString}`}>
        <Tooltip>
          <TooltipTrigger render={<span className="cursor-default" />}>
            {timeString}
          </TooltipTrigger>

          <TooltipContent>{timeZone}</TooltipContent>
        </Tooltip>

        <span className="text-muted-foreground" aria-hidden="true">
          {diffText}
        </span>
      </IntroItemContent>
    </IntroItem>
  )
}
