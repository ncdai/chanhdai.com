export function SidebarIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    // Icon designed by @ncdai
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/*
        The fill width follows `data-sidebar-open` on <html>, like the sidebar
        panel, so the first paint matches the persisted state. The widths are
        px on purpose: viewBox units, not spacing-scale values.
      */}
      <rect
        x="5"
        y="6"
        rx="1"
        height="12"
        fill="currentColor"
        className="w-(--fill-width) transition-[width] duration-300 [--fill-width:6px] in-data-[sidebar-open=false]:[--fill-width:2px]"
      />
    </svg>
  )
}
