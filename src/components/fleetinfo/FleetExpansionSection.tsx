import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

type Milestone = {
  period: string;
  year: string;
  title: string;
  description: string;
  image: string;
};

const MILESTONES: Milestone[] = [
  {
    period: "2020",
    year: "2020",
    title: "Fleet Foundation",
    description:
      "The fleet journey began with a single 46,000-ton MR tanker, establishing an early operating base in maritime energy transportation.",
    image: "/pictures/ship_1.png",
  },
  {
    period: "2020–2024",
    year: "2024",
    title: "Scale-Up Phase",
    description:
      "From that initial vessel, operations expanded steadily into a broader fleet serving crude oil, refined products, LNG, and fuel oil across a growing global route network.",
    image: "/pictures/ship_3.png",
  },
  {
    period: "2025",
    year: "2025",
    title: "Fleet Reaches ~20 Vessels",
    description:
      "The operating fleet scaled to around 20 vessels, marking a major increase in maritime energy transport capability.",
    image: "/pictures/ship_4.png",
  },
  {
    period: "Early 2025",
    year: "2025",
    title: "10 New Tankers Incoming",
    description:
      "Ten new tankers totaling 500,000 DWT are scheduled for delivery, strengthening transport capacity and accelerating tanker fleet growth.",
    image: "/pictures/ship_5.png",
  },
  {
    period: "2025",
    year: "3.3M",
    title: "Total Capacity Target: 3.3 Million DWT",
    description:
      "Following new deliveries, total fleet capacity is expected to reach 3.3 million DWT, positioning the company among major shipping operators in Fujian.",
    image: "/pictures/factory_2.png",
  },
  {
    period: "March 2025",
    year: "LNG",
    title: "Entry into LNG Carrier Segment",
    description:
      "The first LNG carrier acquisition marked a strategic diversification step beyond the traditional tanker base.",
    image: "/pictures/ship_6.png",
  },
  {
    period: "Next Phase",
    year: "Cape",
    title: "Bulk Carrier Expansion",
    description:
      "Negotiations for Guinea mineral transport contracts are underway, with plans to acquire or build 5–10 Cape-size bulk carriers and explore LNG/LPG fleet development.",
    image: "/pictures/shore.png",
  },
];

export default function FleetExpansionSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const storyViewportRef = useRef<HTMLDivElement | null>(null);
  const storyRailRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const END_HOLD_START = 0.88;
  const [endTranslate, setEndTranslate] = useState(
    -(MILESTONES.length - 1) * 566,
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const timelineGrow = useTransform(scrollYProgress, [0, 0.55, 1], [0, 1, 1]);
  const storyTranslateY = useTransform(
    scrollYProgress,
    [0, END_HOLD_START, 1],
    [0, endTranslate, endTranslate],
  );

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = storyViewportRef.current;
      const rail = storyRailRef.current;
      if (!viewport || !rail) return;

      const cards = rail.querySelectorAll<HTMLElement>(
        ".fleetExpansionStory__card",
      );
      const last = cards[cards.length - 1];
      if (!last) return;

      const viewportHeight = viewport.clientHeight;
      const lastBottom = last.offsetTop + last.offsetHeight;
      const nextEndTranslate = Math.min(0, viewportHeight - lastBottom);

      setEndTranslate(nextEndTranslate);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const normalized = Math.min(1, latest / END_HOLD_START);
    const next = Math.min(
      MILESTONES.length - 1,
      Math.round(normalized * (MILESTONES.length - 1)),
    );
    setActiveIndex(next);
  });

  return (
    <section ref={sectionRef} className="fleetExpansionSection">
      <div className="fleetExpansionSection__sticky ">
        <div className="fleetExpansionSection__inner">
          <aside className="fleetExpansionTimeline">
            <p className="fleetSection__eyebrow">
              Fleet Expansion & Diversification
            </p>
            <h2>Growth Trajectory</h2>

            <div className="fleetExpansionTimeline__track">
              <motion.div
                className="fleetExpansionTimeline__progress"
                style={{ scaleY: timelineGrow }}
              />

              {MILESTONES.map((item, idx) => (
                <div
                  key={item.title}
                  className={`fleetExpansionTimeline__dot ${idx <= activeIndex ? "is-active" : ""}`}
                  style={{ top: `${(idx / (MILESTONES.length - 1)) * 100}%` }}
                >
                  <span>{item.period}</span>
                </div>
              ))}
            </div>
          </aside>

          <div ref={storyViewportRef} className="fleetExpansionStory">
            <motion.div
              ref={storyRailRef}
              className="fleetExpansionStory__rail"
              style={{ y: storyTranslateY }}
            >
              {MILESTONES.map((item, idx) => (
                <article
                  key={item.title}
                  className={`fleetExpansionStory__card  py-12 ${idx === activeIndex ? "is-active" : ""}`}
                >
                  <img src={item.image} alt={item.title} />

                  <p className="fleetExpansionStory__period">{item.period}</p>
                  <h3 className="fleetExpansionStory__year">{item.year}</h3>
                  <h4 className="fleetExpansionStory__title">{item.title}</h4>
                  <p className="fleetExpansionStory__description">
                    {item.description}
                  </p>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
