import type { ElementHandle, Page } from "puppeteer"

export type CoverScenario = (context: {
  page: Page
  preview: ElementHandle<HTMLElement>
}) => Promise<void>

// Previews render idle by default, which hides what some components are about.
export const coverScenarios: Record<string, CoverScenario> = {}
