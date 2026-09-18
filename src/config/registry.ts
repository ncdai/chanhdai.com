export const registryConfig = {
  /**
   * Registry namespace identifier for shadcn CLI
   * @example "@ncdai" - Users can install components with: `npx shadcn add @ncdai/wheel-picker`
   * @see https://ui.shadcn.com/docs/registry/namespace#overview
   */
  namespace: process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE || "@ncdai",
  /**
   * URL pattern for resolving namespaced components
   * The {name} placeholder will be replaced with the component name
   * @example "https://chanhdai.com/r/{name}.json" resolves to "https://chanhdai.com/r/wheel-picker.json"
   * This tells shadcn CLI where to fetch component definitions when installing with namespace prefix
   * @see https://ui.shadcn.com/docs/registry/namespace#url-pattern-system
   */
  namespaceUrl:
    process.env.NEXT_PUBLIC_REGISTRY_NAMESPACE_URL ||
    "https://chanhdai.com/r/{name}.json",
}

export const componentCategories = [
  {
    name: "text-effects",
    title: "Text Effects",
    description:
      "Applies complex visual animations, artistic styling, and interactive micro-interactions explicitly to textual content to create focal points.",
  },
  {
    name: "typography",
    title: "Typography",
    description:
      "Handles fundamental text formatting, legibility optimization, inline structural modifications, and string manipulation without heavy visual animations.",
  },
  {
    name: "effects",
    title: "Effects",
    description:
      "Encompasses generalized visual enhancements, micro-interactions, background decorations, and state transitions that elevate high-fidelity aesthetics.",
  },
  {
    name: "illustrations",
    title: "Illustrations",
    description:
      "Detailed objects and scenes drawn in code that add character to a page, often with playful interactions that bring the artwork to life.",
  },
  {
    name: "controls",
    title: "Controls",
    description:
      "Interactive UI elements designed to capture user input, manipulate system states, and provide physical-feeling mechanical adjustments.",
  },
  {
    name: "menus",
    title: "Menus",
    description:
      "Transient, overlay-based interfaces that present a localized list of commands, contextual actions, or supplementary options upon user interaction.",
  },
  {
    name: "navigation",
    title: "Navigation",
    description:
      "Structural elements dedicated to wayfinding, enabling users to orient themselves and traverse across different views, sections, or documents.",
  },
  {
    name: "marketing",
    title: "Marketing",
    description:
      "Pre-composed UI blocks and sections optimized for landing pages to surface social proof, build trust, and present promotional content.",
  },
  {
    name: "data-display",
    title: "Data Display",
    description:
      "Components engineered to visually render quantitative metrics, format structured technical information, and present datasets for analytical consumption.",
  },
  {
    name: "utilities",
    title: "Utilities",
    description:
      "Functional helpers and often invisible wrappers that provide underlying system capabilities, sensory user feedback, or abstract business logic.",
  },
]

export const blockCategories = [
  {
    name: "marketing",
    title: "Marketing",
    description:
      "Landing pages, sections, blog templates, and high-converting testimonial blocks.",
  },
  {
    name: "application",
    title: "Application",
    description:
      "Dashboard layouts, metric cards, settings pages, and core web app interfaces.",
  },
  {
    name: "ecommerce",
    title: "Ecommerce",
    description:
      "Product grids, shopping carts, filters, and streamlined checkout components.",
  },
]
