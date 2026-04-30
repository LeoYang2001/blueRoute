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
    <section className="bg-[#06080d] px-6 py-24 md:px-[7vw] md:py-30">
      <div className="mx-auto w-full max-w-350">
        <motion.p
          className="mt-24 max-w-[68ch] text-[1rem] leading-[1.68] text-[rgba(255,255,255,0.66)]"
          {...fadeUp(0.1)}
        >
          We deliver efficient and reliable shipping solutions tailored to
          client needs through strong teams, advanced technology, and
          performance-focused operations.
        </motion.p>

        <motion.div
          className="mt-9 grid gap-px rounded-[18px] bg-[rgba(255,255,255,0.08)] sm:grid-cols-2 lg:grid-cols-3 xl:hidden"
          variants={cardGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {CAPABILITIES.map((item) => (
            <motion.article
              key={item.index}
              className="group min-h-45 bg-[rgba(23,25,31,0.92)] p-5 transition-colors duration-200 hover:bg-[#ff6b35]"
              variants={cardItem}
            >
              <span className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[rgba(255,107,53,0.85)] group-hover:text-white/85">
                {item.index}
              </span>
              <h3 className="m-0 text-[0.98rem] font-semibold leading-[1.3] tracking-[-0.01em] text-white group-hover:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.84rem] leading-[1.58] text-[rgba(255,255,255,0.68)] group-hover:text-white/85">
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
