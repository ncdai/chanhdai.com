export default function AppLayoutWide({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="layout-wide"
      className="container mx-auto border-x border-edge"
    >
      {children}
    </div>
  )
}
