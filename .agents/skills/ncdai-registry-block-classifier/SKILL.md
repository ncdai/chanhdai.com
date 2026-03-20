---
name: ncdai-registry-block-classifier
description: Classify blocks into appropriate categories (Marketing, Content, Application) and write concise, descriptive block descriptions. Use when creating new blocks, updating block metadata, or organizing the blocks registry.
---

# Registry Block Classifier

Guide for categorizing blocks and writing effective descriptions in the shadcn blocks registry.

## Block Category System

The registry uses a **two-level categorization** approach:

| Category        | Purpose                                          | Examples                 |
| --------------- | ------------------------------------------------ | ------------------------ |
| **marketing**   | Landing pages, hero sections, testimonials, CTAs | hero-01, testimonials-01 |
| **content**     | Blog layouts, article pages, documentation       | blog-01, blog-02         |
| **application** | Dashboards, login/signup, app layouts, sidebars  | login-01, dashboard-01   |

### Categorization Pattern

Use dual categories: `[main-category, specific-type]`

```typescript
// Example
categories: ["marketing", "hero"]
categories: ["content", "blog"]
categories: ["application", "login"]
```

## Classification Decision Tree

When classifying a new block, ask:

**1. Is it public-facing marketing/landing content?**

- Hero sections → `["marketing", "hero"]`
- Testimonials → `["marketing", "testimonials"]`
- CTA sections → `["marketing", "cta"]`
- Pricing tables → `["marketing", "pricing"]`

**2. Is it content/editorial focused?**

- Blog listings → `["content", "blog"]`
- Article pages → `["content", "article"]`
- Documentation → `["content", "docs"]`

**3. Is it application/internal UI?**

- Login/signup → `["application", "login"]` / `["application", "signup"]`
- Dashboards → `["application", "dashboard"]`
- Sidebars → `["application", "sidebar"]`
- Settings pages → `["application", "settings"]`

**Edge cases:**

- Portfolio project showcases → Use primary purpose (marketing if showcasing work for clients, content if blog-style projects)
- E-commerce (future) → New category `["ecommerce", "product"]` when > 5 ecommerce blocks exist

## Writing Block Descriptions

### Description Formula

**Pattern:** `A [type] [with/featuring] [key distinguishing feature].`

### Examples

**Good descriptions:**

```typescript
"A hero section with a golden spiral background."
"A blog section with a grid layout."
"A blog section with a lined grid layout."
"A login form with social auth buttons."
"A testimonials section with dual marquees."
```

**Bad descriptions:**

```typescript
"Hero section" // Too generic
"A beautiful hero section that will make your landing page look amazing" // Too marketing-y
"This is a hero section component that you can use on your website" // Obvious and verbose
```

### Description Guidelines

1. **Be specific** - Mention the key visual/functional feature that differentiates it
2. **Be concise** - One sentence, ~5-15 words
3. **Start with article** - "A hero section..." not "Hero section..."
4. **Focus on "what"** - Describe what it is, not what it does or why to use it
5. **Avoid superlatives** - No "beautiful", "amazing", "perfect"

## Workflow

When creating or updating a block:

### Step 1: Analyze the block

- What is the primary purpose?
- What is the key distinguishing visual/functional feature?
- Where would users typically use this?

### Step 2: Assign categories

- Main category: marketing, content, or application
- Specific type: hero, blog, login, testimonials, etc.

### Step 3: Write description

- Use the formula: "A [type] [with/featuring] [distinguishing feature]."
- Keep it under 15 words
- Avoid marketing language

### Step 4: Update registry

```typescript
{
  name: "block-name",
  title: "Block Name",
  description: "A [type] with [feature].",
  categories: ["main-category", "specific-type"],
  // ... rest of config
}
```

### Step 5: Rebuild registry

```bash
pnpm registry:build
```

## Category Evolution

**When to add new main categories:**

- When > 10 blocks would fit the new category
- When existing categories become too broad
- When clear semantic gap exists

**Future category candidates:**

- `ecommerce` - When building product pages, cart, checkout
- `dashboard` - If application blocks split (> 15+ app blocks)

**Don't create categories for:**

- Single blocks or edge cases
- Overlapping purposes (use existing categories)
- Too-specific niches (use sub-categories instead)

## Registry Files Reference

| File                               | Purpose              | Edit?                   |
| ---------------------------------- | -------------------- | ----------------------- |
| `src/registry/blocks/_registry.ts` | Block definitions    | ✅ Yes                  |
| `src/config/registry.ts`           | Category definitions | ✅ Yes                  |
| `src/__registry__/*.json`          | Auto-generated       | ❌ No - rebuild instead |
| `public/r/*.json`                  | Auto-generated       | ❌ No - rebuild instead |

After updating registry definitions, always run `pnpm registry:build`.
