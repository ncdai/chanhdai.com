"use client"

import dynamic from "next/dynamic"

export const Daikanoid = dynamic(
  () => import("./component").then((mod) => mod.Daikanoid),
  {
    ssr: false,
    loading: () => <div className="h-150 w-200 ring-1 ring-border" />,
  }
)
