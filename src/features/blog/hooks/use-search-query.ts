import { useQueryState } from "nuqs"

export function useSearchQuery() {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  })

  return { query, setQuery }
}
