"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { haptic, supportsHaptic } from "@/registry/lib/haptic"

export default function HapticDemo() {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <Button onClick={() => haptic()}>Haptic</Button>

      {!supportsHaptic && <ScanToTryOnMobile />}
    </div>
  )
}

function ScanToTryOnMobile() {
  return (
    <>
      <p className="text-center text-sm text-balance text-muted-foreground">
        Scan the QR code below to
        <br />
        try it out on your mobile device.
      </p>

      <Image
        className="rounded-lg border dark:border-transparent"
        src="https://assets.chanhdai.com/images/blog/haptic-qr-code.webp"
        alt="QR code"
        width={100}
        height={100}
        quality={100}
        unoptimized
      />
    </>
  )
}
