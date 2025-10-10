import type { Award } from "../types/awards";

export const AWARDS: Award[] = [
  {
    id: "cpo-impact",
    prize: "Impact",
    title: "Casablanca Port Logistics Optimizer",
    date: "2024-09",
    grade: "Project",
    description:
      "- Achieved a simulated 15% reduction in route delays and 20% fuel savings by combining forecasting models with geospatial analytics.\n- Delivered operational dashboards adopted by port planning teams for scenario analysis.",
    referenceLink:
      "https://github.com/mohamedarkid/casablanca-port-logistics-optimizer",
  },
  {
    id: "sales-dashboard",
    prize: "Business Enablement",
    title: "Sales Performance & Forecast Dashboard",
    date: "2024-03",
    grade: "Project",
    description:
      "- Equipped regional managers with interactive Power BI insights, unlocking a 10% increase in sales.\n- Established a repeatable forecasting workflow using Python notebooks and DAX measures.",
    referenceLink:
      "https://github.com/mohamedarkid/sales-performance-dashboard",
  },
  {
    id: "legal-rag",
    prize: "Prototype",
    title: "Secure RAG System for Legal Documents",
    date: "2024-12",
    grade: "AI Engineering",
    description:
      "- Built a bilingual, on-premise RAG pipeline with LangChain, LlamaIndex, and SQL-backed vector search for sensitive legal data.\n- Demonstrated secure AI assistants for legal counsel and compliance stakeholders.",
    referenceLink: "https://github.com/mohamedarkid/secure-legal-rag",
  },
];
