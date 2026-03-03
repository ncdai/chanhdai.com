"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { haptic } from "@/registry/lib/haptic"

export default function HapticDemo() {
  return (
    <div className="flex flex-col items-center gap-6 py-16 pointer-coarse:py-0">
      <Button onClick={() => haptic()}>Haptic</Button>

      <ScanToTryOnMobile />
    </div>
  )
}

function ScanToTryOnMobile() {
  return (
    <div className="flex flex-col items-center gap-6 pointer-coarse:hidden">
      <p className="text-center text-sm text-muted-foreground">
        Scan the QR code below to
        <br />
        try it out on mobile.
      </p>

      <Image
        className="rounded-lg border dark:border-transparent"
        src="https://assets.chanhdai.com/images/blog/haptic-qr-code.webp"
        alt="QR code"
        width={96}
        height={96}
        quality={100}
        unoptimized
      />
    </div>
  )
}
