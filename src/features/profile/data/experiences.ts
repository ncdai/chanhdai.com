import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "bookasfar",
    companyName: "BookAsfar",
    companyLogo:
      "https://ui-avatars.com/api/?name=BookAsfar&background=0B7285&color=fff",
    positions: [
      {
        id: "77b0560a-b292-4f3c-a79f-ece9bfa2c674",
        title: "DevOps Engineer Intern",
        employmentPeriod: {
          start: "02.2025",
          end: "07.2025",
        },
        employmentType: "Internship",
        icon: "code",
        description: `- Automated observability data collection pipelines that captured system metrics, business KPIs, and error logs into a unified data lake.
- Built Python scripts and Power BI dashboards to track release quality, incident frequency, and SLA adherence for leadership reviews.
- Recommended data-driven improvements to deployment workflows that reduced manual checks and sped up recovery from failures.`,
        skills: [
          "Python",
          "Power BI",
          "SQL",
          "Automation",
          "Monitoring",
          "DevOps",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "ajicod",
    companyName: "AJICOD",
    companyLogo:
      "https://ui-avatars.com/api/?name=AJICOD&background=1D4ED8&color=fff",
    positions: [
      {
        id: "5128a29e-4cc0-4de0-8777-a33239003140",
        title: "Software Engineer Intern",
        employmentPeriod: {
          start: "06.2023",
          end: "09.2023",
        },
        employmentType: "Internship",
        icon: "code",
        description: `- Developed analytics modules and SQL-based reporting features that surfaced client KPIs inside the platform.
- Authored ETL scripts for data cleaning, validation, and visualization-ready tables consumed by product and business teams.
- Partnered with stakeholders to translate business requirements into metrics, dashboards, and automation backlogs.`,
        skills: [
          "SQL",
          "ETL",
          "Data Visualization",
          "Python",
          "Requirements Gathering",
        ],
      },
    ],
  },
];
