# Block Classification Examples

Real-world examples of block classifications from the registry.

## Marketing Category

### Hero Sections

```typescript
{
  name: "hero-01",
  title: "Hero 01",
  description: "A hero section with a golden spiral background.",
  categories: ["marketing", "hero"],
}
```

**Why Marketing?** Hero sections are the first thing visitors see on landing pages, designed to capture attention and drive conversions.

**Why this description?** Identifies the distinguishing visual feature (golden spiral background) that sets it apart from other hero sections.

### Testimonials

```typescript
{
  name: "testimonials-01",
  title: "Testimonials 01",
  description: "A testimonials section with dual marquees.",
  categories: ["marketing", "testimonials"],
}
```

**Why Marketing?** Testimonials are social proof elements used in marketing pages to build trust and credibility.

**Why this description?** The dual marquee animation is the key differentiator from standard testimonial layouts.

### Future Marketing Examples

```typescript
// CTA Section
{
  name: "cta-01",
  title: "CTA 01",
  description: "A centered call-to-action with gradient background.",
  categories: ["marketing", "cta"],
}

// Pricing Table
{
  name: "pricing-01",
  title: "Pricing 01",
  description: "A three-tier pricing table with feature comparison.",
  categories: ["marketing", "pricing"],
}

// Feature Grid
{
  name: "features-01",
  title: "Features 01",
  description: "A feature grid with animated icons.",
  categories: ["marketing", "features"],
}
```

## Content Category

### Blog Layouts

```typescript
{
  name: "blog-01",
  title: "Blog 01",
  description: "A blog section with a grid layout.",
  categories: ["content", "blog"],
}

{
  name: "blog-02",
  title: "Blog 02",
  description: "A blog section with a lined grid layout.",
  categories: ["content", "blog"],
}
```

**Why Content?** Blog listings are content-focused pages for editorial/informational purposes, not marketing conversions.

**Why these descriptions?** Each description highlights the layout pattern that differentiates them (standard grid vs. lined grid).

### Future Content Examples

```typescript
// Article Page
{
  name: "article-01",
  title: "Article 01",
  description: "A single-column article layout with table of contents.",
  categories: ["content", "article"],
}

// Documentation
{
  name: "docs-01",
  title: "Docs 01",
  description: "A documentation page with sidebar navigation.",
  categories: ["content", "docs"],
}

// Portfolio/Projects (content-focused)
{
  name: "projects-01",
  title: "Projects 01",
  description: "A project showcase with filterable grid.",
  categories: ["content", "projects"],
}
```

## Application Category

### Authentication

```typescript
{
  name: "login-01",
  title: "Login 01",
  description: "A simple login form.",
  categories: ["application", "login"],
}

// Future variations
{
  name: "login-02",
  title: "Login 02",
  description: "A login form with social auth buttons.",
  categories: ["application", "login"],
}

{
  name: "signup-01",
  title: "Signup 01",
  description: "A multi-step signup form.",
  categories: ["application", "signup"],
}
```

**Why Application?** Authentication flows are internal app functionality, not public marketing pages.

### Future Application Examples

```typescript
// Dashboard
{
  name: "dashboard-01",
  title: "Dashboard 01",
  description: "A dashboard with sidebar, charts and data table.",
  categories: ["application", "dashboard"],
}

// Sidebar Navigation
{
  name: "sidebar-01",
  title: "Sidebar 01",
  description: "A collapsible sidebar with nested navigation.",
  categories: ["application", "sidebar"],
}

// Settings Page
{
  name: "settings-01",
  title: "Settings 01",
  description: "A settings page with tabbed sections.",
  categories: ["application", "settings"],
}

// User Profile
{
  name: "profile-01",
  title: "Profile 01",
  description: "A user profile page with avatar and bio.",
  categories: ["application", "profile"],
}
```

## Edge Cases & Decision Making

### Case 1: Portfolio/Showcase Content

**Scenario:** A projects showcase page

**Decision factors:**

- **If marketing-focused** (promoting your services): `["marketing", "portfolio"]`
- **If content-focused** (case studies/blog-style): `["content", "projects"]`

**Example:**

```typescript
// Marketing: Designed to convert visitors into clients
{
  name: "portfolio-01",
  description: "A portfolio grid with hover effects and CTAs.",
  categories: ["marketing", "portfolio"],
}

// Content: Detailed case studies for learning/sharing
{
  name: "case-studies-01",
  description: "A case study layout with problem-solution format.",
  categories: ["content", "case-studies"],
}
```

### Case 2: About/Team Pages

**Decision:** Depends on purpose

- Marketing-focused (selling your team) → `["marketing", "about"]`
- Content-focused (company blog) → `["content", "about"]`

### Case 3: Contact Forms

**Decision:** Almost always Marketing

- `["marketing", "contact"]` - Used to generate leads

## Description Anti-Patterns

### ❌ Too Generic

```typescript
description: "A hero section." // What makes it unique?
description: "Login form." // Missing article "A"
```

### ❌ Too Verbose

```typescript
description: "This is a beautiful hero section that you can use on your landing page to capture attention and drive conversions." // Way too long
```

### ❌ Marketing Language

```typescript
description: "A stunning hero section." // Avoid superlatives
description: "The perfect blog layout." // Avoid "perfect"
```

### ❌ Implementation Details

```typescript
description: "A hero section built with Tailwind and Framer Motion." // Focus on visual features, not tech
```

### ✅ Good Examples

```typescript
description: "A hero section with video background."
description: "A blog layout with featured post carousel."
description: "A login form with password strength meter."
```

## Checklist for New Blocks

Before finalizing a new block:

- [ ] **Name follows pattern**: `type-##` (e.g., hero-01, blog-03)
- [ ] **Main category assigned**: marketing, content, or application
- [ ] **Specific sub-category assigned**: hero, blog, login, etc.
- [ ] **Description is concise**: ~5-15 words
- [ ] **Description starts with "A"**
- [ ] **Description highlights key feature**: What makes it unique?
- [ ] **No superlatives or marketing language**
- [ ] **Registry rebuilt**: `pnpm registry:build` executed
