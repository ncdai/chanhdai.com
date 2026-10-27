"use client"

import dynamic from "next/dynamic"

import { useMediaQuery } from "@/hooks/use-media-query"

function Placeholder() {
  return <div className="h-150 w-200 ring-1 ring-border" />
}

const Game = dynamic(() => import("./component").then((mod) => mod.Daikanoid), {
  ssr: false,
  loading: Placeholder,
})

export function Daikanoid(props: React.ComponentProps<typeof Game>) {
  // The canvas is a fixed 800x600, so smaller screens never mount it and skip
  // downloading p5, the font, sounds, and images. Matches Tailwind's `lg`.
  const isDesktop = useMediaQuery("(min-width: 64rem)")

  return isDesktop ? <Game {...props} /> : <Placeholder />
}
