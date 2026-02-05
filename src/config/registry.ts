export const registryConfig = {
  /**
   * Registry namespace identifier for shadcn CLI
   * @example "@ncdai" - Users can install components with: `npx shadcn add @ncdai/wheel-picker`
   * @see https://ui.shadcn.com/docs/registry/namespace#overview
   */
  namespace: process.env.REGISTRY_NAMESPACE || "@ncdai",
  /**
   * URL pattern for resolving namespaced components
   * The {name} placeholder will be replaced with the component name
   * @example "https://chanhdai.com/r/{name}.json" resolves to "https://chanhdai.com/r/wheel-picker.json"
   * This tells shadcn CLI where to fetch component definitions when installing with namespace prefix
   * @see https://ui.shadcn.com/docs/registry/namespace#url-pattern-system
   */
  namespaceUrl:
    process.env.REGISTRY_NAMESPACE_URL || "https://chanhdai.com/r/{name}.json",
}
