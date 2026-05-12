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
    // - h-[350vh] on mobile keeps the sticky scroll from feeling endless on
    //   a phone (vs 500vh on desktop). The scroll-progress breakpoints are
    //   fractional so they keep working.
    // - `overflow-x-clip` on the section is a safety net: if the sticky
    //   parent's `overflow-hidden` ever leaks (e.g. older browser where
    //   body's overflow-x: clip falls back to visible), the section still
    //   clips horizontally. `clip` doesn't break sticky descendants.
    <section
      ref={sectionRef}
      className="relative h-[350vh] overflow-x-clip bg-[#f1f0ec] md:h-[500vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_46%,rgba(255,255,255,0.55),rgba(241,240,236,0)_48%)]" />

        <div className="relative z-10 flex h-full items-center px-5 pt-20 md:px-[7vw] md:pt-0">
          <div className="max-w-245">
            {/* Mobile-only chapter index above the eyebrow. */}
            <p className="mb-2 inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#ff5c2f] md:hidden">
              <span>02</span>
              <span className="block h-px w-5 bg-[rgba(255,92,47,0.5)]" />
              <span>Business</span>
            </p>
            <p className="mb-3 text-[0.7rem] uppercase tracking-[0.2em] text-[rgba(17,19,24,0.42)] md:mb-7 md:text-[0.75rem]">
              Core Business Overview
            </p>

            <h1 className="m-0 max-w-[13ch] text-[clamp(2.2rem,7vw,6.8rem)] font-[560] leading-[0.94] tracking-[-0.045em] text-[#101218]">
              {title.title}
            </h1>

            <HighlightDescription
              key={title.title}
              text={title.description}
              progress={descriptionProgress}
            />

            {/* Mobile-only step indicator showing which of the three titles
                is currently active. Hidden on desktop where the parallax
                ships convey the same idea. */}
            <div className="mt-8 flex items-center gap-1.5 md:hidden">
              {TITLE_LIST.map((t) => (
                <span
                  key={t.title}
                  className={`block h-[3px] flex-1 max-w-[40px] rounded-full transition-colors duration-300 ${
                    t.title === title.title
                      ? "bg-[#ff5c2f]"
                      : "bg-[rgba(17,19,24,0.12)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Ship parallax wrappers.
            Previously the `motion.img` carried both the framer-motion `x`
            transform AND Tailwind's `-translate-x-1/2 -translate-y-1/2` —
            those collide on the CSS `transform` property and the motion
            value wins, killing the centering. With huge 220vw widths the
            ship then shoots far off the right edge of the viewport,
            producing horizontal scroll and a broken-looking SVG layout.

            Fix: outer non-motion <div> owns the absolute positioning and
            -translate centering; inner <motion.img> only owns the `x`
            parallax. They no longer fight for `transform`, and the SVG
            stays anchored to its intended viewport position while the
            parallax slides it left as the scroll progresses.

            Mobile sizes are also dialed down (`min(140vw, 520px)` vs
            desktop `min(180vw, 2800px)`) so the ship is roughly viewport-
            sized rather than 2× viewport — keeps the SVG readable and
            the parallax contained. */}
        <div className="pointer-events-none absolute left-[52%] top-[78%] z-30 -translate-x-1/2 -translate-y-1/2 select-none md:top-[33%]">
          <motion.img
            style={{ x: shipX }}
            className="block w-[min(140vw,520px)] max-w-none opacity-70 md:w-[min(180vw,2800px)] md:opacity-100"
            src="/ship/shipSvg1.svg"
            alt="Core Business Overview"
          />
        </div>
        <div className="pointer-events-none absolute left-[52%] top-[78%] z-30 -translate-x-1/2 -translate-y-1/2 select-none md:top-[33%]">
          <motion.img
            style={{ x: ship2X }}
            className="block w-[min(140vw,520px)] max-w-none opacity-70 md:w-[min(180vw,2800px)] md:opacity-100"
            src="/ship/shipSvg2.svg"
            alt="Core Business Overview"
          />
        </div>
      </div>
    </section>
  );
}
