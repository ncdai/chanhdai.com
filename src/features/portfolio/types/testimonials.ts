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
  /** Flag to indicate if the testimonial is from a verified user */
  isVerified?: boolean
  /** Flag to indicate if this testimonial should be highlighted as featured */
  isFeatured?: boolean
  /** Optional numeric value to control the display order of testimonials */
  order?: number
  /** Optional CSS styles to apply to the testimonial component */
  style?: React.CSSProperties
}
