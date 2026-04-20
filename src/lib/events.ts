import posthog from "posthog-js"
import { z } from "zod"

import { op } from "./openpanel"

const eventSchema = z.object({
  name: z.enum([
    "copy_npm_command",
    "copy_code_block",
    "copy_block_code",
    "copy_email",
    "copy_phone_number",
    "play_name_pronunciation",
    "open_command_menu",
    "command_menu_search",
    "command_menu_action",
    "blog_search",
    "toc_inline_toggle",
    "toc_inline_item_click",
    "toc_minimap_hover",
    "toc_minimap_item_click",
    "keyboard_shortcut_navigate",
    "block_viewer_tab_change",
    "block_viewer_resize",
    "block_viewer_open_preview",
    "block_viewer_refresh_preview",
    "block_viewer_theme_change",
  ]),
  // declare type AllowedPropertyValues = string | number | boolean | null
  properties: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
})

export type Event = z.infer<typeof eventSchema>

export function trackEvent(input: Event) {
  const event = eventSchema.parse(input)
  if (event) {
    console.log("trackEvent:", event)
    posthog.capture(event.name, event.properties)
    op.track(event.name, event.properties)
  }
}
