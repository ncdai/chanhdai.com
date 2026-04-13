export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="mx-auto h-12 border-x border-line md:max-w-3xl" />
      {children}
    </>
  )
}
