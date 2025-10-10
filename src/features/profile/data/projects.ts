import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "casablanca-port-logistics-optimizer",
    title: "Casablanca Port Logistics Optimizer",
    period: {
      start: "04.2024",
      end: "09.2024",
    },
    link: "https://github.com/mohamedarkid/casablanca-port-logistics-optimizer",
    skills: [
      "Python",
      "GeoPandas",
      "Prophet",
      "scikit-learn",
      "SQL",
      "Power BI",
      "Streamlit",
    ],
    description: `Goal: Predict shipment delays and optimise truck routes at Casablanca Port.
- Collected and cleaned nearly 10k rows of shipment, traffic, and weather data from ANP.ma, ONCF, and NOAA sources.
- Built time-series and regression ensembles to forecast delivery times, highlight bottlenecks, and prioritise interventions.
- Published interactive geospatial maps plus a Power BI dashboard with KPIs for delay time, fuel savings, and route efficiency.
Result: 15% reduction in simulated route delays and 20% fuel savings across planning scenarios.`,
    logo: "https://ui-avatars.com/api/?name=CPO&background=0F172A&color=fff",
    isExpanded: true,
  },
  {
    id: "sales-performance-forecast-dashboard",
    title: "Sales Performance & Forecast Dashboard",
    period: {
      start: "11.2023",
      end: "03.2024",
    },
    link: "https://github.com/mohamedarkid/sales-performance-dashboard",
    skills: ["Power BI", "Excel", "SQL", "Python", "Pandas", "DAX"],
    description:
      "Goal: Deliver interactive sales analytics for regional managers.\n- Merged SQL and Excel datasets, performed EDA, and modelled seasonality with Python forecasting notebooks.\n- Designed KPI cards, drill-through reports, and slicers for region, segment, and channel performance.\nResult: Enabled a 10% increase in regional sales through data-driven insights and faster decision cycles.",
    logo: "https://ui-avatars.com/api/?name=SP&background=1F2937&color=fff",
  },
  {
    id: "secure-legal-rag",
    title: "Secure RAG System for Legal Documents",
    period: {
      start: "06.2024",
      end: "12.2024",
    },
    link: "https://github.com/mohamedarkid/secure-legal-rag",
    skills: ["LangChain", "LlamaIndex", "Python", "SQL", "Vector Search"],
    description:
      "Goal: Enable secure, on-premise querying of bilingual legal archives.\n- Implemented document embeddings, vector search, and retrieval pipelines tailored to Arabic and French corpora.\n- Fine-tuned LLM prompts for summarisation and drafted responses with role-based access controls.\nResult: Delivered a prototype for sovereign AI applications handling sensitive legal knowledge securely.",
    logo: "https://ui-avatars.com/api/?name=RAG&background=312E81&color=fff",
  },
];
