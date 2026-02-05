import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const duckFollowerVisibilityAtom = atomWithStorage<boolean>(
  "duck-follower-visible",
  false
)

export function useDuckFollowerVisibility() {
  return useAtom(duckFollowerVisibilityAtom)
}
