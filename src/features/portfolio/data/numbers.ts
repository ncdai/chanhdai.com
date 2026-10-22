import synced from "./numbers.json"

/** Packages whose downloads `pnpm numbers:sync` adds up. */
export const NPM_PACKAGES = [
  "@ncdai/react-wheel-picker",
  "@ncdai/react-swipe-actions",
]

/**
 * Updated by hand: the X API is paid, and a follower count read every few
 * weeks does not justify it.
 */
const X_FOLLOWERS = 3900

/** `numbers.json` is written by `pnpm numbers:sync`; edit it only through that. */
export const NUMBERS = {
  ...synced,
  xFollowers: X_FOLLOWERS,
}
