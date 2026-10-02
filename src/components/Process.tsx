import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "../data/site";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useMedia";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 40%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
  });
  const height = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section process-section" id="processo">
      <div className="container">
        <Reveal>
          <p className="section-label">05 — Processo</p>
          <h2 className="section-title">Como o trabalho acontece.</h2>
        </Reveal>

        <div className="process-timeline" ref={ref}>
          <div className="process-line" aria-hidden>
            <motion.div
              className="process-line-fill"
              style={{ height: reduced ? "100%" : height }}
            />
          </div>

          <ol className="process-steps">
            {site.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05} y={40}>
                <li className="process-step">
                  <span className="process-dot" aria-hidden />
                  <span className="process-num">{step.step}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
