export type Testimonial = {
  /** URL to the person's profile picture or avatar image */
  authorAvatar: string
  /** Full display name of the person giving the testimonial */
  authorName: string
  /** Short tagline, title, or description of the person */
  authorTagline: string
  /** Link to the person's profile, website, or social media page */
  url: string
  /** The testimonial text content or recommendation message */
  quote: string
  /** Date when the testimonial was given (YYYY-MM-DD) */
  date: string
  /** Optional CSS styles to apply to the testimonial component */
  style?: React.CSSProperties
}
