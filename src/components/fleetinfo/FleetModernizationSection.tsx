import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

// ── Featured vessel set ──
// Each vessel renders into the same image+content layout; the selector
// at the top of the section swaps between them. Images are placeholders
// for now (image: "/pictures/ship_4.png") — to be replaced per vessel.
//
// Public AIS data (IMO/MMSI, dimensions, deadweight) for the three
// Pacific-class sister tankers was sourced from VesselFinder and
// MaritimeOptima in May 2026.
type Vessel = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  badge: string;
  headerMeta: string;
  /** Short tagline shown above the spec sheet. */
  tagline?: string;
  specs: { label: string; value: string }[];
};

const VESSELS: Vessel[] = [
  {
    id: "tian-shu-xing",
    name: "Tian Shu Xing",
    subtitle:
      "MR Chemical / Oil Products Tanker · Lianyungang Wuzhou Shipbuilding",
    image: "/pictures/ship_4.png",
    imageAlt: "Tian Shu Xing chemical tanker",
    badge: "Newly Delivered",
    headerMeta: "Delivered · March 2025",
    tagline:
      "The largest chemical tanker ever built in Lianyungang, powered by China's first domestic large-scale chemical-tanker engine.",
    specs: [
      { label: "Delivery Date", value: "March 2025" },
      { label: "Vessel Type", value: "Chemical / Oil Products Tanker (MR)" },
      { label: "IMO Number", value: "1031513" },
      { label: "Callsign", value: "VRWT3" },
      { label: "Flag", value: "Hong Kong" },
      { label: "Dimensions", value: "183 m LOA × 32 m beam" },
      { label: "Deadweight", value: "49,994 t" },
      { label: "Gross Tonnage", value: "29,999" },
      { label: "Main Engine", value: "Yuchai Marine 6S50ME" },
      {
        label: "Shipbuilder",
        value: "Lianyungang Wuzhou Shipbuilding Industry Co.",
      },
    ],
  },
  {
    id: "pacific-explorer",
    name: "Pacific Explorer",
    subtitle:
      "MR Chemical / Oil Products Tanker · Lianyungang Wuzhou Shipbuilding",
    image: "/pictures/pacific-explorer.png",
    imageAlt: "Pacific Explorer tanker",
    badge: "Launched",
    headerMeta: "Launched · Oct 23, 2025",
    tagline:
      "Hong Kong-flagged Medium Range tanker, sister to Pacific Pioneer and Pacific Horizon.",
    specs: [
      { label: "Launch Date", value: "October 23, 2025" },
      { label: "Vessel Type", value: "Chemical / Oil Products Tanker (MR)" },
      { label: "IMO Number", value: "1061855" },
      { label: "Callsign", value: "VRXD9" },
      { label: "Flag", value: "Hong Kong" },
      { label: "Dimensions", value: "183 m LOA × 32 m beam" },
      { label: "Deadweight", value: "49,997 t" },
      { label: "Gross Tonnage", value: "29,999" },
      { label: "Main Engine", value: "MAN 6S50ME-C9.7-HPSCR" },
      {
        label: "Shipbuilder",
        value: "Lianyungang Wuzhou Shipping Industry Co., Ltd.",
      },
    ],
  },
  {
    id: "pacific-pioneer",
    name: "Pacific Pioneer",
    subtitle:
      "MR Chemical / Oil Products Tanker · Lianyungang Wuzhou Shipbuilding",
    image: "/pictures/pacific-pioneer.png",
    imageAlt: "Pacific Pioneer tanker",
    badge: "Launched",
    headerMeta: "Launched · Aug 02, 2025",
    tagline:
      "First of the Pacific-class MR sister set, in service since the 2025 launch.",
    specs: [
      { label: "Launch Date", value: "August 2, 2025" },
      { label: "Vessel Type", value: "Chemical / Oil Products Tanker (MR)" },
      { label: "IMO Number", value: "1046178" },
      { label: "Callsign", value: "VRWY6" },
      { label: "Flag", value: "Hong Kong" },
      { label: "Dimensions", value: "182 m LOA × 32 m beam" },
      { label: "Deadweight", value: "49,998 t" },
      { label: "Gross Tonnage", value: "29,999" },
      { label: "Main Engine", value: "MAN 6S50ME-C9.7-HPSCR" },
      {
        label: "Shipbuilder",
        value: "Lianyungang Wuzhou Shipping Industry Co., Ltd.",
      },
    ],
  },
  {
    id: "pacific-horizon",
    name: "Pacific Horizon",
    subtitle:
      "MR Chemical / Oil Products Tanker · Lianyungang Wuzhou Shipbuilding",
    image: "/pictures/pacific-horizon.png",
    imageAlt: "Pacific Horizon tanker",
    badge: "Launched",
    headerMeta: "Launched · Jan 25, 2026",
    tagline:
      "The newest of the Pacific-class sisters, launched at the start of 2026.",
    specs: [
      { label: "Launch Date", value: "January 25, 2026" },
      { label: "Vessel Type", value: "Chemical / Oil Products Tanker (MR)" },
      { label: "IMO Number", value: "1062586" },
      { label: "Callsign", value: "VRXJ2" },
      { label: "Flag", value: "Hong Kong" },
      { label: "Dimensions", value: "183 m LOA × 32 m beam" },
      { label: "Deadweight", value: "49,995 t" },
      { label: "Gross Tonnage", value: "29,999" },
      { label: "Main Engine", value: "MAN 6S50ME-C9.7-HPSCR" },
      {
        label: "Shipbuilder",
        value: "Lianyungang Wuzhou Shipping Industry Co., Ltd.",
      },
    ],
  },
];

const DELAY = 0.15;

export default function FleetModernizationSection() {
  // Index of the currently selected vessel for the featured-vessel block.
  // Defaults to the first entry (Tian Shu Xing) for parity with the prior
  // single-vessel layout.
  const [activeVesselIdx, setActiveVesselIdx] = useState(0);
  const activeVessel = VESSELS[activeVesselIdx];

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
          <motion.h2 className="fleetModSection__headline" {...fadeUp(DELAY)}>
            Built for Performance.
            <br />
            Ready for Tomorrow.
          </motion.h2>
          <motion.p className="fleetModSection__sub" {...fadeUp(DELAY + 0.12)}>
            Our modernization strategy goes beyond adding vessels—it&apos;s
            about building smarter, cleaner, and more capable ships that lead
            the next generation of maritime energy transport.
          </motion.p>
        </div>

        {/* ─── Strategy pillars ─── */}
        <div className="fleetModBlock">
          <motion.header className="fleetModBlock__header" {...fadeUp(0)}>
            <span className="fleetModBlock__label">Strategy Pillars</span>
            <span className="fleetModBlock__divider" aria-hidden="true" />
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
                <span className="fleetModPillar__indexBg" aria-hidden="true">
                  {p.index}
                </span>
                <span className="fleetModPillar__index">{p.index}</span>
                <h4 className="fleetModPillar__label">{p.label}</h4>
                <p className="fleetModPillar__body">{p.body}</p>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ─── Featured vessels ───
            Tabbed selector lets visitors switch between 4 showcase vessels.
            The image + content panel below the tabs is keyed on the active
            vessel id so AnimatePresence can cross-fade between selections. */}
        <div className="fleetModBlock">
          <motion.header className="fleetModBlock__header" {...fadeUp(0)}>
            <span className="fleetModBlock__label">Featured Vessels</span>
            <span className="fleetModBlock__divider" aria-hidden="true" />
            <span className="fleetModBlock__count">
              {activeVessel.headerMeta}
            </span>
          </motion.header>

          {/* Vessel selector — accessible tab-list. Numeric prefix on each
              tab keeps the visual rhythm of the rest of the page. */}
          <motion.div
            className="fleetModVesselTabs"
            role="tablist"
            aria-label="Featured vessels"
            {...fadeUp(DELAY)}
          >
            {VESSELS.map((v, i) => {
              const isActive = i === activeVesselIdx;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`vessel-panel-${v.id}`}
                  id={`vessel-tab-${v.id}`}
                  className={`fleetModVesselTab${
                    isActive ? " fleetModVesselTab--active" : ""
                  }`}
                  onClick={() => setActiveVesselIdx(i)}
                >
                  <span className="fleetModVesselTab__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="fleetModVesselTab__name">{v.name}</span>
                </button>
              );
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeVessel.id}
              id={`vessel-panel-${activeVessel.id}`}
              role="tabpanel"
              aria-labelledby={`vessel-tab-${activeVessel.id}`}
              className="fleetModFeatured"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <div className="fleetModFeatured__image">
                <img src={activeVessel.image} alt={activeVessel.imageAlt} />
                <span className="fleetModFeatured__badge">
                  <span
                    className="fleetModFeatured__badgeDot"
                    aria-hidden="true"
                  />
                  {activeVessel.badge}
                </span>
              </div>

              <div className="fleetModFeatured__content">
                <h3 className="fleetModFeatured__name">{activeVessel.name}</h3>
                <p className="fleetModFeatured__subtitle">
                  {activeVessel.subtitle}
                </p>

                {activeVessel.tagline && (
                  <p className="fleetModFeatured__tagline">
                    {activeVessel.tagline}
                  </p>
                )}

                <dl className="fleetModFeatured__specs">
                  {activeVessel.specs.map((s) => (
                    <div key={s.label} className="fleetModFeatured__spec">
                      <dt className="fleetModFeatured__specLabel">{s.label}</dt>
                      {/* Dotted leader between label and value — editorial
                          spec-sheet feel. */}
                      <span
                        className="fleetModFeatured__specLeader"
                        aria-hidden="true"
                      />
                      <dd className="fleetModFeatured__specValue">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
