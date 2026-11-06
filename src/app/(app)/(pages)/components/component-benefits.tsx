import { IconTile } from "@/components/ui/icon-tile"

export function ComponentBenefits() {
  return (
    <section aria-labelledby="component-benefits-title">
      <h2 id="component-benefits-title" className="sr-only">
        What you get
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2">
        <Benefit
          icon={
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M2 8.69444C2 13.0348 7.58942 17.858 10.4107 19.9677C11.3601 20.6776 12.6399 20.6776 13.5893 19.9677C16.4106 17.858 22 13.0348 22 8.69444C22 5.82563 19.8947 3.5 17 3.5C15.5 3.5 14 4 12 6C10 4 8.5 3.5 7 3.5C4.10526 3.5 2 5.82563 2 8.69444Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="currentColor"
              />
            </svg>
          }
          title="Built with care"
          description="Every pixel and interaction tuned by hand."
        />
        <Benefit
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.00004 17C4.00004 17 9.99999 12.5811 10 11C10 9.41884 4 5 4 5" />
              <path d="M12 19H20" />
            </svg>
          }
          title="One-command install"
          description="Built into the shadcn CLI, no setup needed."
        />
        <Benefit
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 4L9 20" />
              <path d="M5.99997 16C5.99997 16 2.00001 13.054 2 12C1.99999 10.9459 6 8 6 8" />
              <path d="M18 8C18 8 22 10.946 22 12C22 13.0541 18 16 18 16" />
            </svg>
          }
          title="Yours to own"
          description="Source lands in your repo, edit freely."
        />
        <Benefit
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
            >
              <path d="M9.85267 4.8654L8.7579 8.69741C8.47317 9.69406 7.69412 10.4731 6.69747 10.7579L2.86538 11.8528C2.35315 11.9991 2 12.4673 2 13C2 13.5327 2.35315 14.0009 2.86538 14.1472L6.69747 15.2421C7.69412 15.5269 8.47317 16.3059 8.7579 17.3026L9.85267 21.1346C9.99902 21.6468 10.4672 22 10.9999 22C11.5327 22 12.0008 21.6469 12.1472 21.1347L13.2422 17.3025C13.527 16.3059 14.306 15.5269 15.3026 15.2421L19.1346 14.1473C19.6468 14.0009 20 13.5327 20 13C20 12.4673 19.6468 11.9991 19.1346 11.8527L15.3026 10.7579C14.306 10.4731 13.527 9.69411 13.2422 8.69753L12.1472 4.86535C12.0008 4.35313 11.5327 4 10.9999 4C10.4672 4 9.99902 4.35316 9.85267 4.8654Z" />
              <path d="M19.5 2.9375V4.5M19.5 4.5V6.0625M19.5 4.5H18.25M19.5 4.5H20.75M22 4.5L20.9156 4.13852C20.4179 3.97263 20.0274 3.58211 19.8615 3.08443L19.5 2L19.1385 3.08443C18.9726 3.58211 18.5821 3.97263 18.0844 4.13852L17 4.5L18.0844 4.86148C18.5821 5.02737 18.9726 5.41789 19.1385 5.91557L19.5 7L19.8615 5.91557C20.0274 5.41789 20.4179 5.02737 20.9156 4.86148L22 4.5Z" />
            </svg>
          }
          title="Agent-ready"
          description="Every doc has a Markdown version for agents."
        />
      </ul>
    </section>
  )
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <li className="screen-line-bottom flex gap-3 border-line p-4 sm:odd:border-r">
      <IconTile aria-hidden>{icon}</IconTile>
      <div className="flex-1 space-y-1">
        <h3 className="text-sm/6 font-medium">{title}</h3>
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  )
}
