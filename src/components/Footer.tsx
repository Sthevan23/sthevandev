import { site } from "../data/site";

export function Footer() {
  const year = new Date().getFullYear();
  const social = [
    { label: "GitHub", href: site.social.github },
    { label: "Instagram", href: site.social.instagram },
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "WhatsApp", href: site.social.whatsapp },
  ].filter((s) => s.href);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a href="#topo" className="brand">
            <span className="brand-mark" aria-hidden />
            <span className="brand-text">{site.brand}</span>
          </a>
          <p>Experiências digitais com intenção.</p>
        </div>

        <nav className="footer-nav" aria-label="Rodapé">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer-social">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
            >
              {s.label}
            </a>
          ))}
          {!site.social.instagram && (
            <span className="footer-placeholder">Instagram</span>
          )}
          {!site.social.linkedin && (
            <span className="footer-placeholder">LinkedIn</span>
          )}
          {!site.social.whatsapp && (
            <span className="footer-placeholder">WhatsApp</span>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {site.name}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
