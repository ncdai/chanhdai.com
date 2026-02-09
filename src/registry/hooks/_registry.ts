import type { Registry } from "shadcn/schema"

export const hook: Registry["items"] = [
  {
    name: "use-controllable-state",
    type: "registry:hook",
    title: "Controllable State Hook",
    files: [
      {
        path: "src/hooks/use-layout-effect.tsx",
        type: "registry:hook",
      },
      {
        path: "src/hooks/use-controllable-state.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "use-sound",
    type: "registry:hook",
    title: "Sound Hook",
    description:
      "Custom React hook to load and play a sound from a given URL using the Web Audio API.",
    files: [{ path: "src/hooks/use-sound.ts", type: "registry:hook" }],
  },
]
