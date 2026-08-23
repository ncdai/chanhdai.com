import { afterEach, describe, expect, it, vi } from "vitest"

import {
  buildDocFeedbackDiscordPayload,
  sendDocFeedbackToDiscord,
} from "@/features/doc/lib/doc-feedback-discord"

const feedback = {
  category: "components",
  slug: "react-wheel-picker",
  vote: "no",
  message: "The loop option could use an example. @everyone",
} as const

const receivedAt = new Date("2026-08-22T10:00:00.000Z")

describe("buildDocFeedbackDiscordPayload", () => {
  it("puts the vote, page link and note into one embed", () => {
    const payload = buildDocFeedbackDiscordPayload(feedback, receivedAt)

    expect(payload.embeds).toHaveLength(1)
    expect(payload.embeds[0]).toMatchObject({
      title: "Was this helpful? No",
      description: feedback.message,
      fields: [{ name: "Page", value: "/components/react-wheel-picker" }],
      timestamp: "2026-08-22T10:00:00.000Z",
    })
    expect(payload.embeds[0].url).toMatch(/\/components\/react-wheel-picker$/)
  })

  it("never lets visitor text mention anyone", () => {
    const payload = buildDocFeedbackDiscordPayload(feedback, receivedAt)

    expect(payload.allowed_mentions).toEqual({ parse: [] })
  })

  it("colors the embed by vote", () => {
    const no = buildDocFeedbackDiscordPayload(feedback, receivedAt)
    const yes = buildDocFeedbackDiscordPayload(
      { ...feedback, vote: "yes" },
      receivedAt
    )

    expect(no.embeds[0].color).not.toBe(yes.embeds[0].color)
    expect(yes.embeds[0].title).toBe("Was this helpful? Yes")
  })
})

describe("sendDocFeedbackToDiscord", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("posts JSON to the webhook URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal("fetch", fetchMock)

    await sendDocFeedbackToDiscord("https://discord.test/webhook", feedback)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://discord.test/webhook")
    expect(init.method).toBe("POST")
    expect(init.headers).toEqual({ "Content-Type": "application/json" })
    const body = JSON.parse(String(init.body)) as ReturnType<
      typeof buildDocFeedbackDiscordPayload
    >
    expect(body.embeds[0].description).toBe(feedback.message)
  })

  it("throws when Discord rejects the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Unauthorized", {
          status: 401,
          statusText: "Unauthorized",
        })
      )
    )

    await expect(
      sendDocFeedbackToDiscord("https://discord.test/webhook", feedback)
    ).rejects.toThrow("401")
  })
})
