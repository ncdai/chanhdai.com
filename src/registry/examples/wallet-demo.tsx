import {
  ArrowRightIcon,
  CoffeeIcon,
  PlaneIcon,
  WalletMinimalIcon,
} from "lucide-react"

import { ChanhDaiMark } from "@/components/chanhdai-mark"
import {
  Wallet,
  WalletCard,
  WalletCardContent,
  WalletCardDescription,
  WalletCardHeader,
  WalletCards,
  WalletCardTitle,
  WalletLabel,
  WalletPocket,
} from "@/registry/components/wallet"

function Balance({ amount }: { amount: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[2.75cqw] leading-none tracking-wider opacity-70">
        Balance
      </span>

      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[7cqw] leading-none font-medium tracking-tight tabular-nums">
          {amount}
        </span>

        <a
          href="#activity"
          className="group/activity relative flex items-center gap-1 rounded-sm text-[3cqw] leading-none font-medium outline-offset-4 outline-current after:absolute after:-inset-3 focus-visible:outline-2"
        >
          Activity
          <ArrowRightIcon className="size-[3.5cqw] transition-transform duration-150 ease-out motion-safe:group-hover/activity:translate-x-0.5" />
        </a>
      </div>
    </div>
  )
}

export default function WalletDemo() {
  return (
    <Wallet>
      <WalletCards>
        <WalletCard className="bg-emerald-800 text-white">
          <WalletCardHeader>
            <WalletCardTitle>Savings</WalletCardTitle>
            <WalletCardDescription>
              •••• 0209
              <WalletMinimalIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent>
            <Balance amount="$48,210.00" />
          </WalletCardContent>
        </WalletCard>

        <WalletCard className="bg-sky-600 text-white">
          <WalletCardHeader>
            <WalletCardTitle>Travel</WalletCardTitle>
            <WalletCardDescription>
              •••• 1945
              <PlaneIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent>
            <Balance amount="$6,120.50" />
          </WalletCardContent>
        </WalletCard>

        <WalletCard className="bg-orange-600 text-white">
          <WalletCardHeader>
            <WalletCardTitle>Everyday</WalletCardTitle>
            <WalletCardDescription>
              •••• 9999
              <CoffeeIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent>
            <Balance amount="$1,284.75" />
          </WalletCardContent>
        </WalletCard>
      </WalletCards>

      <WalletPocket>
        <WalletLabel>
          <ChanhDaiMark />
          Wallet
        </WalletLabel>
      </WalletPocket>
    </Wallet>
  )
}
