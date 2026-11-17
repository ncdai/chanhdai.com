"use client"

import { createContext, useContext, type ReactNode } from "react"

const StaticChartPreviewContext = createContext(false)

/** Disables cartesian reveal clip-path for static docs previews. */
export function StaticChartPreviewProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <StaticChartPreviewContext.Provider value={true}>
      {children}
    </StaticChartPreviewContext.Provider>
  )
}

export function useStaticChartPreview() {
  return useContext(StaticChartPreviewContext)
}
