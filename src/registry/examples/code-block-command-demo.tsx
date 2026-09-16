"use client"

import { CodeBlockCommand } from "@/registry/components/code-block-command"

export default function CodeBlockCommandDemo() {
  return (
    <div className="w-full max-w-sm">
      <CodeBlockCommand
        pnpm="pnpm dlx shadcn add button"
        yarn="yarn shadcn add button"
        npm="npx shadcn add button"
        bun="bunx --bun shadcn add button"
      />
    </div>
  )
}
