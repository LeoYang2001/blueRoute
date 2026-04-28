import { motion } from "framer-motion";

const PRINCIPLES = [
  {
    index: "01",
    title: "Crew-first operational philosophy",
    body: "Safety decisions always put crew wellbeing and vessel readiness first.",
  },
  {
    index: "02",
    title: "Structured safety management system",
    body: "Defined procedures, controls, and audits support consistent safe execution.",
  },
  {
    index: "03",
    title: "Professional maritime team",
    body: "Dedicated technical and marine professionals provide round-the-clock support.",
  },
  {
    index: "04",
    title: "Operational discipline and standards",
    body: "Clear standards and regular drills reinforce performance across the fleet.",
  },
];

const DIM = "rgba(17, 19, 24, 0.18)";

function HighlightWord({
  word,
  accent = false,
}: {
  word: string;
  accent?: boolean;
}) {
  return (
    <motion.span
      className="safetyGovWord"
      initial={{ color: DIM }}
      whileInView={{ color: accent ? "#ff6b35" : "#111318" }}
      viewport={{ once: false, amount: 1, margin: "0px 0px -22% 0px" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {word}{" "}
    </motion.span>
  );
}

function HighlightParagraph({
  text,
  accent = false,
  className,
}: {
  text: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <p className={className}>
      {text.split(" ").map((word, i) => (
        <HighlightWord key={i} word={word} accent={accent} />
      ))}
    </p>
  );
}

export default function SafetyGovernance() {
  return (
    <section className="safetyGovSection">
      <div className="safetyGovSection__inner">
        <motion.p
          className="safetyGovSection__eyebrow"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Safety &amp; Sustainability
        </motion.p>

        <motion.h1
          className="safetyGovSection__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.06 }}
        >
          Safety Governance
        </motion.h1>

        <div className="safetyGovSection__copy">
          <HighlightParagraph
            className="safetyGovSection__lead"
            text="Safety is the foundation of all operations."
          />
          <HighlightParagraph
            className="safetyGovSection__body"
            text="The company follows a crew-first philosophy supported by a structured management system and experienced maritime professionals to ensure safe and reliable operations across all vessels."
            accent
          />
        </div>

        <div className="safetyGovSection__cards">
          {PRINCIPLES.map((item, i) => (
            <motion.article
              key={item.index}
              className="safetyGovSection__card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
            >
              <span className="safetyGovSection__cardIndex">{item.index}</span>
              <h3 className="safetyGovSection__cardTitle">{item.title}</h3>
              <p className="safetyGovSection__cardBody">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
