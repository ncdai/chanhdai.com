import { ShimmeringText } from "@/registry/components/shimmering-text"

export default function ShimmeringTextDemo2() {
  return (
    <ShimmeringText
      className="font-medium [--color:#fbbf24] [--shimmering-color:#ca8a04] dark:[--color:#f59e0b] dark:[--shimmering-color:#fcd34d]"
      text="Processing your request with AI ..."
    />
  )
}
