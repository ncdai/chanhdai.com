import { Blog01Mockup } from "./blog-01"
import { Blog02Mockup } from "./blog-02"
import { Experience01Mockup } from "./experience-01"
import { Hero01Mockup } from "./hero-01"
import { Login01Mockup } from "./login-01"
import { Metrics01Mockup } from "./metrics-01"
import { NotFound01Mockup } from "./not-found-01"
import { SocialLinks01Mockup } from "./social-links-01"
import { SocialProof01Mockup } from "./social-proof-01"
import { Team01Mockup } from "./team-01"
import { Testimonials01Mockup } from "./testimonials-01"
import { Testimonials02Mockup } from "./testimonials-02"

export const BLOCK_MOCKUPS: Record<string, React.ComponentType> = {
  "login-01": Login01Mockup,
  "hero-01": Hero01Mockup,
  "blog-01": Blog01Mockup,
  "blog-02": Blog02Mockup,
  "testimonials-01": Testimonials01Mockup,
  "testimonials-02": Testimonials02Mockup,
  "experience-01": Experience01Mockup,
  "team-01": Team01Mockup,
  "metrics-01": Metrics01Mockup,
  "social-links-01": SocialLinks01Mockup,
  "social-proof-01": SocialProof01Mockup,
  "not-found-01": NotFound01Mockup,
}
