import { CodeBlockCommand } from "@/registry/code-block-command"

export default function CodeBlockCommandDemo() {
  return (
    <div className="w-full max-w-md">
      <CodeBlockCommand
        pnpm="pnpm dlx shadcn add @ncdai/code-block-command"
        yarn="npx shadcn add @ncdai/code-block-command"
        npm="npx shadcn add @ncdai/code-block-command"
        bun="bunx --bun shadcn add @ncdai/code-block-command"
      />
    </div>
  )
}
