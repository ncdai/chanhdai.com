import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: SITE_INFO.name,
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: [
      {
        src: "https://assets.chanhdai.com/images/icon-vector.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "https://assets.chanhdai.com/images/icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "https://assets.chanhdai.com/images/icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "https://assets.chanhdai.com/images/maskable-icon.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: [
      {
        src: "https://assets.chanhdai.com/images/screenshot-mobile-dark.webp?v=4",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
      },
      {
        src: "https://assets.chanhdai.com/images/screenshot-mobile-light.webp?v=4",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
      },
      {
        src: "https://assets.chanhdai.com/images/screenshot-desktop-dark.webp?v=4",
        type: "image/webp",
        sizes: "1920x1080",
        form_factor: "wide",
      },
      {
        src: "https://assets.chanhdai.com/images/screenshot-desktop-light.webp?v=4",
        type: "image/webp",
        sizes: "1920x1080",
        form_factor: "wide",
      },
    ],
  }
}
