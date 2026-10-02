import type { Project } from "../data/projects";

type Props = {
  project: Project;
  className?: string;
};

/** Preview do site em moldura de browser — com imagem real quando houver. */
export function ProjectVisual({ project, className }: Props) {
  return (
    <div
      className={`site-shot ${className ?? ""}`}
      style={{ ["--mock-accent" as string]: project.accent }}
      aria-hidden
    >
      <div className="site-browser">
        <div className="site-browser-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="site-browser-url">
          <i />
          <em>{slugUrl(project)}</em>
        </div>
      </div>

      <div className="site-page">
        <div className="site-nav">
          <strong>{project.name}</strong>
          <div className="site-nav-links">
            <i />
            <i />
            <i />
          </div>
        </div>

        {project.image ? (
          <StoreBody project={project} />
        ) : project.mockup === "dashboard" ? (
          <DashboardBody />
        ) : project.mockup === "menu" ? (
          <MenuBody />
        ) : project.mockup === "agenda" ? (
          <AgendaBody />
        ) : project.mockup === "barber" ? (
          <BarberBody />
        ) : (
          <StoreBody project={project} />
        )}
      </div>
    </div>
  );
}

function slugUrl(project: Project) {
  if (project.href?.includes("github.io")) {
    try {
      const u = new URL(project.href);
      return u.host + u.pathname.replace(/\/$/, "");
    } catch {
      /* fallthrough */
    }
  }
  if (project.href?.startsWith("http")) {
    try {
      return new URL(project.href).host;
    } catch {
      /* fallthrough */
    }
  }
  return (
    project.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "") + ".app"
  );
}

function StoreBody({ project }: { project: Project }) {
  const thumbs = project.thumbs?.slice(0, 3) ?? [];

  return (
    <div className="site-store">
      <div className="site-hero-band">
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="site-hero-fallback" />
        )}
        <div className="site-hero-copy">
          <b>{project.name}</b>
          <span>{project.category}</span>
        </div>
      </div>
      <div className="site-cards">
        {[0, 1, 2].map((i) =>
          thumbs[i] ? (
            <div key={i} className="site-card-thumb">
              <img src={thumbs[i]} alt="" loading="lazy" decoding="async" />
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  );
}

function DashboardBody() {
  return (
    <div className="site-dash">
      <aside>
        <i className="on" />
        <i />
        <i />
        <i />
      </aside>
      <main>
        <header>
          <b>Pedidos</b>
          <small>Ao vivo</small>
        </header>
        <div className="site-kpis">
          <div>
            <span>Hoje</span>
            <strong>48</strong>
          </div>
          <div>
            <span>Ticket</span>
            <strong>R$ 62</strong>
          </div>
          <div>
            <span>Cozinha</span>
            <strong>7</strong>
          </div>
        </div>
        <div className="site-rows">
          <div />
          <div />
          <div />
        </div>
      </main>
    </div>
  );
}

function MenuBody() {
  return (
    <div className="site-menu">
      <div className="site-menu-hero">
        <b>Cardápio</b>
        <span>Pedido online</span>
      </div>
      <div className="site-menu-list">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

function AgendaBody() {
  return (
    <div className="site-agenda">
      <div className="site-cal">
        {Array.from({ length: 21 }).map((_, i) => (
          <span key={i} className={i === 8 || i === 14 ? "on" : undefined} />
        ))}
      </div>
      <div className="site-agenda-list">
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}

function BarberBody() {
  return (
    <div className="site-barber">
      <div className="site-barber-card" />
      <div className="site-barber-card" />
      <div className="site-barber-slots">
        <span />
        <span className="on" />
        <span />
        <span />
      </div>
    </div>
  );
}
