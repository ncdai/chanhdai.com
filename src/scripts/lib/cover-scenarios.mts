import type { ElementHandle, Page } from "puppeteer"

export type CoverScenario = (context: {
  page: Page
  preview: ElementHandle<HTMLElement>
}) => Promise<void>

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Previews render idle by default, which hides what some components are about.
export const coverScenarios: Record<string, CoverScenario> = {
  "swipe-actions": async ({ page, preview }) => {
    const [, second] = await preview.$$('[data-slot="swipe-item"]')

    // Arrow keys open the row without a drag long enough to arm the full swipe.
    // ArrowRight pushes the row right, which keeps its text readable: opening
    // the other side slides the sender out of the clipped card entirely.
    await second.evaluate((el) => {
      el.querySelector<HTMLElement>(
        '[data-slot="swipe-content"] button'
      )?.focus({ preventScroll: true })
    })
    await page.keyboard.press("ArrowRight")

    // A focus ring on the row would read as a click rather than a swipe.
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
    })
    await sleep(600)
  },
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
