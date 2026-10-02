import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsMobile, useReducedMotion } from "../hooks/useMedia";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
} & HTMLMotionProps<"div">;

export function Magnetic({
  children,
  strength = 0.28,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const mobile = useIsMobile();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 180, damping: 18, mass: 0.3 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || mobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className ? `magnetic ${className}` : "magnetic"}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
