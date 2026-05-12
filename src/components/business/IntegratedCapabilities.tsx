import { motion } from "framer-motion";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.6, ease: "easeOut" as const, delay: d },
});

const CAPABILITIES = [
  {
    index: "01",
    title: "Professional Team",
    body: "Experienced maritime and technical specialists delivering disciplined execution across operations.",
  },
  {
    index: "02",
    title: "Advanced Technology",
    body: "Data-informed vessel management and modern operational systems to improve safety and performance.",
  },
  {
    index: "03",
    title: "Extensive Routes",
    body: "Broad regional and international coverage connecting key energy and petrochemical trade corridors.",
  },
  {
    index: "04",
    title: "Quality Service",
    body: "Client-focused support and responsive execution with reliability built into every shipment.",
  },
  {
    index: "05",
    title: "Operational Efficiency",
    body: "Streamlined workflows that reduce downtime and support cost-effective, dependable delivery.",
  },
  {
    index: "06",
    title: "Fleet Optimization",
    body: "Optimized fleet deployment and voyage planning tailored to customer requirements and market demand.",
  },
];

const DESKTOP_SLOTS: Array<number | "intro" | null> = [
  0,
  null,
  1,
  null,
  null,
  2,
  null,
  3,
  4,
  null,
  5,
  null,
];

const cardGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" as const },
  },
};

export default function IntegratedCapabilities() {
  return (
    // Top padding (pt-28) on mobile is deliberately generous: the previous
    // section's orange "Capabilities" card uses translate-y-1/2 and laps over
    // ~80px into the top of this section. Without that clearance, the
    // chapter index + headline render *underneath* the orange card.
    // `overflow-x-clip` guards against any oversized card-grid element
    // pushing the page wider than viewport.
    <section className="bg-[#06080d] overflow-x-clip px-5 pt-28 pb-14 md:px-[7vw] md:py-30">
      <div className="mx-auto w-full max-w-350">
        {/* Mobile-only chapter marker — keeps the visual rhythm across all
            Business sections (01 — Overview, 02 — Capabilities, etc.). */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#ff6b35] md:hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span>03</span>
          <span className="block h-px w-5 bg-[rgba(255,107,53,0.5)]" />
          <span className="text-[rgba(255,255,255,0.55)]">Why choose us</span>
        </motion.div>

        {/* Mobile-only headline so the section opens with a clear h2 instead
            of jumping straight to the supporting paragraph. Hidden on desktop
            where the parallax showcase above already provides the heading. */}
        <motion.h2
          className="mb-5 max-w-[14ch] text-[2rem] font-medium leading-[1.04] tracking-[-0.025em] text-white md:hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Six pillars of operational excellence.
        </motion.h2>

        <motion.p
          // `break-words` lets long words wrap mid-character if the column
          // is too narrow (e.g. on a 360px viewport with 1.25rem gutters).
          // Slightly smaller mobile font/leading so the paragraph fits the
          // narrow column without clipping at the right edge.
          className="mt-2 max-w-[68ch] break-words text-[0.9rem] leading-[1.55] text-[rgba(255,255,255,0.66)] md:mt-24 md:text-[1rem] md:leading-[1.68]"
          {...fadeUp(0.1)}
        >
          We deliver efficient and reliable shipping solutions tailored to
          client needs through strong teams, advanced technology, and
          performance-focused operations.
        </motion.p>

        <motion.div
          className="mt-7 grid gap-px overflow-hidden rounded-[14px] bg-[rgba(255,255,255,0.08)] sm:grid-cols-2 sm:rounded-[18px] lg:grid-cols-3 xl:hidden"
          variants={cardGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CAPABILITIES.map((item) => (
            <motion.article
              key={item.index}
              className="group relative overflow-hidden bg-[rgba(23,25,31,0.92)] p-5 transition-colors duration-200 hover:bg-[#ff6b35] sm:min-h-45"
              variants={cardItem}
            >
              {/* Oversized background index — mirrors the FleetModernization
                  pillars treatment for visual consistency across sections. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1 right-2 select-none text-[3.2rem] font-medium leading-none tracking-[-0.04em] text-[rgba(255,107,53,0.07)] transition-colors duration-200 group-hover:text-[rgba(255,255,255,0.18)]"
              >
                {item.index}
              </span>
              <span className="relative mb-2 block text-[0.66rem] font-medium uppercase tracking-[0.18em] text-[rgba(255,107,53,0.85)] group-hover:text-white/85">
                {item.index}
              </span>
              <h3 className="relative m-0 text-[1rem] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
                {item.title}
              </h3>
              <p className="relative mt-2 text-[0.85rem] leading-[1.55] text-[rgba(255,255,255,0.7)] group-hover:text-white/85">
                {item.body}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-9 hidden grid-cols-4 gap-px overflow-hidden rounded-[18px] bg-[rgba(255,255,255,0.08)] xl:grid"
          variants={cardGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {DESKTOP_SLOTS.map((slot, i) => {
            if (slot === null) {
              return (
                <motion.div
                  key={`empty-${i}`}
                  className="min-h-56 bg-[#05070b]"
                  variants={cardItem}
                />
              );
            }

            if (slot === "intro") {
              return (
                <motion.article
                  key="intro"
                  className="min-h-56 bg-[#ff4d25] p-6"
                  variants={cardItem}
                >
                  <h3 className="m-0 max-w-[8ch] text-5xl font-semibold leading-[0.95] tracking-[-0.03em] text-white">
                    Why choose us
                  </h3>
                </motion.article>
              );
            }

            const item = CAPABILITIES[slot];
            return (
              <motion.article
                key={item.index}
                className="group min-h-56 bg-[rgba(25,27,33,0.96)] p-6 transition-colors duration-200 hover:bg-[#ff6b35]"
                variants={cardItem}
              >
                <span className="mb-3 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[rgba(255,107,53,0.88)] group-hover:text-white/85">
                  {item.index}
                </span>
                <h3 className="m-0 text-[1.8rem] font-medium leading-[1.03] tracking-[-0.03em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[23ch] text-[0.88rem] leading-[1.58] text-[rgba(255,255,255,0.72)] group-hover:text-white/88">
                  {item.body}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
