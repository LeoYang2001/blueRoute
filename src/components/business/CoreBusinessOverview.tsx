import { useRef, useState } from "react";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const DESC_DIM = "rgba(17,19,24,0.28)";
const DESC_ACTIVE = "#ff6b35";

function DescriptionWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / Math.max(total, 1)) * 0.9;
  const end = Math.min(start + 0.14, 1);
  const color = useTransform(progress, [start, end], [DESC_DIM, DESC_ACTIVE]);

  return <motion.span style={{ color }}>{word} </motion.span>;
}

function HighlightDescription({
  text,
  progress,
}: {
  text: string;
  progress: MotionValue<number>;
}) {
  const words = text.split(" ");

  return (
    <p className="mt-6 max-w-[58ch] text-[0.98rem] leading-[1.65] md:text-[1.05rem]">
      {words.map((word, i) => (
        <DescriptionWord
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={progress}
        />
      ))}
    </p>
  );
}

export default function CoreBusinessOverview() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const TITLE_LIST = [
    {
      title: "Oil & Chemical Tanker Operations",
      description:
        "Reliable transportation of crude oil, refined petroleum products, LNG, and fuel oil through a modern tanker fleet serving major global energy markets.",
    },
    {
      title: "Bulk Shipping Expansion",
      description:
        "Strategic expansion into dry bulk transportation, supported by mineral shipping opportunities and planned development of Cape-size bulk carriers.",
    },
    {
      title: "Gas Carrier Development",
      description:
        "Entering the LNG segment with initial carrier acquisition and advancing toward broader LNG and LPG fleet development.",
    },
  ];

  const [title, setTitle] = useState(TITLE_LIST[0]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ✅ Handle state updates here (NOT inside useTransform)
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.24) {
      setTitle(TITLE_LIST[0]);
    } else if (v < 0.62) {
      setTitle(TITLE_LIST[1]);
    } else {
      setTitle(TITLE_LIST[2]);
    }
  });

  // ✅ Pure transform only
  const shipX = useTransform(scrollYProgress, (v) => {
    return `${120 - 500 * v}%`;
  });

  const ship2X = useTransform(scrollYProgress, (v) => {
    return `${300 - 500 * v}%`;
  });

  const descriptionProgress = useTransform(scrollYProgress, (v) => {
    if (v < 0.24) return v / 0.24;
    if (v < 0.62) return (v - 0.24) / 0.38;
    return (v - 0.62) / 0.38;
  });

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-[#f1f0ec]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_46%,rgba(255,255,255,0.55),rgba(241,240,236,0)_48%)]" />

        <div className="relative z-10 flex h-full items-center px-6 md:px-[7vw]">
          <div className="max-w-245">
            <p className="mb-5 text-[0.75rem] uppercase tracking-[0.2em] text-[rgba(17,19,24,0.42)] md:mb-7">
              Core Business Overview
            </p>

            <h1 className="m-0 max-w-[13ch] text-[clamp(2.7rem,7vw,6.8rem)] font-[560] leading-[0.92] tracking-[-0.05em] text-[#101218]">
              {title.title}
            </h1>

            <HighlightDescription
              key={title.title}
              text={title.description}
              progress={descriptionProgress}
            />
          </div>
        </div>

        <motion.img
          style={{ x: shipX }}
          className="pointer-events-none absolute left-[52%] top-[33%] z-30 w-[min(180vw,2800px)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
          src="/ship/shipSvg1.svg"
          alt="Core Business Overview"
        />
        <motion.img
          style={{ x: ship2X }}
          className="pointer-events-none absolute left-[52%] top-[33%] z-30 w-[min(180vw,2800px)] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
          src="/ship/shipSvg2.svg"
          alt="Core Business Overview"
        />
      </div>
    </section>
  );
}
