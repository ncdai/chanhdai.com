export type Certification = {
  title: string
  issuer: string
  /**
   * Issuer logo to display (takes precedence over `issuerIconName`).
   * Provide an absolute URL or a path under /public.
   */
  issuerLogoURL?: string
  /**
   * Icon key for the issuer when no `issuerLogoURL` is provided.
   * Must match a supported icon name (e.g., "vercel", "coursera", "meta", "google", "microsoft", "accenture").
   */
  issuerIconName?: string
  /**
   * Issue date in ISO format (YYYY-MM-DD). Parsed and formatted in the UI via Day.js.
   */
  issueDate: string
  /**
   * Certificate or credential identifier; leave empty if not applicable.
   */
  credentialID: string
  /**
   * Public verification URL or link to the certificate document. Used as the anchor href.
   */
  credentialURL: string
}
