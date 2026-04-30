import { motion } from "framer-motion";

type SafetyCardIconKind = "crew" | "system" | "team" | "standards";

const PRINCIPLES: Array<{
  index: string;
  title: string;
  body: string;
  icon: SafetyCardIconKind;
}> = [
  {
    index: "01",
    title: "Crew-first operational philosophy",
    body: "Safety decisions always put crew wellbeing and vessel readiness first.",
    icon: "crew",
  },
  {
    index: "02",
    title: "Structured safety management system",
    body: "Defined procedures, controls, and audits support consistent safe execution.",
    icon: "system",
  },
  {
    index: "03",
    title: "Professional maritime team",
    body: "Dedicated technical and marine professionals provide round-the-clock support.",
    icon: "team",
  },
  {
    index: "04",
    title: "Operational discipline and standards",
    body: "Clear standards and regular drills reinforce performance across the fleet.",
    icon: "standards",
  },
];

const DIM = "rgba(17, 19, 24, 0.18)";

function SafetyCardIcon({ kind }: { kind: SafetyCardIconKind }) {
  if (kind === "crew") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path
          d="M32 33c7.18 0 13-5.82 13-13S39.18 7 32 7 19 12.82 19 20s5.82 13 13 13Z"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M13 53.5c2.72-8.18 10.09-13 19-13s16.28 4.82 19 13"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M15 23h-5m44 0h-5M32 2v5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (kind === "system") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect
          x="12"
          y="11"
          width="40"
          height="42"
          rx="6"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M22 22h20M22 31h20M22 40h12"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="m40.5 42 4 4 8-9"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "team") {
    return (
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="22" r="8" stroke="currentColor" strokeWidth="2.4" />
        <circle
          cx="16"
          cy="28"
          r="5.5"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <circle
          cx="48"
          cy="28"
          r="5.5"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path
          d="M22 51c1.52-6.08 5.58-10 10-10s8.48 3.92 10 10M6 49c1.4-4.75 4.4-7.5 8.5-7.5 2.13 0 4.12.74 5.84 2.11M43.66 43.61c1.72-1.37 3.71-2.11 5.84-2.11 4.1 0 7.1 2.75 8.5 7.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M20 17h24l6 8-18 22L14 25l6-8Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M24 25h16M32 17v30"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="m26 38 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          <motion.p
            className="safetyEnvSection__intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Safety is the foundation of all operations.
          </motion.p>
        </div>

        <div>
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
              <div className="safetyGovSection__cardHeader">
                <span className="safetyGovSection__cardIndex">
                  {item.index}
                </span>
                <span className="safetyGovSection__cardIcon" aria-hidden="true">
                  <SafetyCardIcon kind={item.icon} />
                </span>
              </div>

              <div className="safetyGovSection__cardContent">
                <h3 className="safetyGovSection__cardTitle">{item.title}</h3>
                <p className="safetyGovSection__cardBody">{item.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
