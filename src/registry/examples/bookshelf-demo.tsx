import { cn } from "@/lib/utils"
import {
  Bookshelf,
  BookshelfCover,
  BookshelfItem,
  BookshelfSpine,
  BookshelfTrigger,
} from "@/registry/components/bookshelf"

const SPINE_WIDTH = 40
// Cover width follows height so short and tall books keep a real book's proportions
const COVER_RATIO = 0.7

type Book = {
  title: string
  authors: string[]
  height: number
  className: string
  titleClassName: string
}

const BOOKS: Book[] = [
  {
    title: "The Pragmatic Programmer",
    authors: ["Andrew Hunt", "David Thomas"],
    height: 240,
    className: "bg-emerald-600 text-white",
    titleClassName: "text-white",
  },
  {
    title: "Clean Code",
    authors: ["Robert C. Martin"],
    height: 228,
    className: "bg-sky-500 text-white",
    titleClassName: "text-white",
  },
  {
    title: "Refactoring",
    authors: ["Martin Fowler", "with contributions by Kent Beck"],
    height: 248,
    className: "bg-orange-500 text-white",
    titleClassName: "text-white",
  },
  {
    title: "Design Patterns",
    authors: ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"],
    height: 256,
    className: "bg-amber-400 text-amber-950",
    titleClassName: "text-black",
  },
  {
    title: "Structure and Interpretation of Computer Programs",
    authors: ["Harold Abelson", "Gerald Jay Sussman", "with Julie Sussman"],
    height: 264,
    className: "bg-violet-500 text-white",
    titleClassName: "text-white",
  },
  {
    title: "The C Programming Language",
    authors: ["Brian W. Kernighan", "Dennis M. Ritchie"],
    height: 216,
    className: "bg-rose-500 text-white",
    titleClassName: "text-white",
  },
  {
    title: "Code Complete",
    authors: ["Steve McConnell"],
    height: 244,
    className: "bg-teal-400 text-teal-950",
    titleClassName: "text-black",
  },
  {
    title: "The Mythical Man-Month",
    authors: ["Frederick P. Brooks Jr."],
    height: 208,
    className: "bg-indigo-500 text-white",
    titleClassName: "text-white",
  },
  {
    title: "Designing Data-Intensive Applications",
    authors: ["Martin Kleppmann"],
    height: 260,
    className: "bg-lime-400 text-lime-950",
    titleClassName: "text-black",
  },
]

export default function BookshelfDemo() {
  return (
    <Bookshelf className="border-b-4 border-foreground/80 px-1">
      {BOOKS.map((book) => (
        <BookshelfItem
          key={book.title}
          value={book.title}
          spineWidth={SPINE_WIDTH}
          coverWidth={Math.round(book.height * COVER_RATIO)}
          style={{ height: book.height }}
        >
          <BookshelfTrigger>
            <BookshelfSpine
              className={cn(
                "flex items-center justify-center border border-black/20 px-1 py-3",
                book.className
              )}
            >
              <span className="max-h-full text-center font-serif text-xs/tight text-balance [writing-mode:vertical-rl]">
                {book.title}
              </span>
              {/* Darkens as the spine turns away */}
              <span
                aria-hidden
                className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-out in-data-open:opacity-45"
              />
            </BookshelfSpine>

            <BookshelfCover
              className={cn(
                "flex flex-col justify-between border border-black/20 p-4 text-left",
                book.className
              )}
            >
              <span
                className={cn(
                  "font-serif text-lg/tight text-balance",
                  book.titleClassName
                )}
              >
                {book.title}
              </span>
              <span className="flex flex-col text-xs opacity-80">
                {book.authors.map((author) => (
                  <span key={author} className="text-pretty">
                    {author}
                  </span>
                ))}
              </span>
              {/* Brightens as the cover turns to face the viewer */}
              <span
                aria-hidden
                className="absolute inset-0 bg-black opacity-60 transition-opacity duration-300 ease-out in-data-open:opacity-0"
              />
            </BookshelfCover>
          </BookshelfTrigger>
        </BookshelfItem>
      ))}
    </Bookshelf>
  )
}
