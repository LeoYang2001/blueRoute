import { motion } from "framer-motion";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.6, ease: "easeOut" as const, delay: d },
});

export default function IntegratedCapabilities() {
  return (
    <section className="fleetSection fleetSection--modernization">
      <div className="fleetSection__inner">
        <motion.p className="fleetSection__eyebrow" {...fadeUp(0)}>
          Capabilities
        </motion.p>
        <motion.h2 {...fadeUp(0.06)}>
          Integrated Capabilities & Advantages
        </motion.h2>
        <motion.p {...fadeUp(0.12)}>
          Placeholder: integrated services (shipbuilding, technical ops, digital
          management) and competitive advantages. Replace with PPT content when
          ready.
        </motion.p>
      </div>
    </section>
  );
}
