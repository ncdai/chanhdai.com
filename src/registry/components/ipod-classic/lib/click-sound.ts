const GAIN = 0.3
/** Clicks closer together than this merge, like the piezo could not keep up. */
const MIN_SPACING_SECONDS = 0.05
const MAX_BACKLOG_SECONDS = 0.15
const RESUME_LEAD_SECONDS = 0.08
const STALE_RESUME_MS = 200

/** A 2ms burst of decaying noise, close to the click wheel's piezo tick. */
function createClickBuffer(context: AudioContext) {
  const { sampleRate } = context
  const length = Math.round(sampleRate * 0.003)
  const buffer = context.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  const decay = sampleRate * 0.0007
  // Seeded so every click sounds the same.
  let seed = 7
  for (let i = 0; i < length; i += 1) {
    seed = (seed * 16807) % 2147483647
    const noise = (seed / 2147483647) * 2 - 1
    data[i] = noise * 0.72 * Math.exp(-i / decay)
  }
  return buffer
}

const resuming = new WeakSet<AudioContext>()

/** Browsers start contexts suspended until a gesture; resume on each one. */
export function resumeAudioContext(context: AudioContext) {
  if (context.state === "running" || context.state === "closed") return
  if (resuming.has(context)) return
  resuming.add(context)
  const done = () => resuming.delete(context)
  context.resume().catch(done).finally(done)
  setTimeout(done, 1000)
}

export function createClickSound(context: AudioContext) {
  const output = context.createGain()
  output.gain.value = GAIN
  output.connect(context.destination)
  const buffer = createClickBuffer(context)
  let nextStart = 0
  let requestedWhileSuspended: number | null = null

  function play() {
    const { currentTime } = context
    if (nextStart - currentTime >= MAX_BACKLOG_SECONDS) return
    const startAt = Math.max(currentTime, nextStart)
    const source = context.createBufferSource()
    source.buffer = buffer
    source.connect(output)
    source.start(startAt)
    nextStart = startAt + MIN_SPACING_SECONDS
  }

  function onStateChange() {
    if (context.state !== "running") return
    nextStart = Math.max(nextStart, context.currentTime + RESUME_LEAD_SECONDS)
    if (requestedWhileSuspended === null) return
    const isStale = Date.now() - requestedWhileSuspended > STALE_RESUME_MS
    requestedWhileSuspended = null
    if (!isStale) play()
  }

  context.addEventListener("statechange", onStateChange)

  return {
    playClick() {
      if (context.state !== "running") {
        resumeAudioContext(context)
        requestedWhileSuspended ??= Date.now()
        return
      }
      play()
    },
    destroy() {
      context.removeEventListener("statechange", onStateChange)
      output.disconnect()
    },
  }
}
