"use client"

import { StatusButton } from "@/registry/transformed/components/status-button"

function fakeRequest() {
  return new Promise<void>((resolve) => setTimeout(resolve, 1500))
}

export default function StatusButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <StatusButton onClick={fakeRequest} successLabel="Submitted">
        Submit
      </StatusButton>

      <StatusButton
        variant="outline"
        onClick={fakeRequest}
        successLabel="Saved"
      >
        Save
      </StatusButton>

      <StatusButton size="sm" onClick={fakeRequest}>
        Copy
      </StatusButton>
    </div>
  )
}
