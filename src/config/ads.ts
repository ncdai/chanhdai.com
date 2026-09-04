const serve = process.env.NEXT_PUBLIC_CARBON_ADS_SERVE
const placement = process.env.NEXT_PUBLIC_CARBON_ADS_PLACEMENT

export const CARBON_ADS = serve && placement ? { serve, placement } : null
