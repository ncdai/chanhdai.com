export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      aria-hidden
      {...props}
    >
      <path
        fill="currentColor"
        d="M192 64H64v128h128v64H0V0h192v64ZM256 192h-64V64h64v128ZM320 0h64v128h-64V0ZM448 0h64v128h-64V0ZM384 64h64v192h-64V64Z"
      />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 256"><path fill="currentColor" d="M192 64H64v128h128v64H0V0h192v64ZM256 192h-64V64h64v128ZM320 0h64v128h-64V0ZM448 0h64v128h-64V0ZM384 64h64v192h-64V64Z"/></svg>`
}
