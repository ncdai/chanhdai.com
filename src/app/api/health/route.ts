import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: "portfolio",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
