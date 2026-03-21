import { ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ArticleItem } from "@/registry/blocks/blog-02/components/article-item"

export function Blog02() {
  return (
    <div className="max-w-screen overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <div className="border-x border-line">
          <h2 className="screen-line-top screen-line-bottom ml-4 font-heading text-4xl leading-snug font-medium tracking-tight md:text-5xl">
            Blog
          </h2>

          <p className="p-4 text-balance text-muted-foreground">
            A collection of articles on development, design, and ideas.
          </p>

          <div className="screen-line-top relative py-4">
            <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2 md:grid-cols-3">
              <div className="border-r border-line" />
              <div className="border-l border-line md:border-x" />
              <div className="border-l border-line max-md:hidden" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {articles.map((article) => (
                <ArticleItem
                  key={article.id}
                  url="#"
                  title={article.title}
                  coverUrl={article.coverUrl}
                  createdAt={article.createdAt}
                />
              ))}
            </div>
          </div>

          <div className="screen-line-top screen-line-bottom flex justify-center py-2">
            <Button className="gap-2 px-3" size="lg" asChild>
              <a href="#">
                View All
                <ChevronRightIcon />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type Article = {
  id: string
  title: string
  coverUrl: string
  createdAt: string
}

const articles: Article[] = [
  {
    id: "1",
    title:
      "Apple unveils iPhone 17 Pro: Aluminum frame returns, new colors, upgraded camera",
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/1.webp",
    createdAt: "2025-09-13",
  },
  {
    id: "2",
    title:
      'While the world is expecting AGI, François Chollet is showing just how "naive" AI can be',
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/2.webp",
    createdAt: "2025-04-21",
  },
  {
    id: "3",
    title:
      "Apple introduces iPhone 16e: A powerful new model for the iPhone 16 lineup",
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/3.webp",
    createdAt: "2025-02-20",
  },
  {
    id: "4",
    title:
      "Apple unveils MacBook Pro M4: Same design, base model now with 16GB RAM, priced from $1,599",
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/4.webp",
    createdAt: "2024-10-31",
  },
  {
    id: "5",
    title:
      "Apple unveils new Mac mini M4: Smaller, 16GB RAM on the base model, priced from $599",
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/5.webp",
    createdAt: "2024-10-31",
  },
  {
    id: "6",
    title:
      "Apple unveils iMac M4: Unchanged design, more powerful M4 chip, RAM starts at 16GB, priced from $1,299",
    coverUrl:
      "https://assets.chanhdai.com/registry/images/blocks/blog-01/6.webp",
    createdAt: "2024-10-29",
  },
]
