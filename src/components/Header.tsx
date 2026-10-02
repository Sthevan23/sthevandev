import { useEffect, useState } from "react";
import { site, contactHref } from "../data/site";
import { Magnetic } from "./Magnetic";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#topo" className="brand" aria-label={`${site.brand} — início`}>
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">{site.brand}</span>
        </a>

        <nav className="nav-desktop" aria-label="Principal">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <Magnetic>
            <a className="btn btn-primary header-cta" href={contactHref()}>
              Entrar em contato
            </a>
          </Magnetic>
          <button
            className={`nav-toggle ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`nav-mobile ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            className="btn btn-primary"
            href={contactHref()}
            onClick={() => setOpen(false)}
          >
            Entrar em contato
          </a>
        </nav>
      </div>
    </header>
  );
}
