"use client"

import { motion, useMotionValue, useSpring } from "motion/react"

const VIEWBOX_WIDTH = 1410
const DEFAULT_GRADIENT_X = 705

export function SiteFooterInteractiveLogotype() {
  const gradientX1Raw = useMotionValue(DEFAULT_GRADIENT_X)
  const gradientX1 = useSpring(gradientX1Raw, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget
    const containerRect = container.getBoundingClientRect()
    const mouseX = event.clientX - containerRect.left
    const containerWidth = containerRect.width

    const normalizedX = (mouseX / containerWidth) * VIEWBOX_WIDTH
    const clampedX = Math.max(0, Math.min(VIEWBOX_WIDTH, normalizedX))

    gradientX1Raw.set(clampedX)
  }

  const handleMouseLeave = () => {
    gradientX1Raw.set(DEFAULT_GRADIENT_X)
  }

  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/10">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full translate-y-[37.5%] items-center justify-center">
          <svg
            className="container size-full"
            viewBox="0 0 1410 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M129 33H161V65H129V33ZM33 33V1H129V33H33ZM33 225H1V33H33V225ZM129 225V257H33V225H129ZM129 225V193H161V225H129ZM193 1H225V65H321V97H225V257H193V1ZM321 97H353V257H321V97ZM417 65H545V257H513V225H481V193H513V97H417V65ZM417 225H385V97H417V225ZM417 225V257H481V225H417ZM577 65H705V97H609V257H577V65ZM705 97H737V257H705V97ZM769 1H801V65H897V97H801V257H769V1ZM897 97H929V257H897V97ZM961 1H1057V33H993V225H1057V257H961V1ZM1089 193V225H1057V193H1089ZM1089 65H1121V193H1089V65ZM1089 65V33H1057V65H1089ZM1185 65H1313V257H1281V225H1249V193H1281V97H1185V65ZM1185 225H1153V97H1185V225ZM1185 225V257H1249V225H1185ZM1377 1H1409V33H1377V1Z"
              fill="url(#paint0_linear_1145_73)"
            />
            <path
              d="M1345 65V97H1377V257H1409V65H1345Z"
              fill="url(#paint0_linear_1145_73)"
            />
            <path
              className="stroke-foreground/10"
              d="M129 33H161V65H129V33ZM129 33V1H33V33M129 33H33M33 33H1V225H33M33 33V225M33 225V257H129V225M33 225H129M129 225V193H161V225H129ZM321 97V65H225V1H193V257H225V97H321ZM321 97H353V257H321V97ZM481 225H513V257H545V65H417V97M481 225V193H513V97H417M481 225V257H417V225M481 225H417M417 97H385V225H417M417 97V225M705 97V65H577V257H609V97H705ZM705 97H737V257H705V97ZM897 97V65H801V1H769V257H801V97H897ZM897 97H929V257H897V97ZM1057 33V1H961V257H1057V225M1057 33H993V225H1057M1057 33H1089V65M1057 33V65H1089M1057 225H1089V193M1057 225V193H1089M1089 193H1121V65H1089M1089 193V65M1249 225H1281V257H1313V65H1185V97M1249 225V193H1281V97H1185M1249 225V257H1185V225M1249 225H1185M1185 97H1153V225H1185M1185 97V225M1377 1H1409V33H1377V1ZM1345 65V97H1377V257H1409V65H1345Z"
              strokeWidth="2"
            />
            <defs>
              <motion.linearGradient
                id="paint0_linear_1145_73"
                x1={gradientX1}
                y1="1"
                x2="705"
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
