import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"

import { isChartClipPassthrough } from "./chart-child-passthrough"
import type { BandConfig } from "./chart-context"
import { normalizeYAxisId } from "./y-axis-scales"

export type { BandConfig } from "./chart-context"

/** Default `<Band>` colour (kept in sync with `Band`'s `fill` default). */
const DEFAULT_BAND_FILL = "var(--chart-line-primary)"

interface BandConfigProps {
  upperKey?: unknown
  lowerKey?: unknown
  yAxisId?: string | number
  fill?: unknown
  label?: unknown
  showInTooltip?: unknown
}

/** Default tooltip label: the key for a single-key band, else `lower – upper`. */
export function defaultBandLabel(upperKey: string, lowerKey: string): string {
  return upperKey === lowerKey ? upperKey : `${lowerKey} – ${upperKey}`
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0
}

function bandConfigFromProps(
  props: BandConfigProps | undefined
): BandConfig | null {
  if (!(nonEmptyString(props?.upperKey) && nonEmptyString(props.lowerKey))) {
    return null
  }
  return {
    yAxisId: normalizeYAxisId(props.yAxisId),
    upperKey: props.upperKey,
    lowerKey: props.lowerKey,
    color: nonEmptyString(props.fill) ? props.fill : DEFAULT_BAND_FILL,
    label: nonEmptyString(props.label)
      ? props.label
      : defaultBandLabel(props.upperKey, props.lowerKey),
    showInTooltip: props.showInTooltip !== false,
  }
}

function getChildComponentName(child: ReactElement) {
  const childType = child.type as { displayName?: string; name?: string }
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : ""
}

/** Collect `<Band>` props from chart children so band edges extend the y-domain. */
export function extractBandConfigs(children: ReactNode): BandConfig[] {
  const configs: BandConfig[] = []

  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) {
        return
      }

      if (child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children)
        return
      }

      if (getChildComponentName(child) === "Band") {
        const config = bandConfigFromProps(
          child.props as BandConfigProps | undefined
        )
        if (config) {
          configs.push(config)
        }
        return
      }

      if (isChartClipPassthrough(child.type)) {
        visit((child.props as { children?: ReactNode }).children)
        return
      }

      const childProps = child.props as { children?: ReactNode } | undefined
      if (childProps?.children) {
        visit(childProps.children)
      }
    })
  }

  visit(children)
  return configs
}

/** Band edge keys grouped by y-axis id (deduplicated, insertion order). */
export function bandKeysByAxis(
  configs: Pick<BandConfig, "yAxisId" | "upperKey" | "lowerKey">[]
): Record<string, string[]> {
  const byAxis: Record<string, string[]> = {}
  for (const config of configs) {
    const keys = byAxis[config.yAxisId] ?? []
    for (const key of [config.upperKey, config.lowerKey]) {
      if (!keys.includes(key)) {
        keys.push(key)
      }
    }
    byAxis[config.yAxisId] = keys
  }
  return byAxis
}
