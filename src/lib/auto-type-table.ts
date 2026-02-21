import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript"

export const generator = createGenerator({
  // recommended: choose a directory for cache
  cache: createFileSystemGeneratorCache(".next/fumadocs-typescript"),
})
