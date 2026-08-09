function getCSSVariable(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
}

function initColors() {
  return {
    background: getCSSVariable("--dk-background"),
    foreground: getCSSVariable("--dk-foreground"),
    mutedForeground: getCSSVariable("--dk-muted-foreground"),
    brick: getCSSVariable("--dk-brick"),
    brickHighlight: getCSSVariable("--dk-brick-highlight"),
    brickShadow: getCSSVariable("--dk-brick-shadow"),
  } as const
}

export let Colors = {} as ReturnType<typeof initColors>

export function loadColors() {
  Colors = initColors()
}
