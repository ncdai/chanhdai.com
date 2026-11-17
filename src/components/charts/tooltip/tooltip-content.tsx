"use client"

import type { ReactNode } from "react"
import { formatNumber } from "@/utils/format"

import { cn } from "@/lib/utils"

export interface TooltipRow {
  color: string
  label: string
  value: string | number
}

export interface TooltipContentProps {
  title?: string
  rows: TooltipRow[]
  /** Optional additional content (e.g., markers) */
  children?: ReactNode
}

export interface TooltipHeaderProps {
  children: ReactNode
  className?: string
}

/**
 * Popover-style header row: medium-weight label separated from the body by a
 * full-width border. Use it at the top of custom `ChartTooltip` `content`.
 */
export function TooltipHeader({ children, className }: TooltipHeaderProps) {
  return (
    <div
      className={cn(
        "border-b px-3.5 py-2.5 text-left text-sm font-medium text-chart-tooltip-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

TooltipHeader.displayName = "TooltipHeader"

export function TooltipContent({ title, rows, children }: TooltipContentProps) {
  return (
    <div className="overflow-hidden">
      <div className="px-3 py-2.5">
        {title && (
          <div className="mb-2 text-xs font-medium text-chart-tooltip-foreground">
            {title}
          </div>
        )}
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              className="flex items-center justify-between gap-4"
              key={`${row.label}-${row.color}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-sm text-chart-tooltip-muted">
                  {row.label}
                </span>
              </div>
              <span className="text-sm font-medium text-chart-tooltip-foreground tabular-nums">
                {typeof row.value === "number"
                  ? formatNumber(row.value)
                  : row.value}
              </span>
            </div>
          ))}
        </div>

        {children && (
          <div className="mt-2 transition-opacity duration-200 ease-out">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

TooltipContent.displayName = "TooltipContent"

export default TooltipContent
