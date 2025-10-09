import type { Experience } from "../types/experiences";

export const EXPERIENCES: Experience[] = [
  {
    id: "fluna",
    companyName: "Fluna",
    positions: [
      {
        id: "fluna-dev-junior",
        title: "Desenvolvedor de Software Júnior",
        employmentPeriod: {
          start: "11.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `Atuação em toda plataforma de desenvolvimento de automações, com foco em manutenção, melhorias de performance e desenvolvimento de novas features e produtos.

**RPA Featuring**
- Criação do sistema RPA para testes automatizados e automações via browser
- Pesquisa e integração das principais ferramentas RPA
- Implementação de novas "peças" no produto

**Kanban Featuring**
- Desenvolvimento colaborativo do Kanban Automatizado
- Implementação de tags de status e timer de registro de tempo
- Criação de regras de fluxo e hierarquia Parent/Children

**IA Featuring**
- Integração de LLMs (ChatGPT, Gemini) ao produto Mind (IA)
- Criação de feature para processamento de documentos
- Uso de libs de pré-processamento e análise de prompts`,
        skills: [
          "TypeScript",
          "Node.js",
          "React",
          "APIs REST",
          "RPA",
          "ChatGPT",
          "Gemini",
          "Performance",
          "Autenticação",
          "Manipulação de Dados",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "fastdezine",
    companyName: "Fastdezine, Inc.",
    positions: [
      {
        id: "fastdezine-dev-junior",
        title: "Desenvolvedor Júnior",
        employmentPeriod: {
          start: "03.2022",
          end: "10.2023",
        },
        employmentType: "Full-time",
        icon: "code",
        description: `- Desenvolvimento de automações com n8n e Google Apps Script
- Criação de aplicativo multiplataforma com Flutter + MongoDB
- Integração de APIs e automação de processos
- Desenvolvimento de soluções customizadas para clientes`,
        skills: [
          "n8n",
          "Google Apps Script",
          "Flutter",
          "MongoDB",
          "APIs REST",
          "Automação",
          "JavaScript",
          "Dart",
        ],
      },
      {
        id: "fastdezine-estagiario",
        title: "Estagiário de Projetos",
        employmentPeriod: {
          start: "03.2022",
          end: "10.2023",
        },
        employmentType: "Full-time",
        icon: "idea",
        description: `- Coordenação de sprints usando metodologia Scrum
- Acompanhamento de entregas e gestão de projetos
- Comunicação com stakeholders
- Facilitação de cerimônias ágeis`,
        skills: [
          "Scrum",
          "Gestão de Projetos",
          "Metodologias Ágeis",
          "Comunicação",
        ],
      },
    ],
  },
  {
    id: "ifmg",
    companyName: " Instituto Federal de Minas Gerais",
    positions: [
      {
        id: "ifmg-instrutor",
        title: "Instrutor de Programação",
        employmentPeriod: {
          start: "08.2020",
          end: "07.2021",
        },
        employmentType: "Part-time",
        icon: "education",
        description: `- Condução de curso de algoritmos com Python
- Ensino de programação para alunos de escolas públicas
- Desenvolvimento de material didático
- Acompanhamento do progresso dos alunos`,
        skills: ["Python", "Algoritmos", "Ensino", "Didática", "Comunicação"],
      },
    ],
  },
  {
    id: "education",
    companyName: "Formação Acadêmica",
    positions: [
      {
        id: "puc-minas",
        title: "Pontifícia Universidade Católica de Minas Gerais",
        employmentPeriod: {
          start: "2022",
          end: "2026",
        },
        icon: "education",
        description: `Graduação em Tecnologia da Informação (em andamento)

- Desenvolvimento de sistemas complexos
- Algoritmos e estruturas de dados
- Banco de dados e modelagem
- Engenharia de software
- Trabalho em equipe e apresentações`,
        skills: [
          "Algoritmos",
          "Estruturas de Dados",
          "Banco de Dados",
          "Engenharia de Software",
          "Trabalho em Equipe",
        ],
      },
      {
        id: "ifmg-grad",
        title: " Instituto Federal de Minas Gerais",
        employmentPeriod: {
          start: "2020",
          end: "2024",
        },
        icon: "education",
        description: `Graduação em Tecnologia da Informação (não finalizado)

- Fundamentos de programação
- Desenvolvimento web
- Banco de dados
- Redes de computadores
- Sistemas operacionais`,
        skills: [
          "Programação",
          "Desenvolvimento Web",
          "Banco de Dados",
          "Redes",
          "Linux",
        ],
      },
    ],
  },
];
