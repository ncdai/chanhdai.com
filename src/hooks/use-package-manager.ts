import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type PackageManager = "pnpm" | "yarn" | "npm" | "bun"

const packageManagerAtom = atomWithStorage<PackageManager>(
  "packageManager",
  "pnpm"
)

export function usePackageManager() {
  return useAtom(packageManagerAtom)
}
