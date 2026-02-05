import { NotFound as PageNotFound } from "@/components/not-found"

export const metadata = {
  title: "Page Not Found",
}

export default function NotFound() {
  return <PageNotFound className="h-screen" />
}
