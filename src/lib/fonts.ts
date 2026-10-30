import { Caveat } from "next/font/google"
import localFont from "next/font/local"
import { GeistSans } from "geist/font/sans"
import { GeistSerif } from "geist/font/serif"

import { cn } from "@/lib/utils"

const fontSans = GeistSans

const fontSerif = GeistSerif

const fontHandwritten = Caveat({
  weight: "400",
  display: "swap",
  variable: "--font-handwritten",
})

const fontMono = localFont({
  src: "../assets/fonts/PaperMono[wght].woff2",
  display: "swap",
  variable: "--font-mono",
})

// Only the iPod uses it, so it loads on demand instead of on every page.
const fontChicagoKare = localFont({
  src: "../assets/fonts/ChicagoKare-Regular.woff2",
  weight: "400",
  display: "block",
  preload: false,
  variable: "--font-chicago-kare",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontSerif.variable,
  fontHandwritten.variable,
  fontChicagoKare.variable,
  "[--font-sans:var(--font-geist-sans)]",
  "[--font-serif:var(--font-geist-serif)]"
)
