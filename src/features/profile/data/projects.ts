import type { Project } from "../types/projects";

export const PROJECTS: Project[] = [
  {
    id: "fluna-platform",
    title: "Fluna - Plataforma de Automação",
    period: {
      start: "11.2023",
    },
    link: "https://fluna.com.br",
    skills: [
      "TypeScript",
      "Node.js",
      "React",
      "RPA",
      "LLMs",
      "ChatGPT",
      "Gemini",
      "APIs REST",
      "Performance Optimization",
    ],
    description: `Plataforma de desenvolvimento de automações com foco em produtividade e eficiência.

**Principais Features Desenvolvidas:**
- **Sistema RPA**: Criação de RPA para testes automatizados e automações via browser
- **Kanban Automatizado**: Desenvolvimento de sistema Kanban com tags de status, timer de registro de tempo e regras de fluxo hierárquico
- **Mind (IA)**: Integração de LLMs (ChatGPT, Gemini) com processamento de documentos e análise de prompts

Atuação em todo ciclo de desenvolvimento: análise, implementação, testes e deploy.`,
    isExpanded: true,
  },
  {
    id: "florescer",
    title: "Florescer - Gestão de Pacientes",
    period: {
      start: "2023",
      end: "2023",
    },
    link: "#",
    skills: [
      "Node.js",
      "React",
      "PostgreSQL",
      "Otimização de Consultas",
      "Modelagem de Dados",
    ],
    description: `Webapp para gestão de pacientes com foco em performance e usabilidade.

**Responsabilidades:**
- Sustentação da plataforma e correção de bugs
- Otimização de consultas ao banco de dados
- Atualização da modelagem das entidades
- Implementação de funcionalidade PDI (Plano de Desenvolvimento Individual)`,
  },
  {
    id: "sicoob",
    title: "Sicoob - Análise de Crédito",
    period: {
      start: "2023",
      end: "2023",
    },
    link: "#",
    skills: [
      "Node.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Análise de Requisitos",
      "Modelagem de Banco de Dados",
    ],
    description: `Webapp completo para análise de crédito desenvolvido do zero.

**Atuação:**
- Participação do início ao fim do projeto
- Análise de requisitos junto ao cliente
- Modelagem de banco de dados
- Desenvolvimento front-end e back-end
- Entrega de solução completa com performance otimizada e integração robusta`,
  },
  {
    id: "fisco",
    title: "Fisco - Automação Fiscal",
    period: {
      start: "2023",
      end: "2023",
    },
    link: "#",
    skills: [
      "Node.js",
      "React",
      "RPA",
      "Automação",
      "Integração com ERP",
      "Processos Fiscais",
    ],
    description: `Webapp para automação de processos fiscais manuais em ERP.

**Desenvolvimento:**
- Plataforma completa de automação de processos fiscais
- Criação de RPA personalizado para rotinas fiscais
- Integração com sistemas ERP existentes
- Redução significativa de trabalho manual e erros operacionais`,
  },
];
