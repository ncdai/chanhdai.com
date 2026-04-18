---
name: ncdai-writing-component-docs
description: Write and review component documentation (MDX) and registry descriptions. Covers doc structure, description writing, Features, Composition, and References sections. Use when creating new component docs, updating descriptions, adding Features sections, adding Composition sections, adding References sections, or reviewing component documentation quality.
---

# Writing Component Documentation

Guide for writing concise, consistent component documentation for this project's registry. Covers MDX doc structure, description writing, Features sections, Composition sections, and References sections.

## Key Files

- Component docs: `src/features/doc/content/{component-name}.mdx`
- Registry items: `src/registry/components/_registry.ts`
- Description must be kept in sync between both files.

## MDX Document Structure

Component docs follow this section order. Only include sections that are relevant.

```
---
title: Component Name
description: One concise sentence about what the component does.
image: https://assets.chanhdai.com/images/blog/{component-name}.webp
category: components
createdAt: YYYY-MM-DD
updatedAt: YYYY-MM-DD
---

<ComponentPreview name="{component-name}-demo" />

## Features            (optional -- skip if component is self-explanatory)

## Installation

## Usage

## Composition         (optional -- only for compound/composable components)

## API Reference       (optional)

## Examples            (optional)

## References          (optional)
```

## Writing Descriptions

The `description` field appears in MDX frontmatter AND the registry item. Both must match.

### Rules

1. One short sentence -- focus on WHAT the component does, not HOW it is built.
2. Start with a verb or noun. Never start with "A", "An", or "A React component for...".
3. Drop implementation details like "built with Motion" or "using Tailwind CSS".
4. Keep it under ~80 characters when possible.

### Good Examples

```
Toggle between system, light, and dark themes in Next.js apps.
Animated text that cycles through items with a smooth flip transition.
Interactive slider inspired by the classic iPhone "slide to unlock" gesture.
Scrolling marquee to showcase user testimonials.
Display install commands with package manager switcher and copy button.
Copy text to clipboard with visual feedback and animation.
```

### Bad Examples

```
A React component for managing user consent for cookies and tracking in Next.js applications.
  --> Too long, starts with "A React component for..."

Animated text component that cycles through items with a smooth flip transition built with Motion for React.
  --> "component" is redundant, "built with Motion for React" is implementation detail

A sleek, interactive slider inspired by the classic iPhone OS "slide to unlock" gesture.
  --> Starts with "A sleek", subjective adjective
```

## Writing Features Sections

### When to Include

Add `## Features` when the component has non-obvious capabilities that the title, description, and preview alone cannot convey. Examples: multi-mode support, special interactions, keyboard navigation, persistence, composability.

### When to Skip

Skip `## Features` when the component is self-explanatory through its title + description + preview + usage. Examples: Theme Switcher, Shimmering Text, Apple Hello Effect.

### Rules

1. Use exactly `## Features` as the heading (not "About", not "Overview").
2. Write 2-4 bullet points, one line each.
3. Start each bullet with the capability, not filler words.
4. End each bullet with a period.
5. No emoji.
6. Do not repeat information already in Installation, Usage, or API Reference.

### Good Example

```markdown
## Features

- Content fades in and out smoothly as you scroll.
- Supports both vertical and horizontal scrolling.
```

### Bad Example

```markdown
## About

The Scroll Fade Effect component is built on top of CSS animation-timeline.

- 📱 Smooth scrolling fade effect
- 🎨 Customizable with Tailwind CSS
- ⚡️ Easy installation via shadcn CLI
```

Issues: wrong heading name, intro paragraph is unnecessary, emoji, "Easy installation" repeats Installation section.

## Writing Composition Sections

### When to Include

Add `## Composition` when the component uses a compound/composable pattern -- multiple sub-components that need to be assembled together in a specific tree structure. Examples: SlideToUnlock (track, handle, text), Testimonial (quote, author, avatar), GlowCardGrid (grid + cards).

### When to Skip

Skip `## Composition` when the component is a single element used with props alone, not composed from sub-components. Examples: CopyButton, ShimmeringText, ThemeSwitcher, TextFlip, MiddleTruncation.

### Rules

1. Use exactly `## Composition` as the heading.
2. Place it immediately after `## Usage`.
3. Start with the line: `Use the following composition to build a \`{ComponentName}\`.`
4. Use a ` ```text ` fenced code block for the tree.
5. Draw the tree using box-drawing characters: `├──`, `└──`, `│`.
6. Show the full component hierarchy as it appears in the Usage JSX.
7. If the component wraps sub-components from another package, include them in the tree.

### Good Example

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

### Another Example (deeper nesting)

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

## Writing References Sections

### When to Include

Add `## References` when the component is inspired by, derived from, or relies on external sources that the reader would benefit from visiting. Examples: original demo or tweet that inspired the component, design course or article, underlying library docs, web platform APIs the component depends on, related shadcn/ui components.

### When to Skip

Skip `## References` when the component is fully self-contained and was not derived from any external source worth crediting. Do not pad with generic links (e.g., do not link to React docs or generic Tailwind docs).

### Rules

1. Use exactly `## References` as the heading (not "Credits", not "Resources", not "See Also").
2. Place it as the LAST section in the doc.
3. Bullet list of markdown links, one item per line.
4. Keep the list short (typically 1-5 items). Every link must add value.
5. Always credit the original creator when the component is inspired by someone else's work.
6. No emoji.

### Item Formats

Pick the format that matches the kind of link:

| Format                                              | Use For                                                 |
| --------------------------------------------------- | ------------------------------------------------------- |
| `- [Title](url)`                                    | Plain reference (docs, related component, web API).     |
| `- [Title](url) by [Author](url-or-handle)`         | Original work credit (designer, engineer, demo author). |
| `- [Title](url) — short context`                    | When the title alone does not convey what it is.        |
| `- [Title](url) by [@handle](https://x.com/handle)` | Crediting via social handle.                            |

### Good Examples

```markdown
## References

- [Original glow effect demo by @jh3yy](https://x.com/jh3yy/status/1992003440579662211)
- [DialKit](https://joshpuckett.me/dialkit)
```

```markdown
## References

- [theme-toggle.rdsx.dev](https://theme-toggle.rdsx.dev) by [@rds_agi](https://x.com/rds_agi)
- [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
```

```markdown
## References

- [Slider in DialKit](https://joshpuckett.me/dialkit) by [Josh Puckett](https://joshpuckett.me)
- [Creating a Slider Component](https://www.interfacecraft.dev) — Interface Craft course by Josh Puckett
```

### Bad Examples

```markdown
## Credits

Thanks to everyone who inspired this component! ❤️

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
```

Issues: wrong heading name, narrative intro, emoji, raw URLs instead of markdown links, generic links that add no value (every React component depends on React).

```markdown
## References

- https://x.com/jh3yy/status/1992003440579662211
```

Issue: raw URL with no title or author credit. Reader cannot tell what they are clicking.

## Registry Item Format

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

## Sync Checklist

When creating or updating a component doc:

1. Write a concise description following the rules above.
2. Set the same description in both MDX frontmatter and registry item.
3. Decide whether `## Features` is needed (non-obvious capabilities).
4. If adding Features, write 2-4 bullet points following the rules.
5. Decide whether `## Composition` is needed (compound/composable components).
6. If adding Composition, draw the tree matching the Usage JSX structure.
7. Decide whether `## References` is needed (external sources worth crediting).
8. If adding References, credit original authors and use the correct item format.
9. Verify section order: Preview -> Features -> Installation -> Usage -> Composition -> API Reference -> Examples -> References.
