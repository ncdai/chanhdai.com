import { OpenPanel } from "@openpanel/web"

export const op = new OpenPanel({
  clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!,
  trackScreenViews: true,
})
