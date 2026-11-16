import { CodeBlockCaption, CodeBlockFrame } from "@/components/mdx-code-block"
import { getInstallPrompt } from "@/features/doc/lib/install-prompt"

export function InstallPrompt({ name }: { name: string }) {
  const prompt = getInstallPrompt(name)

  if (!prompt) {
    return null
  }

  return (
    <figure data-rehype-pretty-code-figure="" className="not-prose">
      <CodeBlockCaption data-rehype-pretty-code-title="" data-language="md">
        Prompt
      </CodeBlockCaption>

      <CodeBlockFrame code={prompt} hasTitle copyEvent="copy_install_prompt">
        <pre className="px-4 text-sm wrap-break-word whitespace-pre-wrap">
          <code>{prompt}</code>
        </pre>
      </CodeBlockFrame>
    </figure>
  )
}
