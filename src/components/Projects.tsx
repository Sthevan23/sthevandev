import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { projects, type Project } from "../data/projects";
import { ProjectVisual } from "./ProjectVisual";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useMedia";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduced = useReducedMotion();

  const media = (
    <div className="project-media">
      <motion.div
        className="project-media-inner"
        initial={reduced ? false : { opacity: 0.6, scale: 1.04 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{
          duration: 0.8,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <ProjectVisual project={project} />
      </motion.div>
      <div className="project-overlay" />
    </div>
  );

  const meta = (
    <div className="project-meta">
      <div className="project-meta-top">
        <h3>{project.name}</h3>
        <span className="project-cat">{project.category}</span>
      </div>
      <p>{project.description}</p>
      <ul className="tech-pills" aria-label="Tecnologias">
        {project.technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      {project.href && (
        <span className="project-cta">
          Ver projeto <span className="btn-arrow" aria-hidden>
            →
          </span>
        </span>
      )}
    </div>
  );

  return (
    <motion.article
      ref={ref}
      className={`project-card size-${project.size}`}
      style={{ ["--accent" as string]: project.accent }}
      initial={reduced ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.7,
        delay: reduced ? 0 : index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {project.href ? (
        <a
          className="project-link"
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          {media}
          {meta}
        </a>
      ) : (
        <div className="project-link">
          {media}
          {meta}
        </div>
      )}
    </motion.article>
  );
}

export function Projects() {
  return (
    <section id="projetos" className="section projects-section">
      <div className="container">
        <Reveal>
          <p className="section-label">03 — Projetos</p>
          <h2 className="section-title">Projetos que saíram do papel.</h2>
          <p className="section-subtitle">
            Uma seleção de projetos desenvolvidos para diferentes negócios e
            necessidades.
          </p>
        </Reveal>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
