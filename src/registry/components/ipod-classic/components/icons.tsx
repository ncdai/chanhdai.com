import { useId, type SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

/** A vector logo, so the boot screen stays sharp at any scale. */
export function AppleLogo(props: IconProps) {
  return (
    <svg viewBox="2.225 0 19.55 24" aria-hidden {...props}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden {...props}>
      <path
        d="M71.234-28.693 10.883 7.049v-71.533z"
        transform="translate(-3.043 18.03)scale(.27959)"
      />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden {...props}>
      <path
        d="M6.576-95.378h21.875V0H6.576zm42.578 0h21.94V0h-21.94z"
        transform="translate(-1.379 20)scale(.2097)"
      />
    </svg>
  )
}

export function RepeatAllIcon(props: IconProps) {
  return (
    <svg width="18" height="15" viewBox="0 0 18 15" aria-hidden {...props}>
      <path
        d="M24.851-6.64v-3.324H14.294q-.883 0-1.655.3a4.2 4.2 0 0 0-1.347.831 3.8 3.8 0 0 0-.906 1.272 3.9 3.9 0 0 0-.33 1.61q0 .689.277 1.378.277.688.682 1.213L7.062-.141a8.7 8.7 0 0 1-1.565-2.613 8.6 8.6 0 0 1-.562-3.092q0-1.841.697-3.452a8.92 8.92 0 0 1 4.694-4.716 8.5 8.5 0 0 1 3.414-.697h11.111v-3.533l7.232 5.944zm-9.554 2.771V-.56h10.572q.868 0 1.647-.292a4 4 0 0 0 1.348-.824q.569-.53.906-1.273a3.9 3.9 0 0 0 .337-1.624q0-.689-.277-1.355a5.5 5.5 0 0 0-.697-1.221l3.968-3.219a8.6 8.6 0 0 1 2.127 5.705 8.6 8.6 0 0 1-.697 3.451 8.9 8.9 0 0 1-1.894 2.808 9 9 0 0 1-2.8 1.894 8.5 8.5 0 0 1-3.414.697H15.297v3.548L8.08 1.791z"
        transform="translate(-2.83 10.464)scale(.57352)"
      />
    </svg>
  )
}

export function RepeatOneIcon(props: IconProps) {
  return (
    <svg width="19" height="15" viewBox="0 0 19 15" aria-hidden {...props}>
      <path
        d="M.3-.313q.04 0 .077.016.035.015.062.042a.2.2 0 0 1 .042.062q.016.036.016.077a.2.2 0 0 1-.016.076.2.2 0 0 1-.042.062.2.2 0 0 1-.062.042.2.2 0 0 1-.215-.042.2.2 0 0 1-.057-.138.2.2 0 0 1 .015-.077.2.2 0 0 1 .042-.062.2.2 0 0 1 .062-.042A.2.2 0 0 1 .3-.313m.027.302L.326-.23H.29l-.003.011-.005.01-.015.013-.009.004-.01.002-.009.002-.01.001H.225l.002.035h.054v.143h.046zM.7-.354v-.108H.355a.15.15 0 0 0-.09.03.12.12 0 0 0-.046.078.25.25 0 0 0-.147.135.3.3 0 0 1-.022-.109.293.293 0 0 1 .288-.289H.7v-.115l.236.193zm.269-.121a.283.283 0 0 1-.016.39A.3.3 0 0 1 .75 0H.522a.24.24 0 0 0 .029-.116L.55-.135l-.002-.02h.185a.14.14 0 0 0 .054-.01.1.1 0 0 0 .044-.027.1.1 0 0 0 .03-.041.1.1 0 0 0 .011-.053.1.1 0 0 0-.009-.044.2.2 0 0 0-.023-.04z"
        transform="translate(-.918 13.44)scale(18.3605)"
      />
    </svg>
  )
}

export function ShuffleIcon(props: IconProps) {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" aria-hidden {...props}>
      <path
        d="M.935-.347v-.111H.812a.1.1 0 0 0-.03.007.1.1 0 0 0-.026.02l-.252.314a1 1 0 0 1-.066.058l-.032.022-.035.019-.036.013A.2.2 0 0 1 .299 0h-.25v-.165h.25a.1.1 0 0 0 .037-.011.3.3 0 0 0 .073-.061L.68-.572l.017-.015.026-.017a.1.1 0 0 1 .035-.014.2.2 0 0 1 .044-.006h.133v-.109l.222.192zM.299-.624q.018 0 .036.006a.4.4 0 0 1 .11.064 1 1 0 0 1 .075.069l-.095.118L.38-.413.36-.429.339-.444.318-.455.299-.458h-.25v-.166zm.636.735V0H.802a.2.2 0 0 1-.044-.005.2.2 0 0 1-.061-.03L.68-.051.608-.14l.095-.116.053.066.026.018a.1.1 0 0 0 .03.007h.123v-.11l.222.192z"
        transform="translate(-.864 12.93)scale(17.6389)"
      />
    </svg>
  )
}

const SPEAKER_PATH =
  "M9.476 16V0L4.307 4.495a.25.25 0 0 1-.168.073L0 4.555v6.924l4.138-.014a.24.24 0 0 1 .168.063z"

export function VolumeLowIcon(props: IconProps) {
  return (
    <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden {...props}>
      <path d={SPEAKER_PATH} />
    </svg>
  )
}

export function VolumeHighIcon(props: IconProps) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden {...props}>
      <path d="M11.526 15.763c.569.239 1.022.245 1.462-.13 2.568-2.046 4.353-4.826 4.353-7.632S15.55 2.482 13.038.425c-.44-.384-.943-.424-1.512-.185-.455.443-.257 1.07.202 1.454 2.518 1.79 3.852 3.795 3.852 6.3 0 2.493-1.597 4.509-3.816 6.317-.458.384-.7.934-.238 1.452" />
      <path d="M10.628 11.546c.426.211 1.023.148 1.365-.22.852-.843 1.45-2.069 1.45-3.311 0-1.243-.598-2.491-1.45-3.344-.342-.369-.939-.432-1.365-.21-.434.428-.343.91.055 1.299.597.6 1.14 1.385 1.14 2.29s-.457 1.746-1.177 2.293c-.384.4-.412.806-.018 1.203" />
      <path d={SPEAKER_PATH} />
    </svg>
  )
}

export function MenuLabel(props: IconProps) {
  const curveId = useId()
  return (
    <svg width="400" height="150" viewBox="0 0 400 150" aria-hidden {...props}>
      <path
        id={curveId}
        fill="none"
        stroke="none"
        d="M31.234 97.495S92.808 41.234 200 41.234c121.84 0 168.766 56.26 168.766 56.26"
      />
      <text>
        <textPath href={`#${curveId}`} startOffset="112">
          menu
        </textPath>
      </text>
    </svg>
  )
}

/** Drawn as ▶▶|; Back reuses it rotated. */
export function SkipIcon(props: IconProps) {
  return (
    <svg width="23" height="12" viewBox="0 0 23 12" aria-hidden {...props}>
      <path d="M9.58 5.635 0 11.212V.057zm9.623 0-9.58 5.577V.057zm0-5.635H23v11.273h-3.797z" />
    </svg>
  )
}

export function PlayPauseIcon(props: IconProps) {
  return (
    <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden {...props}>
      <path d="M9.58 5.635 0 11.212V.057zM19.578 0h3.796v11.273h-3.796zm-5.793 0h3.797v11.273h-3.797z" />
    </svg>
  )
}
