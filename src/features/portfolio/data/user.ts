import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Deepanshu",
  lastName: "Yadav",
  displayName: "Deepanshu Yadav",
  username: "deepanshuyadav22",
  gender: "male",
  pronouns: "he/him",
  bio: "Trying something new, building something modern",
  flipSentences: [
    "Trying something new, building something modern",
    "Creating merodarshan.com, one commit at a time",
    "Software Engineer",
    "I'm using Tahoe and Baklava",
  ],
  address: "Vasai-Virar, Maharashtra, India",
  phoneNumberB64: "", // E.164 format, base64 encoded
  emailB64: "ZGVlcGFuc2h1eTIyQHByb3Rvbi5tZQ==", // base64 encoded
  website: "https://merodarshan.com",
  resumeUrl: "/resume.pdf",
  jobTitle: "Senior Software Engineer",
  jobs: [
    {
      title: "Senior Software Engineer",
      company: "Zeus Learning",
      website: "https://zeuslearning.com/",
      experienceId: "zeuslearning",
    },
  ],
  about: `- I'm Deepanshu - a full-stack software developer with 3+ years of professional experience in building scalable and user-centric web applications.
- Currently, enhancing an ed-tech CMS platform built using Angular, .NET and AWS, with a focus on performance, security and maintainability.
- Experienced in designing and deploying end-to-end system using Next.js, NestJS, MongoDB and Cloudflare.
- Also exploring Go (Golang) and Fiber framework based on the same.`,
  avatar: "/dp.jpg",
  avatarVariants: {
    lightOff: "/dp.jpg",
    lightOn: "/dp.jpg",
    darkOff: "/dp.jpg",
    darkOn: "/dp.jpg",
  },
  ogImage:
    "https://assets.chanhdai.com/images/screenshot-og-image-dark.png?t=1778602757",
  namePronunciationUrl: "https://assets.chanhdai.com/audio/chanhdai.mp3",
  timeZone: "Asia/Kolkata",
  keywords: [
    "Deepanshu",
    "Yadav",
    "Deepanshu Yadav",
    "Mero Darshan",
    "merodarshan",
  ],
  dateCreated: "2026-08-08", // YYYY-MM-DD
}
