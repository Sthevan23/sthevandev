export type ProjectSize = "xl" | "lg" | "md" | "sm";

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  image?: string;
  thumbs?: string[];
  href?: string;
  size: ProjectSize;
  featured?: boolean;
  accent: string;
  year?: string;
  mockup?: "dashboard" | "menu" | "agenda" | "barber" | "store" | "landing";
};

export const projects: Project[] = [
  {
    id: "verissimo",
    name: "Veríssimo Pratas",
    category: "E-commerce",
    description:
      "Loja online de pratas e semijoias com catálogo, animações e painel — elegância que permanece.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
    ],
    image: "/projects/semijoias/pulseira.jpg",
    thumbs: [
      "/projects/semijoias/anel.jpg",
      "/projects/semijoias/colar.jpg",
      "/projects/semijoias/pulseira.jpg",
    ],
    href: "https://verissimopratas.com.br",
    size: "xl",
    featured: true,
    accent: "#c9a227",
    year: "2026",
    mockup: "store",
  },
  {
    id: "suits-moda",
    name: "Suits Moda",
    category: "Website / E-commerce",
    description:
      "Site de moda masculina com visual sofisticado, foco em elegância e apresentação de produtos.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/suits/hero.png",
    thumbs: [
      "/projects/suits/0.jpeg",
      "/projects/suits/mid.png",
      "/projects/suits/hero.png",
    ],
    href: "https://sthevan23.github.io/suit_modas/",
    size: "lg",
    accent: "#c4a574",
    year: "2025",
    mockup: "store",
  },
  {
    id: "burger-falcone",
    name: "Burger Falcone",
    category: "E-commerce / Cardápio Digital",
    description:
      "Cardápio digital com pedido online, painel administrativo e tela de cozinha. Em produção em sthevandev.com.br.",
    technologies: ["Node.js", "Express", "MySQL", "JavaScript", "HTML", "CSS"],
    image: "/projects/burger/hero.png",
    thumbs: [
      "/projects/burger/mid.png",
      "/projects/burger/hero.png",
      "/projects/burger/mid.png",
    ],
    href: "https://sthevandev.com.br",
    size: "lg",
    accent: "#f5a524",
    year: "2026",
    mockup: "store",
  },
  {
    id: "aurora",
    name: "Aurora Confeitaria",
    category: "E-commerce / Website",
    description:
      "Site + painel admin para confeitaria artesanal: catálogo, carrinho, pedidos e API PHP com MySQL.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: "/projects/aurora/hero.jpg",
    thumbs: [
      "/projects/aurora/detail.jpg",
      "/projects/aurora/product.jpg",
      "/projects/aurora/hero.jpg",
    ],
    href: "https://auroraconfeitaria.com.br",
    size: "lg",
    accent: "#e8a0bf",
    year: "2026",
    mockup: "store",
  },
  {
    id: "donuts",
    name: "Sweet Donuts",
    category: "Website / Cardápio",
    description:
      "Landing page de donuts artesanais com cardápio, combos, galeria e pedido pelo WhatsApp.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/donuts/hero.jpg",
    thumbs: [
      "/projects/donuts/1.jpg",
      "/projects/donuts/2.jpg",
      "/projects/donuts/3.jpg",
    ],
    href: "https://sthevan23.github.io/donuts/",
    size: "md",
    accent: "#f472b6",
    year: "2025",
    mockup: "store",
  },
  {
    id: "gimarry",
    name: "Gimarry Bolos",
    category: "Website / Cardápio",
    description:
      "Site estático de confeitaria com cardápio, galeria de bolos e pedidos finalizados pelo WhatsApp.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/gimarry/2.jpg",
    thumbs: [
      "/projects/gimarry/1.jpg",
      "/projects/gimarry/2.jpg",
      "/projects/gimarry/3.jpg",
    ],
    href: "https://gimarrybolos.com.br",
    size: "md",
    accent: "#d4a5a5",
    year: "2026",
    mockup: "store",
  },
  {
    id: "psicoagenda",
    name: "PsicoAgenda",
    category: "Sistema Web",
    description:
      "Gestão de consultas para consultório de psicologia: agenda, pacientes, histórico, relatórios e backup JSON.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/psico/hero.png",
    thumbs: [
      "/projects/psico/mid.png",
      "/projects/psico/hero.png",
      "/projects/psico/mid.png",
    ],
    href: "https://sthevan23.github.io/agenda_piscologia/",
    size: "sm",
    accent: "#7dd3fc",
    year: "2025",
    mockup: "store",
  },
  {
    id: "fisioagenda",
    name: "FisioAgenda",
    category: "Sistema Web",
    description:
      "Aplicação web para gestão de consultas em fisioterapia, com agenda e controle de atendimentos.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/fisio/hero.png",
    thumbs: [
      "/projects/fisio/mid.png",
      "/projects/fisio/hero.png",
      "/projects/fisio/mid.png",
    ],
    href: "https://sthevan23.github.io/agenda_fisioterapia/",
    size: "sm",
    accent: "#34d399",
    year: "2025",
    mockup: "store",
  },
  {
    id: "instrutor",
    name: "Instrutor Lucas Mesquita",
    category: "Landing Page",
    description:
      "Landing page para aulas particulares de direção (manual e automático) em Divinópolis.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/instrutor/hero.png",
    thumbs: [
      "/projects/instrutor/carro.png",
      "/projects/instrutor/hero.png",
      "/projects/instrutor/carro.png",
    ],
    size: "md",
    accent: "#60a5fa",
    year: "2026",
    mockup: "store",
  },
  {
    id: "snitap",
    name: "Snitap Patins",
    category: "Experiência Digital",
    description:
      "Landing page animada para marca de patins, com tipografia expressiva, motion e composição visual forte.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/patins/hero.png",
    thumbs: [
      "/projects/patins/01.png",
      "/projects/patins2/1.png",
      "/projects/patins/hero.png",
    ],
    href: "https://sthevan23.github.io/patins-animation/",
    size: "lg",
    accent: "#f472b6",
    year: "2025",
    mockup: "store",
  },
];

export const featuredProject =
  projects.find((p) => p.featured) ?? projects[0];

export const heroProject = featuredProject;
