import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useEffect } from "react";
import { useIsMobile, useReducedMotion } from "../hooks/useMedia";

/** Um único listener de mouse compartilhado pelo spotlight + cursor. */
function useSharedMouse(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 140, damping: 28, mass: 0.35 });
  const smoothY = useSpring(y, { stiffness: 140, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  return { smoothX, smoothY };
}

export function CursorLayer() {
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const enabled = !reduced && !mobile;
  const { smoothX, smoothY } = useSharedMouse(enabled);

  useEffect(() => {
    if (!enabled) return;
    const cursor = document.querySelector(".custom-cursor");
    if (!cursor) return;

    const show = () => cursor.classList.add("visible");
    const hide = () => cursor.classList.remove("visible");
    const enter = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, .project-card, .service-row")) {
        cursor.classList.add("hovering");
      }
    };
    const leave = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, .project-card, .service-row")) {
        cursor.classList.remove("hovering");
      }
    };

    window.addEventListener("mouseenter", show);
    window.addEventListener("mouseleave", hide);
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    show();

    return () => {
      window.removeEventListener("mouseenter", show);
      window.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const background = useMotionTemplate`radial-gradient(420px circle at ${smoothX}px ${smoothY}px, rgba(158, 197, 232, 0.1), transparent 42%)`;

  return (
    <>
      <motion.div
        className="spotlight"
        style={{ background }}
        aria-hidden
      />
      <motion.div
        className="custom-cursor visible"
        style={{ left: smoothX, top: smoothY }}
        aria-hidden
      />
    </>
  );
}
