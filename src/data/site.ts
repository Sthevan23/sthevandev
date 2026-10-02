export const site = {
  brand: "Sthevan Dev",
  name: "Sthevan Welliton",
  email: "sthevanicm@gmail.com",
  domain: "https://sthevandev.com.br",
  social: {
    github: "https://github.com/Sthevan23",
    instagram: "", // preencha com seu Instagram
    linkedin: "", // preencha com seu LinkedIn
    whatsapp: "https://wa.me/5537991243408",
  },
  nav: [
    { label: "Projetos", href: "#projetos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    title: "Transformo ideias em experiências digitais.",
    subtitle:
      "Sites, sistemas e experiências digitais desenvolvidos com tecnologia, estratégia e atenção aos detalhes.",
  },
  about: {
    title: "Por trás dos projetos.",
    text: "Sou Sthevan Welliton, desenvolvedor full-stack focado em transformar negócios locais em experiências digitais claras, rápidas e bem construídas. Do cardápio online ao sistema completo — cada projeto nasce da necessidade real do cliente.",
  },
  stats: [
    { value: 30, label: "Projetos selecionados", suffix: "+" },
    { value: 36, label: "Repositórios no GitHub", suffix: "" },
    { value: 12, label: "Tecnologias utilizadas", suffix: "" },
  ],
  process: [
    {
      step: "01",
      title: "Descoberta",
      description: "Entendimento da necessidade.",
    },
    {
      step: "02",
      title: "Estratégia",
      description: "Definição da estrutura e experiência.",
    },
    {
      step: "03",
      title: "Desenvolvimento",
      description: "Construção do produto.",
    },
    {
      step: "04",
      title: "Refinamento",
      description: "Ajustes, responsividade e performance.",
    },
    {
      step: "05",
      title: "Entrega",
      description: "Produto pronto para utilização.",
    },
  ],
  services: [
    {
      id: "01",
      title: "Websites",
      description:
        "Presença digital profissional com identidade visual, performance e conversão.",
      preview: "Institucional · Landing · Portfólio",
    },
    {
      id: "02",
      title: "Landing Pages",
      description:
        "Páginas de alta conversão para campanhas, serviços e lançamentos.",
      preview: "CTA claro · Mobile-first · Rápidas",
    },
    {
      id: "03",
      title: "Sistemas Web",
      description:
        "Painéis, agendas, autenticação e fluxos sob medida para o negócio.",
      preview: "Dashboards · Auth · CRUD",
    },
    {
      id: "04",
      title: "E-commerce",
      description:
        "Catálogos, carrinho e pedidos — do WhatsApp ao checkout completo.",
      preview: "Catálogo · Carrinho · Pedidos",
    },
    {
      id: "05",
      title: "Dashboards",
      description:
        "Visão de vendas, pedidos, financeiro e operação em tempo real.",
      preview: "Métricas · Relatórios · Ops",
    },
    {
      id: "06",
      title: "Experiências digitais",
      description:
        "Interfaces com movimento, narrativa e atenção aos detalhes.",
      preview: "Motion · UX · Interação",
    },
  ],
  technologies: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vite",
    "Node.js",
    "Express",
    "PHP",
    "MySQL",
    "Supabase",
    "Tailwind CSS",
    "Framer Motion",
    "Git",
    "GitHub",
  ],
} as const;

export function contactHref() {
  if (site.social.whatsapp) return site.social.whatsapp;
  return `mailto:${site.email}`;
}
