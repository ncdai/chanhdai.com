import {
  isInertAtom,
  playbackAtom,
  scrollTargetAtom,
  seekAtom,
  settingsAtom,
  statusAtom,
  type IpodStore,
} from "./atoms"
import { createClickSound, resumeAudioContext } from "./click-sound"
import { BOOT_MIN_MS, DRAG_STEP_DEGREES, VOLUME_SAVE_MS } from "./constants"
import { createMenuController } from "./menu-controller"
import { createPlayback } from "./playback"
import { createTimeout } from "./timers"
import type { IpodSettings, RepeatMode, ScrollTarget } from "./types"
import type { WheelScroll } from "./wheel-gesture"
import { createHoldSeeker, createWheelScroller } from "./wheel-scroll"

const REPEAT_MODES: Record<IpodSettings["repeat"], RepeatMode> = {
  off: "none",
  one: "one",
  all: "all",
}

export type IpodEngine = ReturnType<typeof createIpodEngine>

/** Everything that needs the browser: audio, timers, and input handling. */
export function createIpodEngine({
  store,
  getMenuElement,
  getListElement,
}: {
  store: IpodStore
  getMenuElement: () => HTMLElement | null
  getListElement: () => HTMLElement | null
}) {
  const context = new AudioContext()
  const clickSound = createClickSound(context)
  const playback = createPlayback(store, context)
  const menu = createMenuController({
    store,
    playback,
    getMenuElement,
    getListElement,
  })
  const isInert = () => store.get(isInertAtom)
  const isSeeking = () => store.get(seekAtom).isSeeking
  const settings = () => store.get(settingsAtom)

  // Boot shows the logo for a moment, but only once the iPod is online.
  let hasBooted = false
  const setStatus = (partial: Partial<typeof statusAtom.init>) =>
    store.set(statusAtom, (status) => ({ ...status, ...partial }))
  const bootTimer = createTimeout(BOOT_MIN_MS, () =>
    setStatus({ isBooting: false })
  )

  function handleOnlineChange() {
    const isOnline = navigator.onLine
    setStatus({ isOnline })
    if (!isOnline) playback.pause()
    if (hasBooted) return
    if (isOnline) bootTimer.start()
    else bootTimer.stop()
  }

  handleOnlineChange()
  window.addEventListener("online", handleOnlineChange)
  window.addEventListener("offline", handleOnlineChange)

  // Volume is saved a moment after it settles, not on every step.
  const volumePercent = () => Math.round(store.get(playbackAtom).volume * 100)
  const volumeSaver = createTimeout(VOLUME_SAVE_MS, () =>
    store.set(settingsAtom, (value) => ({ ...value, volume: volumePercent() }))
  )
  let lastVolume = store.get(playbackAtom).volume

  let lastSettings: IpodSettings | undefined
  function applySettings() {
    const { shuffle, repeat } = settings()
    if (shuffle !== lastSettings?.shuffle) {
      playback.setShuffle(shuffle === "songs")
    }
    if (repeat !== lastSettings?.repeat) {
      playback.setRepeatMode(REPEAT_MODES[repeat])
    }
    lastSettings = settings()
  }

  const holdSeeker = createHoldSeeker()

  // Subscribing mounts settingsAtom, which loads the saved settings.
  const unsubscribers = [
    store.sub(settingsAtom, applySettings),
    store.sub(isInertAtom, () => {
      if (!isInert()) hasBooted = true
    }),
    store.sub(playbackAtom, () => {
      const { volume } = store.get(playbackAtom)
      if (volume === lastVolume) return
      lastVolume = volume
      if (volumePercent() !== settings().volume) volumeSaver.start()
    }),
    store.sub(seekAtom, () => {
      if (isSeeking()) holdSeeker.cancel()
    }),
  ]
  applySettings()
  playback.setVolume(settings().volume / 100)

  function handleUserActivity() {
    resumeAudioContext(context)
    menu.notifyActivity()
  }

  function click(count: number, target: ScrollTarget) {
    if (settings().clicker !== "on" || target === "seek") return
    for (let i = 0; i < count; i += 1) clickSound.playClick()
  }

  const scroller = createWheelScroller({ move: menu.move, click })

  function holdSeek(direction: number, isRepeat: boolean) {
    const state = store.get(playbackAtom)
    const time = holdSeeker.step(direction, isRepeat, {
      ...state,
      isInert: isInert(),
      isSeeking: isSeeking(),
    })
    if (time === undefined) return
    menu.notifyActivity()
    playback.seek(time)
  }

  /** Buttons do nothing until the iPod has booted and while offline. */
  const whenReady =
    <T extends unknown[]>(action: (...args: T) => void) =>
    (...args: T) => {
      if (!isInert()) action(...args)
    }

  const scrollTarget = () => store.get(scrollTargetAtom)

  return {
    menu,
    handleUserActivity,
    handleKeyActivity(event: KeyboardEvent) {
      if (!event.repeat || event.key.startsWith("Arrow")) handleUserActivity()
    },
    wheel: {
      scroll({ step, degrees, speed }: WheelScroll) {
        menu.notifyActivity()
        if (isInert()) return
        const target = scrollTarget()
        if (target === "brick") {
          menu.turnPaddle(step * degrees)
          return
        }
        scroller.scroll({
          step,
          degrees,
          target,
          multiplier: menu.accelerate(speed, step),
          dragStepDegrees: DRAG_STEP_DEGREES,
        })
      },
      keyScroll(step: number, heldMs: number) {
        menu.notifyActivity()
        if (isInert()) return
        if (menu.keyStep(step, heldMs)) click(1, scrollTarget())
      },
      dragStart() {
        scroller.reset()
        if (!store.get(statusAtom).isBooting) menu.seek.handleDragStart()
      },
      dragEnd: () => menu.seek.handleDragEnd(),
      steer: (direction: number | null) => menu.steerPaddle(direction ?? 0),
      select: whenReady(menu.select),
      selectHold: whenReady(menu.selectHold),
      menu: whenReady(menu.back),
      playPause: whenReady(menu.playPause),
      back: whenReady(() => {
        if (!isSeeking()) playback.skipPrevious()
      }),
      forward: whenReady(() => {
        if (!isSeeking()) playback.skipNext()
      }),
      backHold: (repeat: boolean) => holdSeek(-1, repeat),
      forwardHold: (repeat: boolean) => holdSeek(1, repeat),
    },
    /** The hidden sliders on Now Playing, for keyboard and screen readers. */
    sliders: {
      focusScrub() {
        if (!store.get(playbackAtom).hasLoadedItem) return
        menu.volume.exit()
        menu.seek.keepOpen()
      },
      scrub(time: number) {
        if (store.get(playbackAtom).hasLoadedItem) {
          menu.volume.exit()
          menu.seek.keepOpen()
        }
        menu.seek.seekTo(time)
      },
      commitScrub: menu.seek.commit,
      blurScrub: menu.seek.release,
      focusVolume() {
        menu.seek.exit()
        menu.volume.keepOpen()
      },
      setVolume(value: number) {
        menu.volume.keepOpen()
        menu.volume.set(value)
      },
      blurVolume: menu.volume.release,
    },
    destroy() {
      bootTimer.stop()
      volumeSaver.flush()
      window.removeEventListener("online", handleOnlineChange)
      window.removeEventListener("offline", handleOnlineChange)
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      menu.destroy()
      playback.destroy()
      clickSound.destroy()
      context.close().catch(() => {})
    },
  }
}
