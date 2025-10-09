import type { TechStack } from "../types/tech-stack";

export const TECH_STACK: TechStack[] = [
  // Linguagens
  {
    key: "typescript",
    title: "TypeScript",
    href: "https://www.typescriptlang.org/",
    categories: ["Language"],
  },
  {
    key: "javascript",
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    categories: ["Language"],
  },
  {
    key: "python",
    title: "Python",
    href: "https://www.python.org/",
    categories: ["Language"],
  },

  // Runtime
  {
    key: "nodedotjs",
    title: "Node.js",
    href: "https://nodejs.org/",
    categories: ["Runtime Environment"],
  },

  // Frontend - React Ecosystem
  {
    key: "react",
    title: "React",
    href: "https://react.dev/",
    categories: ["Library", "UI Library"],
  },
  {
    key: "nextdotjs",
    title: "Next.js",
    href: "https://nextjs.org/",
    categories: ["Framework"],
    theme: true,
  },
  {
    key: "expo",
    title: "Expo",
    href: "https://expo.dev/",
    categories: ["Framework", "Mobile"],
    theme: true,
  },

  // Styling
  {
    key: "tailwindcss",
    title: "Tailwind CSS",
    href: "https://tailwindcss.com/",
    categories: ["Framework", "CSS"],
  },

  // UI Component Libraries
  {
    key: "radixui",
    title: "Radix UI",
    href: "https://www.radix-ui.com/",
    categories: ["Library", "Component Library"],
    theme: true,
  },
  {
    key: "shadcnui",
    title: "shadcn/ui",
    href: "https://ui.shadcn.com/",
    categories: ["Library", "Component Library"],
    theme: true,
  },

  // Bancos de Dados
  {
    key: "postgresql",
    title: "PostgreSQL",
    href: "https://www.postgresql.org/",
    categories: ["Database"],
  },
  {
    key: "mongodb",
    title: "MongoDB",
    href: "https://www.mongodb.com/",
    categories: ["Database"],
  },
  {
    key: "redis",
    title: "Redis",
    href: "https://redis.io/",
    categories: ["Database", "Cache"],
  },

  // Message Broker
  {
    key: "rabbitmq",
    title: "RabbitMQ",
    href: "https://www.rabbitmq.com/",
    categories: ["Message Broker"],
  },

  // Inteligência Artificial
  {
    key: "openai",
    title: "ChatGPT",
    href: "https://chatgpt.com/",
    categories: ["Tools", "AI"],
    theme: true,
  },
  {
    key: "googlegemini",
    title: "Google Gemini",
    href: "https://gemini.google.com/",
    categories: ["Tools", "AI"],
  },

  // Automação
  {
    key: "n8n",
    title: "n8n",
    href: "https://n8n.io/",
    categories: ["Tools", "Automation"],
  },

  // DevOps & Tools
  {
    key: "git",
    title: "Git",
    href: "https://git-scm.com/",
    categories: ["Version Control"],
  },
  {
    key: "docker",
    title: "Docker",
    href: "https://www.docker.com/",
    categories: ["Containerization"],
  },
];
