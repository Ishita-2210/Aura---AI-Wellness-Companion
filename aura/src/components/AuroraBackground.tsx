import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function AuroraBackground() {
  const [mounted, setMounted] = useState(false);

  // Smooth springs for mouse translation
  const springConfig = { damping: 30, stiffness: 80 };
  const mouseXSpring = useSpring(0, springConfig);
  const mouseYSpring = useSpring(0, springConfig);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      
      // Update Tailwind CSS Variables on root element for dynamic mouse sheen glare
      document.documentElement.style.setProperty("--mouse-x", `${clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${clientY}px`);

      // Update Spring values for heavy smooth background translated elements
      const targetX = (clientX / window.innerWidth - 0.5) * 60;
      const targetY = (clientY / window.innerHeight - 0.5) * 60;
      mouseXSpring.set(targetX);
      mouseYSpring.set(targetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseXSpring, mouseYSpring]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20 bg-[#FAF8F6] dark:bg-[#07050F] transition-colors duration-1000">
      
      {/* Dynamic Interactive Mouse Glow Spotlight Layer */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-75 mix-blend-screen select-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(191,169,255,0.12), transparent 80%)`
        }}
      />

      {/* Decorative High Fidelity Spatial Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(191,169,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(191,169,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] dark:opacity-60" />
      
      {/* Luxury Concentric Circular Ripple lines mimicking spatial camera sensors */}
      <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[800px] h-[800px] rounded-full border border-[#BFA9FF]/5 dark:border-[#BFA9FF]/3 pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[1200px] h-[1200px] rounded-full border border-dotted border-[#BFA9FF]/4 dark:border-[#BFA9FF]/2" />

      {/* Aurora Ambient Heavy Morphing Blobs */}
      <motion.div
        style={{ x: mouseXSpring, y: mouseYSpring }}
        className="absolute top-[-15%] left-[-15%] w-[75vw] h-[75vw] rounded-full bg-[#FFD6E7]/30 dark:bg-[#341121]/30 blur-[130px] animate-mesh-pulse-1 mix-blend-multiply dark:mix-blend-color-dodge opacity-60 dark:opacity-75"
      />

      <motion.div
        style={{
          x: mouseXSpring,
          y: mouseYSpring,
          scale: 1.15
        }}
        className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-[#DCCBFF]/40 dark:bg-[#1E113C]/45 blur-[140px] animate-mesh-pulse-2 mix-blend-multiply dark:mix-blend-color-dodge opacity-60 dark:opacity-80"
      />

      <motion.div
        style={{
          x: mouseXSpring,
          y: mouseYSpring
        }}
        className="absolute top-[25%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#CDEBFF]/35 dark:bg-[#0E2849]/35 blur-[120px] animate-mesh-pulse-3 mix-blend-multiply dark:mix-blend-color-dodge opacity-50 dark:opacity-70"
      />

      <motion.div
        style={{ x: mouseXSpring, y: mouseYSpring }}
        className="absolute top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-orange-100/25 dark:bg-[#361A1D]/25 blur-[110px] animate-mesh-pulse-1 opacity-40 dark:opacity-50"
      />

      {/* Beautiful Multi-Layered Floating Sparkles and Dust Mote Particles */}
      <div className="absolute inset-0">
        {[
          { size: "w-2 h-2", delay: 0, x: "left-[15%]", dur: "18s" },
          { size: "w-1.5 h-1.5", delay: 2, x: "left-[28%]", dur: "22s" },
          { size: "w-2.5 h-2.5", delay: 4, x: "left-[42%]", dur: "14s" },
          { size: "w-1 h-1", delay: 6, x: "left-[57%]", dur: "26s" },
          { size: "w-2 h-2", delay: 1.5, x: "left-[73%]", dur: "19s" },
          { size: "w-1.5 h-1.5", delay: 3.5, x: "left-[87%]", dur: "25s" },
          { size: "w-3 h-3", delay: 5.5, x: "left-[94%]", dur: "16s" },
          { size: "w-2 h-2", delay: 7.5, x: "left-[5%]", dur: "21s" },
          { size: "w-1.5 h-1.5", delay: 8.5, x: "left-[50%]", dur: "23s" },
          { size: "w-2 h-2", delay: 10, x: "left-[65%]", dur: "17s" },
        ].map((particle, idx) => (
          <div
            key={idx}
            className={`absolute ${particle.x} top-[105%] pointer-events-none select-none`}
            style={{
              animation: `float-particle ${particle.dur} infinite ease-in-out`,
              animationDelay: `${particle.delay}s`
            }}
          >
            <div className={`${particle.size} rounded-full bg-gradient-to-tr from-[#BFA9FF] to-[#FFD6E7] dark:from-[#DCCBFF] dark:to-[#CDEBFF] opacity-35 dark:opacity-60 blur-[1px]`} />
          </div>
        ))}
      </div>

    </div>
  );
}
