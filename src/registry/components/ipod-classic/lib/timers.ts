export function createTimeout(ms: number, callback: () => void) {
  let id: ReturnType<typeof setTimeout> | undefined

  function stop() {
    clearTimeout(id)
    id = undefined
  }

  return {
    start() {
      stop()
      id = setTimeout(() => {
        id = undefined
        callback()
      }, ms)
    },
    stop,
    flush() {
      if (id === undefined) return
      stop()
      callback()
    },
  }
}

/**
 * Fires once after `delay`, then every `interval` until stopped. `stop()`
 * reports whether it fired, so a tap can be told apart from a hold.
 */
export function createHoldTimer(onFire: (repeat: boolean) => void) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  let interval: ReturnType<typeof setInterval> | undefined
  let fired = false

  function stop() {
    clearTimeout(timeout)
    clearInterval(interval)
    timeout = undefined
    interval = undefined
    const didFire = fired
    fired = false
    return didFire
  }

  return {
    start(delay: number, repeatInterval?: number) {
      stop()
      timeout = setTimeout(() => {
        timeout = undefined
        fired = true
        onFire(false)
        if (fired && repeatInterval !== undefined) {
          interval = setInterval(() => onFire(true), repeatInterval)
        }
      }, delay)
    },
    stop,
  }
}
