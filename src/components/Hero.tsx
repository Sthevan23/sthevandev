import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { site, contactHref } from "../data/site";
import { heroProject } from "../data/projects";
import { Magnetic } from "./Magnetic";
import { ProjectVisual } from "./ProjectVisual";
import { useIsMobile, useReducedMotion } from "../hooks/useMedia";

export function Hero() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const stageRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 60, damping: 18 });
  const sry = useSpring(ry, { stiffness: 60, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || mobile || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    rx.set(ny);
    ry.set(-nx);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const enter = reduced
    ? undefined
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section id="topo" className="hero">
      <div className="hero-glow" aria-hidden />
      <div className="particles" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ ["--i" as string]: i }} />
        ))}
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.p
            className="section-label"
            {...enter}
            transition={{ duration: 0.8, delay: 0.05 }}
          >
            {site.name} · Full-stack
          </motion.p>

          <motion.h1
            className="hero-title"
            {...enter}
            transition={{ duration: 0.95, delay: 0.12 }}
          >
            {site.hero.title}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            {...enter}
            transition={{ duration: 0.9, delay: 0.22 }}
          >
            {site.hero.subtitle}
          </motion.p>

          <motion.div
            className="hero-actions"
            {...enter}
            transition={{ duration: 0.85, delay: 0.32 }}
          >
            <Magnetic>
              <a className="btn btn-primary" href="#projetos">
                Ver projetos
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={contactHref()}>
                Entrar em contato
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="hero-stage hero-stage-single"
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{
            rotateX: srx,
            rotateY: sry,
            transformPerspective: 1200,
          }}
          {...enter}
          transition={{ duration: 1, delay: 0.28 }}
        >
          <motion.div
            className="hero-laptop"
            style={{ ["--accent" as string]: heroProject.accent }}
            animate={reduced ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="hero-laptop-bezel">
              <div className="hero-laptop-screen">
                <ProjectVisual project={heroProject} />
              </div>
            </div>
            <div className="hero-laptop-base" />
            <div className="hero-laptop-shadow" />
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-scroll" aria-hidden>
        <span>Scroll</span>
        <i />
      </div>
    </section>
  );
}
