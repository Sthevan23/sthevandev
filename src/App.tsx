import { useEffect } from "react";
import Lenis from "lenis";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Projects } from "./components/Projects";
import { Featured } from "./components/Featured";
import { Services } from "./components/Services";
import { TechMarquee } from "./components/TechMarquee";
import { About } from "./components/About";
import { Process } from "./components/Process";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";
import { CursorLayer } from "./components/CursorEffects";
import { useReducedMotion, useIsMobile } from "./hooks/useMedia";

export default function App() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();

  useEffect(() => {
    if (reduced || mobile) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchor = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };

    document.addEventListener("click", onAnchor);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchor);
      lenis.destroy();
    };
  }, [reduced, mobile]);

  return (
    <>
      <CursorLayer />
      <Header />
      <main>
        <Hero />
        <hr className="divider" />
        <Services />
        <Projects />
        <Featured />
        <Process />
        <TechMarquee />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
