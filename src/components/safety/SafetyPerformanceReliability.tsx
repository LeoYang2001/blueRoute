import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const STATS = [
  { start: 38, label: "Casualty" },
  { start: 52, label: "Pollution" },
  { start: 27, label: "Accident" },
];

function CountDown({ from }: { from: number }) {
  const [display, setDisplay] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, 0, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, from]);

  return (
    <span ref={ref} className="safetyPerfSection__statValue">
      {display}
    </span>
  );
}

const DIM = "rgba(17, 19, 24, 0.18)";

function HighlightWord({ word }: { word: string }) {
  return (
    <motion.span
      className="safetyPerfWord"
      initial={{ color: DIM }}
      whileInView={{ color: "#ff6b35" }}
      viewport={{ once: false, amount: 1, margin: "0px 0px -22% 0px" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {word}{" "}
    </motion.span>
  );
}

export default function SafetyPerformanceReliability() {
  return (
    <section className="safetyPerfSection">
      <div className="safetyPerfSection__inner">
        <motion.p
          className="safetyPerfSection__eyebrow"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Safety Performance
        </motion.p>

        <motion.h2
          className="safetyPerfSection__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
        >
          Operational Safety Record
        </motion.h2>

        <div className="safetyPerfSection__stats">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="safetyPerfSection__stat"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.65, ease: "easeOut", delay: i * 0.12 }}
            >
              <CountDown from={stat.start} />
              <span className="safetyPerfSection__statLabel">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        <p className="safetyPerfSection__body">
          {"Through strict operational standards and continuous monitoring, the company maintains a strong safety record, achieving zero casualty, zero pollution, and zero accident performance across its fleet operations."
            .split(" ")
            .map((word, i) => (
              <HighlightWord key={i} word={word} />
            ))}
        </p>
      </div>
    </section>
  );
}
