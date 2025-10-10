import type { User } from "@/features/profile/types/user";

export const USER: User = {
  firstName: "Mohamed",
  lastName: "Arkid",
  displayName: "Mohamed Arkid",
  username: "mohamedarkid",
  gender: "male",
  pronouns: "he/him",
  bio: "Data Analyst & AI Engineer turning raw data into predictive insights and intelligent products.",
  flipSentences: [
    "Data Analyst & AI Engineer",
    "Building dashboards, models & automation",
    "Powering decisions with intelligent data",
  ],
  address: "Casablanca, Morocco",
  phoneNumber: "KzIxMjYwMDAwMDAwMA==", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "bW9oYW1lZC5hcmtpZC5kZXZAZ21haWwuY29t", // base64 encoded
  website: "https://mohamedarkid.dev",
  jobTitle: "Data Analyst & AI Engineer",
  jobs: [
    {
      title: "DevOps Engineer Intern",
      company: "BookAsfar",
      website: "https://www.bookasfar.com",
    },
    {
      title: "Software Engineer Intern",
      company: "AJICOD",
      website: "https://www.ajicod.com",
    },
  ],
  about: `
Hello! I'm Mohamed Arkid — a data analyst and AI engineer passionate about turning raw, messy datasets into clear direction for the teams that rely on them.

My academic path in Embedded Artificial Intelligence taught me how to build reliable systems from the edge to the cloud. Since then I've focused on data analytics, machine learning, and automation projects that improve decision-making for operations, sales, and legal teams.

Recent work includes forecasting shipment delays for Casablanca Port, designing sales intelligence dashboards that surface growth opportunities, and engineering secure RAG pipelines for sensitive legal content. Whether I'm scripting ETL pipelines, training models, or crafting stories in Power BI, my goal is the same: deliver trustworthy insights that teams can act on with confidence.

If you're seeking someone who blends analytical rigour with curiosity, collaboration, and continuous learning — let's build data-driven solutions together.
  `,
  avatar:
    "https://ui-avatars.com/api/?name=Mohamed+Arkid&background=1D4ED8&color=fff",
  ogImage:
    "https://og-playground.vercel.sh/api/og?title=Mohamed%20Arkid&description=Data%20Analyst%20%26%20AI%20Engineer",
  namePronunciationUrl: "",
  keywords: [
    "Mohamed Arkid",
    "Data Analyst",
    "AI Engineer",
    "Python",
    "SQL",
    "Power BI",
    "Machine Learning",
    "Casablanca",
    "Morocco",
    "Embedded Artificial Intelligence",
    "Forecasting",
    "Time-Series",
    "ETL",
    "Dashboard",
    "LangChain",
    "Streamlit",
    "GeoPandas",
    "Prophet",
    "MLflow",
    "Internship",
  ],
  dateCreated: "2025-02-01", // YYYY-MM-DD
};
