import {
  createFileSystemGeneratorCache,
  createGenerator,
} from "fumadocs-typescript"

export const generator = createGenerator({
  // recommended: choose a directory for cache
  cache:
    process.env.NODE_ENV === "development"
      ? createFileSystemGeneratorCache(".next/fumadocs-typescript")
      : false,
})
