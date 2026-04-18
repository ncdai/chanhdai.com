import type { Registry } from "shadcn/schema"

export const hook: Registry["items"] = [
  {
    name: "use-sound",
    type: "registry:hook",
    title: "useSound",
    description:
      "Hook for playing sound effects with volume, playback rate, and interrupt controls.",
    files: [
      {
        path: "hooks/sound/use-sound.ts",
        type: "registry:hook",
        target: "hooks/sound/use-sound.ts",
      },
      {
        path: "lib/sound/sound-engine.ts",
        type: "registry:lib",
        target: "lib/sound/sound-engine.ts",
      },
      {
        path: "lib/sound/sound-types.ts",
        type: "registry:lib",
        target: "lib/sound/sound-types.ts",
      },
    ],
  },
  {
    name: "use-controllable-state",
    type: "registry:hook",
    title: "useControllableState",
    files: [
      {
        path: "hooks/use-controllable-state/use-controllable-state.tsx",
        type: "registry:hook",
      },
    ],
  },
]
