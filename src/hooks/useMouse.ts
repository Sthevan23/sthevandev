import {
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useEffect } from "react";

export function useMousePosition(enabled = true) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  return { x, y, smoothX, smoothY };
}

export function useParallaxOffset(
  mouseX: MotionValue<number>,
  mouseY: MotionValue<number>,
  strength = 12,
) {
  const ox = useSpring(0, { stiffness: 80, damping: 20 });
  const oy = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const unsubX = mouseX.on("change", (v) => {
      const nx = (v / window.innerWidth - 0.5) * strength;
      ox.set(nx);
    });
    const unsubY = mouseY.on("change", (v) => {
      const ny = (v / window.innerHeight - 0.5) * strength;
      oy.set(ny);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, ox, oy, strength]);

  return { ox, oy };
}
