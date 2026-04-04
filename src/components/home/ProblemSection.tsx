import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ProblemSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // PARALLAX SPEEDS
  // Text moves slower to remain readable
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yImageFast = useTransform(scrollYProgress, [0, 1], [64, -64]);
  const yImageSlow = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <section
      ref={containerRef}
      className="sectionShell relative bg-[#f8f9fa] overflow-hidden"
    >
      <div className="sectionInner grid grid-cols-12 gap-y-40 items-start">
        {/* --- BLOCK 1: SUSTAINABILITY --- */}
        <div className="sectionEyebrow col-span-1 text-slate-400 font-bold mb-0">
          Problem
        </div>

        <motion.div style={{ y: yText }} className="col-span-6 col-start-3">
          <h2 className="sectionTitle text-slate-900 mb-20">
            Ocean shipping is the cheapest way to transport goods, but...
          </h2>

          <div className="max-w-md space-y-6">
            <h3 className="sectionSubtitle text-slate-900 italic">
              ...not sustainable
            </h3>
            <p className="sectionBody text-slate-600">
              Ships run on heavy fuel oil, making global shipping responsible
              for nearly 1 Gigatonne of CO2 emissions per year.
            </p>
          </div>
        </motion.div>

        {/* IMAGE 1: Top Right (Large) */}
        <div className="col-span-4 col-start-9 -mt-20 overflow-hidden">
          <motion.img
            style={{ y: yImageFast }}
            src="https://cargokite.com/home-prob-1.37a6670e.jpeg"
            alt="Sustainability"
            className="w-full scale-110"
          />
        </div>

        {/* --- BLOCK 2: RELIABILITY --- */}
        <div className="col-span-4 col-start-3 mt-0 overflow-hidden">
          <motion.img
            style={{ y: yImageSlow }}
            src="https://cargokite.com/home-prob-2.019f548e.jpeg"
            alt="Reliability"
            className="w-full scale-110"
          />
        </div>

        <motion.div
          style={{ y: yText }}
          className="col-span-4 col-start-8 space-y-6"
        >
          <h3 className="sectionSubtitle text-slate-900 italic">
            ...not reliable due to a lack of resilience
          </h3>
          <p className="sectionBody text-slate-600">
            One single incident such as a ship getting stuck in the Suez Canal
            leads to congestion and massive delays for several months.
          </p>
        </motion.div>

        {/* --- BLOCK 3: STANDARD ROUTES --- */}
        <motion.div
          style={{ y: yText }}
          className="col-span-5 col-start-3 space-y-8"
        >
          <h3 className="sectionSubtitle text-slate-900 italic">
            ...only for standard routes
          </h3>
          <p className="sectionBody text-slate-600 max-w-sm">
            Ultra-Large Vessels are cost-efficient, but only 5% of ports
            worldwide have the sufficient infrastructure.
          </p>
          <div className="overflow-hidden">
            <motion.img
              style={{ y: yImageFast }}
              src="https://cargokite.com/home-prob-3.12efd66e.jpeg"
              alt="Routes"
              className="w-full scale-110 "
            />
          </div>
        </motion.div>

        {/* --- BLOCK 4: CUSTOMER ORIENTED --- */}
        <motion.div
          style={{ y: yText }}
          className="col-span-4 col-start-9 -mt-32"
        >
          <div className="overflow-hidden">
            <motion.img
              style={{ y: yImageSlow }}
              src="https://cargokite.com/home-prob-4.d447bad7.jpeg"
              alt="Customer Focus"
              className="w-full scale-110"
            />
          </div>
          <h3 className="sectionSubtitle text-slate-900 italic mt-8">
            ...not customer-oriented
          </h3>
        </motion.div>
      </div>
    </section>
  );
}
