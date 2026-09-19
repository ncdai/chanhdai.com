export type Certification = {
  title: string
  issuer: string
  /**
   * Icon key for the issuer; unknown or missing keys fall back to a generic badge.
   * Must match a supported icon name (e.g., "vercel", "coursera", "meta", "google", "microsoft", "accenture", "trademark", "copyright").
   */
  issuerIconName?: string
  /**
   * Issue date in ISO format (YYYY-MM-DD).
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
