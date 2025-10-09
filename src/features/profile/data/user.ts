import type { User } from "@/features/profile/types/user";

export const USER: User = {
  firstName: "Frederico",
  lastName: "Amantino",
  displayName: "Frederico Amantino",
  username: "fredamantino",
  gender: "male",
  pronouns: "ele/dele",
  bio: "Full Stack Developer com foco em IA e Automação",
  flipSentences: [
    "Full Stack Developer com foco em IA e Automação",
    "Desenvolvedor Full Stack",
    "Node.js e React",
  ],
  address: "Minas Gerais, Brasil",
  phoneNumber: "KzU1MzE5ODQ1Mzk0MjQ=", // +5531984539424 (E.164 format, base64 encoded)
  email: "cmljb2FtYW50aW5vQGdtYWlsLmNvbQ==", // ricoamantino@gmail.com (base64 encoded)
  website: "https://ricoamantino.com",
  jobTitle: "Desenvolvedor de Software Júnior",
  jobs: [
    {
      title: "Desenvolvedor de Software Júnior",
      company: "Fluna",
      website: "https://fluna.com.br",
    },
  ],
  about: `
Olá! Sou Frederico Amantino, um Desenvolvedor Full Stack com experiência em Inteligência Artificial, automação de processos e integração de APIs.

Atuo em todo o ciclo de desenvolvimento, da concepção à entrega, dentro do ecossistema Node.js e TypeScript. Tenho experiência com desenvolvimento de POCs/MVPs, sustentação de sistemas grandes em produção (Node/React), automação de fluxos (Make, n8n, Google Apps Script) e coordenação de equipes usando metodologias ágeis (Scrum).

Atualmente trabalho na Fluna, onde atuo na manutenção e desenvolvimento de novas features para a plataforma de automação, incluindo:
- Sistema RPA para testes automatizados e automações via browser
- Kanban automatizado com tags de status, timer e regras de fluxo
- Integração de LLMs (ChatGPT, Gemini) ao produto Mind (IA)
- Processamento de documentos com análise de prompts

Graduando em Tecnologia da Informação na Pontifícia Universidade Católica de Minas Gerais (previsão 2026).

Vamos conectar e colaborar!
  `,
  avatar: "https://github.com/fredamantino.png", // Avatar do GitHub
  ogImage: "https://github.com/fredamantino.png",
  namePronunciationUrl: "",
  keywords: [
    "frederico amantino",
    "fredamantino",
    "fred amantino",
    "desenvolvedor full stack",
    "node.js",
    "typescript",
    "react",
    "inteligência artificial",
  ],
  dateCreated: "2025-01-15", // Data de hoje
};
