export const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8"

type MarkdownResponseInit = ResponseInit & {
  /**
   * Set when the same URL also serves HTML through an Accept-based rewrite in
   * next.config.ts, so shared caches keep the two variants apart.
   */
  negotiated?: boolean
}

export function markdownResponse(
  body: string,
  { negotiated = false, headers, ...init }: MarkdownResponseInit = {}
) {
  const responseHeaders = new Headers(headers)
  responseHeaders.set("Content-Type", MARKDOWN_CONTENT_TYPE)

  if (negotiated) {
    responseHeaders.append("Vary", "Accept")
  }

  return new Response(body, { ...init, headers: responseHeaders })
}
