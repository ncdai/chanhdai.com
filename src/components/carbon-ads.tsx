import { CARBON_ADS } from "@/config/ads"
import type { CarbonAdsProps } from "@/registry/transformed/components/carbon-ads"
import { CarbonAds as CarbonAdsPrimitive } from "@/registry/transformed/components/carbon-ads"

export function CarbonAds(props: Omit<CarbonAdsProps, "serve" | "placement">) {
  if (!CARBON_ADS) return null

  return (
    <CarbonAdsPrimitive
      serve={CARBON_ADS.serve}
      placement={CARBON_ADS.placement}
      {...props}
    />
  )
}
