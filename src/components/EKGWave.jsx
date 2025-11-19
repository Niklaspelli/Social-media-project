import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function PulseWave() {
  const controls = useAnimation();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500); // kort puls
    }, 2000); // puls varje 2 sekunder

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({
      d: pulse
        ? "M0,25 L40,25 L50,10 L60,25 L100,25 L150,25 L200,25" // våg i mitten
        : "M0,25 L200,25", // rak linje
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }, [pulse, controls]);

  return (
    <svg
      viewBox="0 0 200 50"
      preserveAspectRatio="none"
      width="100%"
      height="50"
    >
      <motion.path
        animate={controls}
        initial={{ d: "M0,25 L200,25" }}
        stroke="white"
        strokeWidth="2"
        fill="transparent"
      />
    </svg>
  );
}
