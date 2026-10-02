import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "../data/site";
import { Reveal } from "./Reveal";
import { useIsMobile } from "../hooks/useMedia";

export function Services() {
  const [active, setActive] = useState(0);
  const mobile = useIsMobile(768);

  return (
    <section id="servicos" className="section services-section">
      <div className="container">
        <Reveal>
          <p className="section-label">02 — Serviços</p>
          <h2 className="section-title">Do conceito ao produto.</h2>
        </Reveal>

        {mobile ? (
          <div className="services-accordion">
            {site.services.map((service, i) => {
              const open = active === i;
              return (
                <div
                  key={service.id}
                  className={`service-acc ${open ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    <span className="service-num">{service.id}</span>
                    <span className="service-title">{service.title}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        className="service-acc-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p>{service.description}</p>
                        <small>{service.preview}</small>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="services-list">
            <div className="services-track">
              {site.services.map((service, i) => (
                <button
                  key={service.id}
                  type="button"
                  className={`service-row ${active === i ? "is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="service-num">{service.id}</span>
                  <span className="service-title">{service.title}</span>
                  <span className="service-line" aria-hidden />
                  <span className="service-desc">{service.description}</span>
                </button>
              ))}
            </div>
            <div className="services-preview" aria-hidden>
              <AnimatePresence mode="wait">
                <motion.div
                  key={site.services[active]?.id}
                  className="preview-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <span>{site.services[active]?.id}</span>
                  <strong>{site.services[active]?.title}</strong>
                  <p>{site.services[active]?.preview}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
