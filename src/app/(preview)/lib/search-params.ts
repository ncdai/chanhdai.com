import type { Options } from "nuqs"
import { useQueryStates } from "nuqs"
import type { inferParserType } from "nuqs/server"
import { createSerializer, parseAsString } from "nuqs/server"

const previewSearchParams = {
  theme: parseAsString,
}

export const serializePreviewSearchParams =
  createSerializer(previewSearchParams)

export type PreviewSearchParams = inferParserType<typeof previewSearchParams>

export function usePreviewSearchParams(options: Options = {}) {
  const [params, setParams] = useQueryStates(previewSearchParams, {
    shallow: false,
    history: "push",
    ...options,
  })

  return [params, setParams] as const
}
