import { useCallback, useEffect, useRef } from "react";

/**
 * Cache storage for loaded audio buffers to prevent duplicate network requests and memory usage.
 * Maps audio URL to its decoded AudioBuffer.
 */
const audioCache = new Map<
  string,
  {
    buffer: AudioBuffer;
    loading: Promise<AudioBuffer>;
  } | null
>();

/**
 * Shared AudioContext instance to avoid creating multiple contexts.
 * Multiple AudioContexts can cause performance issues and resource exhaustion.
 */
let sharedAudioContext: AudioContext | null = null;

/**
 * Gets or creates a shared AudioContext instance.
 */
function getAudioContext(): AudioContext | null {
  if (sharedAudioContext) return sharedAudioContext;

  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextClass) {
    console.warn("Web Audio API is not supported in this browser.");
    return null;
  }

  sharedAudioContext = new AudioContextClass();
  return sharedAudioContext;
}

/**
 * Custom React hook to load and play a sound from a given URL using the Web Audio API.
 *
 * This hook implements caching to prevent duplicate network requests and memory usage
 * when the same audio file is used across multiple components.
 *
 * @param url - The URL of the audio file to load and play.
 * @returns A function that, when called, plays the loaded sound.
 *
 * @remarks
 * - Audio buffers are cached globally, so the same file is only loaded once
 * - Uses a shared AudioContext to avoid resource exhaustion
 * - If the Web Audio API is not supported in the browser, a warning is logged and playback is disabled
 * - Errors during fetching or decoding the audio are logged to the console
 *
 * @example
 * ```tsx
 * const playClick = useSound('/sounds/click.mp3');
 * // Later in an event handler:
 * playClick();
 * ```
 */
export function useSound(url: string) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;

    audioCtxRef.current = audioCtx;

    // Check if already cached
    const cached = audioCache.get(url);
    if (cached?.buffer) {
      bufferRef.current = cached.buffer;
      return;
    }

    // Check if already loading
    if (cached?.loading) {
      cached.loading
        .then((decoded) => {
          bufferRef.current = decoded;
        })
        .catch(() => {
          // Error already logged during fetch
        });
      return;
    }

    // Start loading
    const loadingPromise = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => audioCtx.decodeAudioData(data))
      .then((decoded) => {
        // Store in cache
        audioCache.set(url, { buffer: decoded, loading: loadingPromise });
        bufferRef.current = decoded;
        return decoded;
      })
      .catch((err) => {
        console.log(`Failed to load sound from ${url}:`, err);
        // Mark as failed in cache
        audioCache.set(url, null);
        throw err;
      });

    // Mark as loading in cache
    audioCache.set(url, { buffer: null!, loading: loadingPromise });
  }, [url]);

  const play = useCallback((volume: number = 1) => {
    if (audioCtxRef.current && bufferRef.current) {
      const source = audioCtxRef.current.createBufferSource();
      const gainNode = audioCtxRef.current.createGain();

      source.buffer = bufferRef.current;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      source.start(0);
    }
  }, []);

  return play;
}
