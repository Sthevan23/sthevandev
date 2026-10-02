import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { featuredProject } from "../data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { Magnetic } from "./Magnetic";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useMedia";

export function Featured() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [80, -60]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [6, -4],
  );

  const project = featuredProject;

  return (
    <section ref={ref} className="section featured-section" id="destaque">
      <div className="container featured-grid">
        <div className="featured-copy">
          <Reveal>
            <p className="section-label">04 — Destaque</p>
            <h2 className="section-title">{project.name}</h2>
            <p className="section-subtitle" style={{ maxWidth: "36ch" }}>
              {project.description}
            </p>
            <ul className="tech-pills featured-tech">
              {project.technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <Magnetic>
              <a className="btn btn-primary" href="#projetos">
                Ver projetos <span className="btn-arrow">→</span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <motion.div className="featured-device" style={{ y, rotate }}>
          <div
            className="featured-laptop"
            style={{ ["--accent" as string]: project.accent }}
          >
            <div className="laptop-bezel">
              <div className="laptop-screen">
                <ProjectVisual project={project} />
              </div>
            </div>
            <div className="laptop-base" />
            <div className="laptop-shadow" />
            <div className="laptop-reflection" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
