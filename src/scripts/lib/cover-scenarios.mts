import type { ElementHandle, Page } from "puppeteer"

export type CoverScenario = (context: {
  page: Page
  preview: ElementHandle<HTMLElement>
}) => Promise<void>

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Previews render idle by default, which hides what some components are about.
export const coverScenarios: Record<string, CoverScenario> = {
  "status-button": async ({ page, preview }) => {
    const [, save, copy] = await preview.$$("button[data-status]")

    await save.click()
    await preview.waitForSelector('button[data-status="success"]')

    await copy.click()
    await preview.waitForSelector('button[data-status="loading"]')

    // Drop the hover state and let the content swap settle.
    await page.mouse.move(0, 0)
    await sleep(400)
  },
}
