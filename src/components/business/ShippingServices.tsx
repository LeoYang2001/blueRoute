import { motion } from "framer-motion";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.6, ease: "easeOut" as const, delay: d },
});

export default function ShippingServices() {
  return (
    <section className="fleetSection fleetSection--expansion">
      <div className="fleetSection__inner">
        <motion.p className="fleetSection__eyebrow" {...fadeUp(0)}>
          Shipping Services
        </motion.p>
        <motion.h2 {...fadeUp(0.06)}>
          Shipping Services & Market Reach
        </motion.h2>
        <motion.p {...fadeUp(0.12)}>
          Placeholder: services offered, trade lanes, market footprint, and
          service capabilities. Swap for finalized content.
        </motion.p>
      </div>
    </section>
  );
}
