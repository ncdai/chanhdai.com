import { remarkHeading } from "fumadocs-core/mdx-plugins/remark-heading"
import type { MDXRemoteProps } from "next-mdx-remote/rsc"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger,
} from "@/components/base/ui/tabs"
import { CodeCollapsibleWrapper } from "@/components/code-collapsible-wrapper"
import { ComponentSource } from "@/components/component-source"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Code, Heading } from "@/components/ui/typography"
import { UTM_PARAMS } from "@/config/site"
import { DocSponsors } from "@/features/doc/components/doc-sponsors"
import { generator } from "@/lib/auto-type-table"
import { rehypeAddQueryParams } from "@/lib/rehype-add-query-params"
import {
  rehypeCodeRawString,
  rehypeHighlightCode,
  rehypeHighlightCodeRawString,
} from "@/lib/rehype-code-block"
import { rehypeComponent } from "@/lib/rehype-component"
import { rehypeNpmCommand } from "@/lib/rehype-npm-command"
import { remarkCodeImport } from "@/lib/remark-code-import"
import { cn } from "@/lib/utils"
import { AutoTypeTable } from "@/registry/components/auto-type-table"

import { Callout } from "./callout"
import { CodeTabs } from "./code-tabs"
import { ComponentPreview } from "./component-preview"
import { FramedImage, IframeEmbed, YouTubeEmbed } from "./embed"
import { mdxCodeBlockComponents } from "./mdx-code-block"
import { Testimonial } from "./testimonial"

const components: MDXRemoteProps["components"] = {
  h1: (props: React.ComponentProps<"h1">) => <Heading as="h1" {...props} />,
  h2: (props: React.ComponentProps<"h2">) => <Heading as="h2" {...props} />,
  h3: (props: React.ComponentProps<"h3">) => <Heading as="h3" {...props} />,
  h4: (props: React.ComponentProps<"h4">) => <Heading as="h4" {...props} />,
  h5: (props: React.ComponentProps<"h5">) => <Heading as="h5" {...props} />,
  h6: (props: React.ComponentProps<"h6">) => <Heading as="h6" {...props} />,
  table: Table,
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  ...mdxCodeBlockComponents,
  code: Code,
  ComponentPreview,
  ComponentSource,
  CodeCollapsibleWrapper,
  CodeTabs,
  Callout,
  Steps: ({ className, ...props }: React.ComponentProps<"div">) => (
    <div
      className={cn(
        "relative md:ml-3 md:pl-7 prose-h3:text-base",
        "before:pointer-events-none before:absolute before:top-0 before:left-0 before:hidden before:h-full before:w-px before:-translate-x-1/2 before:bg-line before:md:flex",
        className
      )}
      {...props}
    />
  ),
  Step: ({ className, ...props }: React.ComponentProps<"h3">) => (
    <h3 className={cn("step font-medium", className)} {...props} />
  ),
  Tabs,
  TabsList,
  TabsIndicator,
  TabsTrigger,
  TabsContent,
  TabsListInstallType: () => (
    <TabsList>
      <TabsTrigger value="cli">Command</TabsTrigger>
      <TabsTrigger value="manual">Manual</TabsTrigger>
      <TabsIndicator />
    </TabsList>
  ),
  YouTubeEmbed,
  IframeEmbed,
  FramedImage,
  Testimonial,
  DocSponsors,
  AutoTypeTable: (props) => <AutoTypeTable {...props} generator={generator} />,
}

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkCodeImport, remarkHeading],
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "nofollow noopener" }],
      rehypeSlug,
      rehypeComponent,
      rehypeCodeRawString,
      rehypeHighlightCode,
      rehypeHighlightCodeRawString,
      rehypeNpmCommand,
      [rehypeAddQueryParams, UTM_PARAMS],
    ],
  },
}

export function MDX({ code }: { code: string }) {
  return <MDXRemote source={code} components={components} options={options} />
}
