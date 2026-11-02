import {
  DumbbellIcon,
  LibraryIcon,
  PlaneIcon,
  SixteenthNotesIcon,
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

function PassDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[2.75cqw] leading-none tracking-wider opacity-70">
        {label}
      </span>
      <span className="text-[5cqw] leading-none font-medium tracking-tight">
        {value}
      </span>
    </div>
  )
}

export default function WalletPassesDemo() {
  return (
    <Wallet>
      <WalletCards>
        <WalletCard className="bg-muted text-foreground inset-ring-foreground/10">
          <WalletCardHeader>
            <WalletCardTitle>Library</WalletCardTitle>
            <WalletCardDescription>
              Member
              <LibraryIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent className="flex justify-between gap-4">
            <PassDetail label="Branch" value="Thanh My Tay" />
            <PassDetail label="Due back" value="Sep 2" />
          </WalletCardContent>
        </WalletCard>

        <WalletCard className="bg-secondary text-secondary-foreground inset-ring-foreground/10">
          <WalletCardHeader>
            <WalletCardTitle>Gym</WalletCardTitle>
            <WalletCardDescription>
              Yearly
              <DumbbellIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent className="flex justify-between gap-4">
            <PassDetail label="Locker" value="A-50" />
            <PassDetail label="Renews" value="Apr 30" />
          </WalletCardContent>
        </WalletCard>

        <WalletCard className="bg-muted-foreground text-background">
          <WalletCardHeader>
            <WalletCardTitle>Concert</WalletCardTitle>
            <WalletCardDescription>
              Row A
              <SixteenthNotesIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent className="flex justify-between gap-4">
            <PassDetail label="Doors" value="19:45" />
            <PassDetail label="Seat" value="A-80" />
          </WalletCardContent>
        </WalletCard>

        <WalletCard className="bg-primary text-primary-foreground">
          <WalletCardHeader>
            <WalletCardTitle>Boarding pass</WalletCardTitle>
            <WalletCardDescription>
              VN 98
              <PlaneIcon strokeWidth={1.5} />
            </WalletCardDescription>
          </WalletCardHeader>
          <WalletCardContent className="flex justify-between gap-4">
            <PassDetail label="Route" value="SGN to SFO" />
            <PassDetail label="Gate" value="12" />
          </WalletCardContent>
        </WalletCard>
      </WalletCards>

      <WalletPocket>
        <WalletLabel>
          <ChanhDaiMark />
          Passes
        </WalletLabel>
      </WalletPocket>
    </Wallet>
  )
}
