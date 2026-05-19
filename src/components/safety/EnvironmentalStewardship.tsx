import { motion } from "framer-motion";

const PILLARS = [
  {
    index: "01",
    title: "Energy-Efficient Fleet",
    body: "Development of MR tankers with advanced energy-saving technologies designed for reduced fuel consumption.",
  },
  {
    index: "02",
    title: "Low-Emission Operations",
    body: "Focus on reducing fuel consumption and emissions across all fleet operations through optimised routing and management.",
  },
  {
    index: "03",
    title: "Pollution Prevention",
    body: "Strict environmental controls and procedures to prevent marine pollution across every voyage.",
  },
  {
    index: "04",
    title: "Future Energy Exploration",
    body: "Active research and investment into LNG, hydrogen, and alternative energy-powered vessels.",
  },
];

export default function EnvironmentalStewardship() {
  return (
    <section className="safetyEnvSection">
      <div className="safetyEnvSection__inner">
        {/* Mobile-only chapter marker. */}
        <motion.div
          className="safetyEnvSection__chapter md:hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="safetyEnvSection__chapterNum">03</span>
          <span
            className="safetyEnvSection__chapterRule"
            aria-hidden="true"
          />
          <span className="safetyEnvSection__chapterLabel">Environment</span>
        </motion.div>

        <motion.p
          className="safetyEnvSection__eyebrow"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Environment
        </motion.p>

        <motion.h2
          className="safetyEnvSection__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
        >
          Environmental Stewardship
        </motion.h2>

        <motion.p
          className="safetyEnvSection__intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          The company is committed to reducing environmental impact through
          energy-efficient vessel design, low-emission technologies, and
          continuous investment in sustainable maritime solutions.
        </motion.p>

        <div className="safetyEnvSection__pillars">
          {PILLARS.map((item, i) => (
            <motion.article
              key={item.index}
              className="safetyEnvSection__pillar"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
            >
              <span className="safetyEnvSection__pillarIndex">
                {item.index}
              </span>
              <h3 className="safetyEnvSection__pillarTitle">{item.title}</h3>
              <p className="safetyEnvSection__pillarBody">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
