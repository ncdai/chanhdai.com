import { CarbonAds } from "@/registry/transformed/components/carbon-ads"

const serve = process.env.NEXT_PUBLIC_CARBON_ADS_SERVE
const placement = process.env.NEXT_PUBLIC_CARBON_ADS_PLACEMENT

export default function CarbonAdsDemo() {
  if (!serve || !placement) return null

  return <CarbonAds serve={serve} placement={placement} />
}
