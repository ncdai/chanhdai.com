import { Twemoji } from "@/registry/components/twemoji"

export default function TwemojiDemo() {
  return (
    <div className="flex flex-col gap-4 text-center">
      <p className="text-lg">
        <Twemoji>👍 ❤️ 🤣 😲 😭 😡</Twemoji>
      </p>
      <p className="text-lg">
        <Twemoji>Hello from Viet Nam 🇻🇳</Twemoji>
      </p>
      <p className="text-base">
        <Twemoji>Built with 💛 and ☕️</Twemoji>
      </p>
    </div>
  )
}
