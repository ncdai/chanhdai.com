"use client"

import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/registry/components/code-block-command"

export default function CodeBlockCommandConvertDemo() {
  return (
    <div className="w-full max-w-md">
      <CodeBlockCommand
        prompt="Add the @ncdai/code-block-command component to my project"
        {...convertNpmCommand("npx shadcn add @ncdai/code-block-command")}
      />
    </div>
  )
}
