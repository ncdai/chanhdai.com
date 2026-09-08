import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "bece",
    school: "University of Mumbai",
    degree: "Bachelor of Engineering",
    fieldOfStudy: "Computer Engineering",
    period: {
      start: "08.2019",
      end: "05.2023",
    },
    description: `- Was member of college's competitive programming team named CodeYantra and winner & runner-up in various coding competitions.
- Won 4th prize at IIT Bombay's national level event named ResCon (Research Conclave).
- Participated in LOC 5.0 hackathon organised by D. J. Sanghvi College of Engineering.
- Volunteered an AI/ML event.
- Team lead for final year major academic project.`,
    skills: [
      "C++",
      "Data Structures and Algorithms",
      "Databases",
      "Git",
      "GitHub",
      "MERN Stack",
      "Python",
      "Software Engineering",
    ],
  },
]
