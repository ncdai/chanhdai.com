export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mx-auto border-x pt-12 md:max-w-3xl">{children}</div>
}
