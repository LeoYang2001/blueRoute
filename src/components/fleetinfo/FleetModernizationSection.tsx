import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1] as const,
    delay,
  },
});

const PILLARS = [
  {
    index: "01",
    label: "Energy-Efficient Newbuilds",
    body: "10 MR-type tankers on order, designed with advanced energy-saving technologies to reduce fuel consumption and cut pollutant emissions.",
  },
  {
    index: "02",
    label: "Intelligent Shipbuilding",
    body: "Smart management systems across navigation monitoring, engine control, cargo handling, and safety—raising operational efficiency across the fleet.",
  },
  {
    index: "03",
    label: "New Energy Exploration",
    body: "Active R&D and pilot projects in LNG, hydrogen fuel, battery power, and alternative maritime energy sources to future-proof the fleet.",
  },
  {
    index: "04",
    label: "High-Value Vessel Strategy",
    body: "Focused investment in high-performance oil/chemical carriers and high-value bulk vessels, optimizing fleet structure and long-term competitiveness.",
  },
];

const SPECS = [
  { label: "Propulsion", value: "Yuchai Marine 6S50ME" },
  {
    label: "Engine Origin",
    value: "China's first domestic large-scale chemical tanker engine",
  },
  { label: "Deadweight", value: "50,000 tons" },
  { label: "Cargo Type", value: "Chemical Products" },
];

const DELAY = 0.15;

export default function FleetModernizationSection() {
  return (
    <section className="fleetSection fleetSection--modernization fleetModSection">
      <div className="fleetSection__inner fleetModSection__inner">
        {/* ─── Chapter index ───
            Small editorial marker at the top: section number + rule + label.
            Gives the section a "Chapter 03" feel and aligns with the rest
            of the page's narrative rhythm. */}
        <motion.div className="fleetModSection__chapter" {...fadeUp(0)}>
          <span className="fleetModSection__chapterNum">03</span>
          <span className="fleetModSection__chapterRule" aria-hidden="true" />
          <span className="fleetModSection__chapterLabel">Modernization</span>
        </motion.div>

        {/* ─── Header ─── */}
        <div className="fleetModSection__header">
          <motion.p className="fleetSection__eyebrow" {...fadeUp(0.08)}>
            Fleet Modernization &amp; Featured Assets
          </motion.p>
          <motion.h2
            className="fleetModSection__headline"
            {...fadeUp(DELAY)}
          >
            Built for Performance.
            <br />
            Ready for Tomorrow.
          </motion.h2>
          <motion.p
            className="fleetModSection__sub"
            {...fadeUp(DELAY + 0.12)}
          >
            Our modernization strategy goes beyond adding vessels—it&apos;s
            about building smarter, cleaner, and more capable ships that lead
            the next generation of maritime energy transport.
          </motion.p>
        </div>

        {/* ─── Strategy pillars ─── */}
        <div className="fleetModBlock">
          <motion.header className="fleetModBlock__header" {...fadeUp(0)}>
            <span className="fleetModBlock__label">Strategy Pillars</span>
            <span
              className="fleetModBlock__divider"
              aria-hidden="true"
            />
            <span className="fleetModBlock__count">04 Priorities</span>
          </motion.header>

          <div className="fleetModPillars">
            {PILLARS.map((p, i) => (
              <motion.article
                key={p.index}
                className="fleetModPillar"
                {...fadeUp(DELAY + i * 0.08)}
              >
                {/* Decorative oversized index sitting in the card's
                    background — adds visual interest without crowding
                    the text content. Hidden from assistive tech. */}
                <span
                  className="fleetModPillar__indexBg"
                  aria-hidden="true"
                >
                  {p.index}
                </span>
                <span className="fleetModPillar__index">{p.index}</span>
                <h4 className="fleetModPillar__label">{p.label}</h4>
                <p className="fleetModPillar__body">{p.body}</p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ─── Featured vessel ─── */}
        <div className="fleetModBlock">
          <motion.header className="fleetModBlock__header" {...fadeUp(0)}>
            <span className="fleetModBlock__label">Featured Vessel</span>
            <span
              className="fleetModBlock__divider"
              aria-hidden="true"
            />
            <span className="fleetModBlock__count">
              Delivered · March 2025
            </span>
          </motion.header>

          <div className="fleetModFeatured">
            <motion.div
              className="fleetModFeatured__image"
              {...fadeUp(DELAY + 0.1)}
            >
              <img
                src="/pictures/ship_4.png"
                alt="Tian Shu Xing chemical tanker"
              />
              <motion.span
                className="fleetModFeatured__badge"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: DELAY + 0.4,
                  ease: "easeOut",
                }}
              >
                <span className="fleetModFeatured__badgeDot" aria-hidden="true" />
                Newly Delivered
              </motion.span>
            </motion.div>

            <div className="fleetModFeatured__content">
              <motion.h3
                className="fleetModFeatured__name"
                {...fadeUp(DELAY + 0.2)}
              >
                Tian Shu Xing
              </motion.h3>
              <motion.p
                className="fleetModFeatured__subtitle"
                {...fadeUp(DELAY + 0.28)}
              >
                50,000-ton Chemical Tanker · Lianyungang Wuzhou Shipbuilding
              </motion.p>
              <motion.p
                className="fleetModFeatured__desc"
                {...fadeUp(DELAY + 0.36)}
              >
                The largest chemical tanker ever built in Lianyungang,{" "}
                <em>Tian Shu Xing</em> represents the pinnacle of the
                company&apos;s fleet investment. Designed for premium
                chemical cargo, it sets a new benchmark for vessel scale and
                capability from China&apos;s coastal shipbuilding industry.
              </motion.p>

              <motion.dl
                className="fleetModFeatured__specs"
                {...fadeUp(DELAY + 0.44)}
              >
                {SPECS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="fleetModFeatured__spec"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.45,
                      delay: DELAY + 0.5 + i * 0.07,
                      ease: "easeOut",
                    }}
                  >
                    <dt className="fleetModFeatured__specLabel">{s.label}</dt>
                    {/* Dotted leader between label and value — editorial
                        spec-sheet feel. */}
                    <span
                      className="fleetModFeatured__specLeader"
                      aria-hidden="true"
                    />
                    <dd className="fleetModFeatured__specValue">{s.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
