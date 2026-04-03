"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MiddleTruncation } from "@/registry/components/middle-truncation/middle-truncation"

export default function MiddleTruncationDemo() {
  return (
    <ResizablePanelGroup orientation="horizontal" className="w-full max-w-md">
      <ResizablePanel minSize="30%" defaultSize="100%" className="pr-1">
        <ExampleCard>
          <ExampleItem>
            <ExampleLabel>{`<MiddleTruncation>`}</ExampleLabel>
            <MiddleTruncation>
              /Users/ncdai/Code/chanhdai.com/src/components/ui/button.tsx
            </MiddleTruncation>
          </ExampleItem>

          <ExampleItem>
            <ExampleLabel>{`<MiddleTruncation end={4}>`}</ExampleLabel>
            <MiddleTruncation end={4}>
              FY26_Q1_Consolidated_Financial_Statements.pdf
            </MiddleTruncation>
          </ExampleItem>

          <ExampleItem>
            <ExampleLabel>{`<MiddleTruncation minEnd={12}>`}</ExampleLabel>
            <MiddleTruncation minEnd={12}>
              /Users/ncdai/Code/chanhdai.com/node_modules/shadcn/package.json
            </MiddleTruncation>
          </ExampleItem>

          <ExampleItem>
            <ExampleLabel>{`<MiddleTruncation ellipsis=" ... ">`}</ExampleLabel>
            <MiddleTruncation ellipsis=" ... ">
              https://www.apple.com/newsroom/pdfs/fy2026-q1/FY26_Q1_Consolidated_Financial_Statements.pdf
            </MiddleTruncation>
          </ExampleItem>
        </ExampleCard>
      </ResizablePanel>

      <ResizableHandle
        className="relative w-2 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-12 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all hover:after:bg-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:hover:after:bg-zinc-700"
        disableDoubleClick
      />

      <ResizablePanel minSize="0%" defaultSize="0%" />
    </ResizablePanelGroup>
  )
}

function ExampleCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border bg-card p-6 text-sm">
      {children}
    </div>
  )
}

function ExampleItem({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col gap-1.5">{children}</div>
}

function ExampleLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden font-mono text-xs whitespace-nowrap text-muted-foreground">
      {children}
    </div>
  )
}
