import { useRef, useState } from "react";
import { site } from "../data/site";
import { Reveal } from "./Reveal";

export function TechMarquee() {
  const [paused, setPaused] = useState(false);
  const track = [...site.technologies, ...site.technologies];
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="section tech-section" aria-label="Tecnologias">
      <div className="container">
        <Reveal>
          <p className="section-label">06 — Stack</p>
          <h2 className="section-title" style={{ maxWidth: "18ch" }}>
            Ferramentas que uso no dia a dia.
          </h2>
        </Reveal>
      </div>

      <div
        className={`marquee ${paused ? "is-paused" : ""}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        ref={ref}
      >
        <div className="marquee-track">
          {track.map((tech, i) => (
            <span key={`${tech}-${i}`} className="marquee-item">
              {tech}
              <i aria-hidden />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
