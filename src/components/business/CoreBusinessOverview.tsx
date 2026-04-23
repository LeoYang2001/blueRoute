import { motion } from "framer-motion";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.6, ease: "easeOut" as const, delay: d },
});

export default function CoreBusinessOverview() {
  return (
    <section className="fleetSection fleetSection--overview">
      <div className="fleetSection__inner">
        <motion.p className="fleetSection__eyebrow" {...fadeUp(0)}>
          Business
        </motion.p>
        <motion.h1 {...fadeUp(0.06)}>Core Business Overview</motion.h1>
        <motion.p {...fadeUp(0.12)}>
          Placeholder: summary of core trading, energy transport, and commercial
          positioning. Replace with real copy and imagery.
        </motion.p>
      </div>
    </section>
  );
}
