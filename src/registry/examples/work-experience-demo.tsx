import type { ExperienceItemType } from "@/registry/work-experience"
import { WorkExperience } from "@/registry/work-experience"

const WORK_EXPERIENCE: ExperienceItemType[] = [
  {
    id: "quaric",
    companyName: "Quaric Co., Ltd.",
    companyLogo: "https://assets.chanhdai.com/images/companies/quaric.svg",
    positions: [
      {
        id: "30d3a9fb-021d-452a-9d27-83655369b4b9",
        title: "Software Engineer",
        employmentPeriod: "03.2024 — present",
        employmentType: "Part-time",
        icon: "code",
        description: `- Integrated VNPAY-QR for secure transactions.
- Registered the e-commerce site with [online.gov.vn](https://online.gov.vn) for compliance.
- Developed online ordering to streamline purchases.
- Build and maintain ZaDark.com with Docusaurus, integrating AdSense.
- Develop and maintain the ZaDark extension for Zalo Web on Chrome, Safari, Edge, and Firefox — with 15,000+ active users via Chrome Web Store.`,
        skills: [
          "Next.js",
          "Strapi",
          "Auth0",
          "VNPAY-QR",
          "Docker",
          "NGINX",
          "Google Cloud",
          "Docusaurus",
          "Extension",
          "Research",
          "Project Management",
        ],
        isExpanded: true,
      },
      {
        id: "7586afb2-40e8-49c4-8983-2254c9446540",
        title: "Product Designer",
        employmentPeriod: "03.2024 — present",
        employmentType: "Part-time",
        icon: "design",
        description: `- Design UI/UX for Quaric Website with a seamless experience.
- Develop a Design System for consistency and efficiency.
- Create Quaric's brand identity, including logo and guidelines.`,
        skills: [
          "UI/UX Design",
          "UX Writing",
          "Design System",
          "Brand Design",
          "Figma",
        ],
      },
      {
        id: "991692c4-7d02-4666-8d31-933c4831768d",
        title: "Founder & Director",
        employmentPeriod: "03.2024 — present",
        employmentType: "Part-time",
        icon: "business",
        description: `- Lead and manage the company's strategy.
- Oversee technical teams and product development.
- Manage relationships with customers and partners.`,
        skills: ["Business Ownership", "Business Law", "Business Tax"],
      },
    ],
    isCurrentEmployer: true,
  },
]

export default function WorkExperienceDemo() {
  return <WorkExperience className="w-full" experiences={WORK_EXPERIENCE} />
}
