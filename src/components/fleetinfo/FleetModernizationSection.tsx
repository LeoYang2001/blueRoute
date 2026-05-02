import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 } as const,
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
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

const DELAY = 0.15;

export default function FleetModernizationSection() {
  return (
    <section className="fleetSection fleetSection--modernization fleetModSection">
      <div className="fleetSection__inner fleetModSection__inner">
        {/* — Header — */}
        <div className="fleetModSection__header">
          <motion.p className="fleetSection__eyebrow" {...fadeUp(0)}>
            Fleet Modernization & Featured Assets
          </motion.p>
          <motion.h2 className="fleetModSection__headline" {...fadeUp(DELAY)}>
            Built for Performance.
            <br />
            Ready for Tomorrow.
          </motion.h2>
          <motion.p className="fleetModSection__sub" {...fadeUp(DELAY + 0.12)}>
            Our modernization strategy goes beyond adding vessels—it's about
            building smarter, cleaner, and more capable ships that lead the next
            generation of maritime energy transport.
          </motion.p>
        </div>

        {/* — Strategy pillars — */}
        <div className="fleetModPillars">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.index}
              className="fleetModPillar"
              {...fadeUp(DELAY + i * 0.1)}
            >
              <span className="fleetModPillar__index">{p.index}</span>
              <h4 className="fleetModPillar__label">{p.label}</h4>
              <p className="fleetModPillar__body">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* — Featured vessel — */}
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
              Featured Vessel
            </motion.span>
          </motion.div>

          <div className="fleetModFeatured__content">
            <motion.p
              className="fleetModFeatured__eyebrow"
              {...fadeUp(DELAY + 0.2)}
            >
              Delivered · March 2025
            </motion.p>
            <motion.h3
              className="fleetModFeatured__name"
              {...fadeUp(DELAY + 0.28)}
            >
              Tian Shu Xing
            </motion.h3>
            <motion.p
              className="fleetModFeatured__subtitle"
              {...fadeUp(DELAY + 0.34)}
            >
              50,000-ton Chemical Tanker · Lianyungang Wuzhou Shipbuilding
            </motion.p>
            <motion.p
              className="fleetModFeatured__desc"
              {...fadeUp(DELAY + 0.4)}
            >
              The largest chemical tanker ever built in Lianyungang,{" "}
              <em>Tian Shu Xing</em> represents the pinnacle of the company's
              fleet investment. Designed for premium chemical cargo, it sets a
              new benchmark for vessel scale and capability from China's coastal
              shipbuilding industry.
            </motion.p>

            <motion.div
              className="fleetModFeatured__specs"
              {...fadeUp(DELAY + 0.48)}
            >
              {[
                { label: "Propulsion", value: "Yuchai Marine 6S50ME" },
                {
                  label: "Engine Origin",
                  value:
                    "China's first domestic large-scale chemical tanker engine",
                },
                { label: "Deadweight", value: "50,000 tons" },
                { label: "Cargo Type", value: "Chemical Products" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="fleetModFeatured__spec"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: DELAY + 0.52 + i * 0.08,
                    ease: "easeOut",
                  }}
                >
                  <span className="fleetModFeatured__specLabel">{s.label}</span>
                  <span className="fleetModFeatured__specValue">{s.value}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
