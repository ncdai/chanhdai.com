"use client"

// Recreated from the iPod in Apple Music's web app (its 404 page): https://music.apple.com
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react"
import { createStore, Provider, useAtomValue } from "jotai"

import { cn } from "@/lib/utils"

import { ClickWheel } from "./components/click-wheel"
import { Screen } from "./components/screen"
import styles from "./ipod-classic.module.css"
import { catalogAtom, engineAtom, type IpodStore } from "./lib/atoms"
import { createCatalog } from "./lib/catalog"
import { createIpodEngine } from "./lib/engine"
import type { IpodLibrary } from "./lib/types"

export type IpodClassicProps = ComponentProps<"div"> & {
  /**
   * Songs and playlists to browse and play.
   * @fumadocsHref #ipodlibrary
   */
  library: IpodLibrary
}

export function IpodClassic({
  library,
  className,
  ...props
}: IpodClassicProps) {
  const catalog = useMemo(() => createCatalog(library), [library])
  const [store] = useState(() => {
    const ipodStore = createStore()
    ipodStore.set(catalogAtom, catalog)
    return ipodStore
  })

  useEffect(() => {
    store.set(catalogAtom, catalog)
  }, [store, catalog])

  return (
    <Provider store={store}>
      <div {...props} className={cn(styles.root, className)}>
        <IpodBody store={store} />
      </div>
    </Provider>
  )
}

function IpodBody({ store }: { store: IpodStore }) {
  const engine = useAtomValue(engineAtom)
  const menuRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement | null>(null)

  // An outgoing list unmounts after the new one mounts, so it only clears itself.
  const registerList = useCallback((element: HTMLUListElement) => {
    listRef.current = element
    return () => {
      if (listRef.current === element) listRef.current = null
    }
  }, [])

  // The engine needs an AudioContext, so it only exists on the client.
  useEffect(() => {
    const created = createIpodEngine({
      store,
      getMenuElement: () => menuRef.current,
      getListElement: () => listRef.current,
    })
    store.set(engineAtom, created)
    return () => {
      store.set(engineAtom, null)
      created.destroy()
    }
  }, [store])

  return (
    <div className={styles.ipod}>
      <div className={styles.shadow}>
        <div className={styles.shadowInner}>
          <div
            className={styles.body}
            onPointerDown={engine?.handleUserActivity}
            onKeyDownCapture={(event) =>
              engine?.handleKeyActivity(event.nativeEvent)
            }
          >
            <Screen menuRef={menuRef} registerList={registerList} />
            <ClickWheel />
          </div>
        </div>
      </div>
    </div>
  )
}
