"use client"

import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/registry/components/code-block-command"

export default function CodeBlockCommandConvert() {
  return (
    <div className="w-full max-w-sm">
      <CodeBlockCommand {...convertNpmCommand("npx shadcn add button")} />
    </div>
  )
}
