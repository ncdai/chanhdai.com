/**
 * Apply with `filter: url(#id)` on an HTML element so values stay in CSS px.
 * The wide region leaves room for children that overflow the box.
 */
export function InkFilter({
  id,
  density = 2.4,
}: {
  id: string
  /** Raise for solid shapes, where visible grain turns into speckles. */
  density?: number
}) {
  return (
    <svg className="absolute size-0" aria-hidden>
      <filter
        id={id}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.1"
          numOctaves="2"
          seed="3"
          result="wobble"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="wobble"
          scale="1.5"
          xChannelSelector="R"
          yChannelSelector="G"
          result="rough"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="2.5"
          seed="9"
          result="grain"
        />
        <feColorMatrix
          in="grain"
          type="matrix"
          values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${density} 0 0 0 0`}
          result="grainAlpha"
        />
        <feComposite in="rough" in2="grainAlpha" operator="in" />
      </filter>
    </svg>
  )
}
