import { contactHref, site } from "../data/site";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section id="contato" className="section cta-section">
      <div className="cta-glow" aria-hidden />
      <div className="container cta-inner">
        <Reveal>
          <p className="section-label">08 — Contato</p>
          <h2 className="cta-title">Tem uma ideia?</h2>
          <p className="cta-text">
            Vamos transformar sua ideia em algo que as pessoas realmente queiram
            usar.
          </p>
          <Magnetic strength={0.35}>
            <a className="btn btn-primary cta-btn" href={contactHref()}>
              Vamos conversar <span className="btn-arrow">→</span>
            </a>
          </Magnetic>
          <a className="cta-mail" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
