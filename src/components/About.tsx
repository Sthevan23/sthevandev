import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "../data/site";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useMedia";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setN(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="sobre" className="section about-section">
      <div className="container about-grid">
        <Reveal>
          <div className="about-visual">
            <img
              src="/avatar.jpg"
              alt={site.name}
              width={420}
              height={420}
              loading="lazy"
            />
            <div className="about-frame" aria-hidden />
          </div>
        </Reveal>

        <div className="about-copy">
          <Reveal delay={0.1}>
            <p className="section-label">07 — Sobre</p>
            <h2 className="section-title">{site.about.title}</h2>
            <p className="about-text">{site.about.text}</p>
          </Reveal>

          <div className="about-stats">
            {site.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <strong>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </strong>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
