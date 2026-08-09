import { Suspense } from "react"
import type { Metadata } from "next"

import { X_HANDLE } from "@/config/site"

import { Game } from "./game"

export const metadata: Metadata = {
  title: "Daikanoid",
  alternates: {
    canonical: "/game",
  },
  openGraph: {
    url: "/game",
    type: "website",
    images: {
      url: "https://assets.chanhdai.com/images/blog/daikanoid.webp",
      width: 1200,
      height: 630,
      alt: "Daikanoid",
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: ["https://assets.chanhdai.com/images/blog/daikanoid.webp"],
  },
}

export default function GamePage() {
  return (
    <div className="grid min-h-svh place-items-center py-6">
      <h1 className="sr-only">Daikanoid</h1>

      <section className="flex flex-col items-center gap-6 lg:hidden">
        <p>Open this page on a desktop to play.</p>
      </section>

      <section className="max-lg:hidden">
        <Suspense fallback={<div className="h-150 w-200 ring-1 ring-border" />}>
          <Game />
        </Suspense>
      </section>
    </div>
  )
}
