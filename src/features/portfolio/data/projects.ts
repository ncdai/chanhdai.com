import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "merodarshan",
    title: "Mero Darshan",
    period: {
      start: "08.2026",
    },
    link: "https://merodarshan.com/",
    skills: [
      "Cloudflare",
      "Go",
      "MongoDB",
      "Next.js",
      "Tailwind CSS",
      "TypeScirpt",
    ],
    description: `- Mero Darshan is being built.`,
    isExpanded: true,
  },
  {
    id: "interio-work",
    title: "Interio Work",
    period: {
      start: "12.2025",
      end: "03.2026",
    },
    link: "https://www.interio.work/",
    skills: [
      "Cloudflare R2",
      "MongoDB",
      "NestJS",
      "Next.js",
      "Tailwind CSS",
      "TypeScirpt",
    ],
    description: `- Developed and deployed a full-stack platform for showcasing interior design work with enquiry functionality.
- Built REST APIs and backend services using NestJS with structured DTO validation and modular architecture.
- Implemented image storage and delivery using Cloudflare R2 for optimized performance and scalability.
- Deployed frontend on Vercel and backend on Railway with CI/CD integration via GitHub.
- Ensured code quality using SonarQube and implemented production grade linting and validation.`,
    isExpanded: false,
  },
  {
    id: "saathi",
    title: "Saathi - An AI Companion",
    period: {
      start: "06.2022",
      end: "04.2023",
    },
    link: "https://saysaathi.vercel.app/",
    skills: [
      "Artificial Intelligence",
      "CNN",
      "Convolutional Neural Network",
      "Machine Learning",
      "MERN Stack",
      "Natural Language Processing",
      "Python",
      "RASA",
      "Team Work",
    ],
    description: `- Saathi is a generative chat-bot developed to support individuals with psychiatric disorders through gentle and empathetic conversations; it has achieved 4th place at IIT Bombay Research Conclave (ResCon), a national-level competition.
- Scraped, cleaned and preprocessed over 100,000+ Reddit posts from mental health forums focused on depression, anxiety and bipolar disorder to develop robust classification models.
- The chat-bot has language generation and understanding capabilities through the implementation of the RASA framework.
- It can detect emotions of anger, disgust, fear, joy, neutral, sadness, shame and surprise using a Machine Learning pipeline built using CountVectorizer and Logistic Regression and signs of depression, anxiety and bipolar disorder using Convolutional Neural Network (CNN).
- Published [research thesis](https://ssgmjournal.in/index.php/ssgm/article/view/79) at INSCIRD 2023, organized by the IEEE Students' Branch, Shri Sant Gajanan Maharaj College of Engineering, Shegaon (June 2023).`,
    isExpanded: true,
  },
  {
    id: "dsolve",
    title: "DSolve - Where Your Questions find Answers",
    period: {
      start: "07.2022",
      end: "07.2022",
    },
    link: "https://dsolve.vercel.app/",
    skills: ["MERN Stack", "MUI", "Web Hosting"],
    description: `- Built a full-stack discussion platform with authentication, like/dislike and comment system.
- Implemented question lifecycle management including marking answers as helpful or resolved.
- Independently designed and developed both frontend and backend.`,
    isExpanded: false,
  },
  {
    id: "alumni-community",
    title: "Alumni Community",
    period: {
      start: "02.2022",
      end: "04.2022",
    },
    link: "https://alumni-community.netlify.app/",
    skills: ["MERN Stack", "Team Work"],
    description: `- It is a platform for university to connect with their alumni.
- Integrated with a forum for ease of discussion and post, comment, vote feature similar to Reddit.
- Comes with a search feature to fetch user's details from their LinkedIn profile.`,
    isExpanded: false,
  },
  {
    id: "music-player",
    title: "Music Player",
    period: {
      start: "06.2021",
      end: "06.2021",
    },
    link: "https://deepanshuyadav22.github.io/music-player/",
    skills: ["HTML5", "CSS3", "JavaScript"],
    description: `- It is developed using HTML5, CSS3 and JavaScript.
- It is responsive in design and hence it can run on any device using a web-browser.
- It has four modes as shuffle, play & stop, repeat current song and play all songs in sequence with eminent backgrounds.`,
    isExpanded: false,
  },
  {
    id: "text-to-speech",
    title: "Text to Speech",
    period: {
      start: "04.2021",
      end: "04.2021",
    },
    link: "https://github.com/deepanshuyadav22/text-to-speech-online",
    skills: ["Python", "Tkinter"],
    description: `- The software can speech from a letter to a whole paragraph along with support for text files also.
- Integrated with translations into 107 languages.
- User will be able to save the speech as an audio file (in MP3 format).`,
    isExpanded: false,
  },
]
