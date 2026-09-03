import { addQueryParams } from "@/utils/url"

import { UTM_PARAMS } from "@/config/site"

export function getBookmarkExternalHref(url: string) {
  return addQueryParams(url, UTM_PARAMS)
}
