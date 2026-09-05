import type { Route } from "next"

import { DocGrid, DocLeftCol } from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import { getComponentDocs } from "@/features/doc/data/documents"

import { Sidebar, SidebarContent } from "./sidebar"

export default function ComponentDocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const componentDocs = getComponentDocs()
    .slice()
    .sort((a, b) =>
      a.metadata.title.localeCompare(b.metadata.title, "en", {
        sensitivity: "base",
      })
    )

  return (
    <DocPageRoot>
      <DocGrid>
        <DocLeftCol className="-translate-x-1 pb-3.75">
          <Sidebar>
            <SidebarContent
              items={componentDocs.map((doc) => ({
                title: doc.metadata.title,
                href: `/components/${doc.slug}` as Route,
                isNew: doc.metadata.new,
              }))}
            />
          </Sidebar>
        </DocLeftCol>

        {children}
      </DocGrid>
    </DocPageRoot>
  )
}
