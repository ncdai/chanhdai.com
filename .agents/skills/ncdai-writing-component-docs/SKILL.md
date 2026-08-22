---
name: ncdai-writing-component-docs
description: Write and review component documentation (MDX) and registry descriptions. Covers doc structure, description writing, Features, Composition, Credits, and References sections. Use when creating new component docs, updating descriptions, adding Features sections, adding Composition sections, adding Credits sections, adding References sections, or reviewing component documentation quality.
---

# Writing component documentation

Guide for writing concise, consistent component documentation for this project's registry. Covers MDX doc structure, description writing, Features sections, Composition sections, Credits sections, and References sections.

## Key files

- Component docs: `src/features/doc/content/components/{component-name}.mdx`
- Registry items: `src/registry/components/_registry.ts`
- Description must be kept in sync between both files.
- The doc's category (`components`) is derived from the `components/` subfolder, not declared in frontmatter.

## MDX document structure

Component docs follow this section order. Only include sections that are relevant. Headings use sentence-case (capitalize only the first word and proper nouns); the fixed section names below already follow this, and any custom heading must too.

```
---
title: Component Name
description: One concise sentence about what the component does.
image: https://assets.chanhdai.com/images/blog/{component-name}.webp
createdAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD
---

<ComponentPreview name="{component-name}-demo" />

## Features            (optional -- skip if component is self-explanatory)

## Installation

## Usage

## Composition         (optional -- only for compound/composable components)

## API reference       (optional)

## Examples            (optional)

## Credits             (optional -- for inspiration/original sources)

## References          (optional -- for technical reading and implementation details)
```

## Writing descriptions

The `description` field appears in MDX frontmatter AND the registry item. Both must match.

### Rules

1. One short sentence -- focus on WHAT the component does, not HOW it is built.
2. Start with a verb or noun. Never start with "A", "An", or "A React component for...".
3. Drop implementation details like "built with Motion" or "using Tailwind CSS".
4. Keep it under ~80 characters when possible.

### Good examples

```
Toggle between system, light, and dark themes in Next.js apps.
Animated text that cycles through items with a smooth flip transition.
Interactive slider inspired by the classic iPhone "slide to unlock" gesture.
Scrolling marquee to showcase user testimonials.
Display install commands with package manager switcher and copy button.
Copy text to clipboard with visual feedback and animation.
```

### Bad examples

```
A React component for managing user consent for cookies and tracking in Next.js applications.
  --> Too long, starts with "A React component for..."

Animated text component that cycles through items with a smooth flip transition built with Motion for React.
  --> "component" is redundant, "built with Motion for React" is implementation detail

A sleek, interactive slider inspired by the classic iPhone OS "slide to unlock" gesture.
  --> Starts with "A sleek", subjective adjective
```

## Writing Features sections

### When to include

Add `## Features` when the component has non-obvious capabilities that the title, description, and preview alone cannot convey. Examples: multi-mode support, special interactions, keyboard navigation, persistence, composability.

### When to skip

Skip `## Features` when the component is self-explanatory through its title + description + preview + usage. Examples: Theme Switcher, Shimmering Text, Apple Hello Effect.

### Rules

1. Use exactly `## Features` as the heading (not "About", not "Overview").
2. Write 2-4 bullet points, one line each.
3. Start each bullet with the capability, not filler words.
4. End each bullet with a period.
5. No emoji.
6. Do not repeat information already in Installation, Usage, or API reference.
7. Describe WHAT the user gets, not HOW it is implemented. Do not name libraries, framework APIs, hooks, or internal data flow. A technical detail is worth keeping only when rephrased as a user-facing benefit (for example "caches results for a day" instead of "uses `unstable_cache` with `revalidate: 86400`").
8. Do not put attribution here. "Built on X" or "inspired by Y" belongs in `## Credits`; links that explain how something works belong in `## References`.

### Good example

```markdown
## Features

- Content fades in and out smoothly as you scroll.
- Supports both vertical and horizontal scrolling.
```

### Bad example

```markdown
## About

The Scroll Fade Effect component is built on top of CSS animation-timeline.

- 📱 Smooth scrolling fade effect
- 🎨 Customizable with Tailwind CSS
- ⚡️ Easy installation via shadcn CLI
```

Issues: wrong heading name, intro paragraph is unnecessary, emoji, "Easy installation" repeats Installation section.

### Bad example (implementation details)

```markdown
## Features

- Built on Kibo UI Contribution Graph for the calendar grid, legend, and yearly total.
- Uses Next.js `unstable_cache` with a one-day revalidation window, then passes a `Promise` into the client and resolves it with React `use()`
```

Issues: "Built on Kibo UI" is attribution and belongs in `## Credits`; the second bullet describes internal data flow instead of a capability, and is missing a trailing period. Rewritten as capabilities:

```markdown
## Features

- Shows a full year of daily activity with a color legend and total count.
- Caches fetched contributions for a day, so repeat visits do not hit the API.
```

## Writing Composition sections

### When to include

Add `## Composition` when the component uses a compound/composable pattern -- multiple sub-components that need to be assembled together in a specific tree structure. Examples: SlideToUnlock (track, handle, text), Testimonial (quote, author, avatar), GlowCardGrid (grid + cards).

### When to skip

Skip `## Composition` when the component is a single element used with props alone, not composed from sub-components. Examples: CopyButton, ShimmeringText, ThemeSwitcher, TextFlip, MiddleTruncation.

### Rules

1. Use exactly `## Composition` as the heading.
2. Place it immediately after `## Usage`.
3. Start with the line: `Use the following composition to build a \`{ComponentName}\`.`
4. Use a ` ```text ` fenced code block for the tree.
5. Draw the tree using box-drawing characters: `├──`, `└──`, `│`.
6. Show the full component hierarchy as it appears in the Usage JSX.
7. If the component wraps sub-components from another package, include them in the tree.

### Good example

<!-- prettier-ignore -->
````markdown
## Composition

Use the following composition to build a `SlideToUnlock`

\```text
SlideToUnlock
└── SlideToUnlockTrack
    ├── SlideToUnlockText
    │   └── ShimmeringText
    └── SlideToUnlockHandle
\```
````

### Another example (deeper nesting)

<!-- prettier-ignore -->
````markdown
## Composition

Use the following composition to build a `Testimonial`

\```text
Testimonial
├── TestimonialQuote
└── TestimonialAuthor
    ├── TestimonialAvatar
    │   ├── TestimonialAvatarImg
    │   └── TestimonialAvatarRing
    ├── TestimonialAuthorName
    │   └── TestimonialVerifiedBadge
    └── TestimonialAuthorTagline
\```
````

## Credits vs References

Use this quick intent check before placing a link:

- Put a link in `## Credits` when it answers: "Who inspired this component?" or "What original source/product is this derived from?"
- Put a link in `## References` when it answers: "How does this work?" or "Where can I learn implementation details/API?"
- If one link can fit both, prefer `## Credits`. Keep `Credits` minimal and place explanatory context in `## References` only when needed.
- Skip generic links that do not help readers build, understand, or trace origin.

## Writing Credits sections

### When to include

Add `## Credits` when the component is inspired by, derived from, or adapted from an original source the reader should be able to trace. Examples: original demo/tweet, source product interaction, canonical inspiration.

### When to skip

Skip `## Credits` when there is no meaningful inspiration or origin worth acknowledging.

### Rules

1. Use exactly `## Credits` as the heading (not "Attribution", not "Thanks", not "Resources").
2. Place it near the end, before `## References`.
3. Bullet list of markdown links, one item per line.
4. Keep the list short (typically 1-5 items). Every link must add value.
5. Credit the original creator whenever possible.
6. No emoji.
7. Each item must display only the author name/handle, but the URL must point to the exact original source.

### Item formats

Use author-centric display text with source URLs:

| Format                        | Use For                                          |
| ----------------------------- | ------------------------------------------------ |
| `- [@handle](source-url)`     | Display handle, open the exact source link.      |
| `- [Author Name](source-url)` | Display author name, open the exact source link. |

### Good examples

```markdown
## Credits

- [@jh3yy](https://x.com/jh3yy)
- [Josh Puckett](https://joshpuckett.me/dialkit)
```

```markdown
## Credits

- [@rds_agi](https://x.com/rds_agi)
- [Apple](https://www.figma.com/community/file/1414773009964314315/official-apple-hello-lettering)
```

### Bad examples

```markdown
## Credits

- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
```

Issue: this is technical implementation reading, so it belongs in `## References`, not `## Credits`. It is also not an author label.

```markdown
## Credits

Thanks to everyone who inspired this component! ❤️

- [Original glow effect demo by @jh3yy](https://x.com/jh3yy/status/1992003440579662211)
```

Issues: narrative intro is unnecessary, emoji is not allowed, and item should be author-only text with the source URL (for example `[@jh3yy](https://x.com/jh3yy/status/1618297458752368640)`).

## Writing References sections

### When to include

Add `## References` for technical reading that helps readers implement, understand, or extend the component. Examples: library APIs, web platform docs, implementation articles, related primitives used by the component.

### When to skip

Skip `## References` when there are no high-value technical links beyond obvious generic docs.

### Rules

1. Use exactly `## References` as the heading (not "Resources", not "See Also").
2. Place it as the LAST section in the doc.
3. Bullet list of markdown links, one item per line.
4. Keep the list short (typically 1-5 items). Every link must add value.
5. Focus on technical/implementation value, not attribution.
6. No emoji.

### Item formats

Pick the format that matches the kind of link:

| Format                           | Use For                                                |
| -------------------------------- | ------------------------------------------------------ |
| `- [Title](url)`                 | Library docs, related component docs, web APIs.        |
| `- [Title](url) — short context` | Clarify why this reference matters for this component. |

### Good examples

```markdown
## References

- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Motion Layout Animations](https://motion.dev/docs/react-layout-animations) — layout transition behavior
```

```markdown
## References

- [Radix Select](https://www.radix-ui.com/primitives/docs/components/select)
- [shadcn/ui Select](https://ui.shadcn.com/docs/components/select)
```

### Bad examples

```markdown
## References

- [Original glow effect demo by @jh3yy](https://x.com/jh3yy/status/1992003440579662211)
```

Issue: this is attribution/inspiration, so it belongs in `## Credits`.

```markdown
## References

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
```

Issue: generic links with low signal; add only references with specific relevance.

## Registry item format

Each component in `src/registry/components/_registry.ts` must have a `description` field matching the MDX frontmatter:

```typescript
{
  name: "component-name",
  type: "registry:component",
  description: "Same one-sentence description as MDX frontmatter.",
  title: "Component Name",
  author: "ncdai <dai@chanhdai.com>",
  // ...
}
```

## Sync checklist

When creating or updating a component doc:

1. Write a concise description following the rules above.
2. Set the same description in both MDX frontmatter and registry item.
3. Decide whether `## Features` is needed (non-obvious capabilities).
4. If adding Features, write 2-4 bullet points following the rules.
5. Decide whether `## Composition` is needed (compound/composable components).
6. If adding Composition, draw the tree matching the Usage JSX structure.
7. Decide whether `## Credits` is needed (inspiration/original sources worth acknowledging).
8. If adding Credits, use only author name/handle as link text, and always point to the exact source URL.
9. Decide whether `## References` is needed (technical links that help implementation and deeper learning).
10. If adding References, keep links technical, specific, and high-value.
11. Verify section order: Preview -> Features -> Installation -> Usage -> Composition -> API reference -> Examples -> Credits -> References.
