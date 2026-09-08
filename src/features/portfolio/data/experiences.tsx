import { CodeXmlIcon } from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "zeuslearning",
    companyName: "Zeus Learning",
    companyLogo: "https://assets.chanhdai.com/images/companies/shadcncraft.svg",
    companyWebsite: "https://zeuslearning.com/",
    location: "Lower Parel, Mumbai, India",
    locationType: "Hybrid",
    positions: [
      {
        id: "1",
        title: "Senior Software Engineer",
        employmentPeriod: {
          start: "07.2025",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Had an exposure to SymPy.
- Developed a data-driven feature that enables teachers to visualize class-wide and individual performance through intuitive graphical insights, enhancing understanding of academic progress and outcomes.
- Architected and developed an assessment player utilizing rule-based logic to deliver adaptive, branching questionnaires tailored to individual user performance.
- Addressed and resolved accessibility issues across the codebase to align with WCAG 2.2 AA criterion.
- Resolved security vulnerabilities aligned with OWASP standards, improving application's security posture.`,
        skills: [
          "Angular",
          "Angular Material UI",
          "ASP.NET Core",
          "C#",
          "DocumentDB",
          "MariaDB",
          "SymPy",
          "TypeScript",
          "WCAG (2.2 AA)",
        ],
        isExpanded: true,
      },
      {
        id: "0",
        title: "Software Engineer",
        employmentPeriod: {
          start: "07.2023",
          end: "06.2025",
        },
        employmentType: "Full-time",
        icon: <CodeXmlIcon />,
        description: `- Enhanced an ed-tech CMS web application by delivering new features and improving existing functionalities in line with evolving business requirements.
- Developed an Angular micro-frontend to handle Question and Test Interoperability (QTI) export, and integrated it with external LMS platform to enable seamless content delivery.
- Benchmarked and evaluated performance difference between Rust (with REST) and .NET (with gRPC) by developing basic microservices in both languages with same funtionalities to identify whether we should migrate an existing microservice; Rust outperformed .NET implementation by 65% in throughput.
- Updated CKEditor twice to latest v4.x.x LTS versions across the codebase to avoid security issues present in previous versions.
- Organized a knowledge transfer session for the team regarding good code practices in C#, elevating overall code quality and maintainability.`,
        skills: [
          "Angular",
          "Angular Material UI",
          "ASP.NET Core",
          "C#",
          "CKEditor",
          "DocumentDB",
          "MariaDB",
          "QTI",
          "Rust",
          "TypeScript",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
]
