import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function BusinessSection() {
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax speeds
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yImageFast = useTransform(scrollYProgress, [0, 1], [64, -64]);
  const yImageSlow = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <section
      ref={containerRef}
      className="sectionShell relative bg-[#f8f9fa] overflow-hidden"
    >
      <div className="sectionInner grid grid-cols-12 gap-y-40 items-start">
        {/* --- SECTION LABEL --- */}
        <div className="sectionEyebrow col-span-1 text-slate-400 font-bold mb-0">
          Business
        </div>

        {/* --- BLOCK 1: INTRO + CHARTERING --- */}
        <motion.div style={{ y: yText }} className="col-span-6 col-start-3">
          <h2 className="sectionTitle text-slate-900 mb-20">
            Integrated maritime capabilities across global shipping markets
          </h2>

          <div className="max-w-md space-y-6">
            <h3 className="sectionSubtitle text-slate-900 italic">
              Chartering
            </h3>
            <p className="sectionBody text-slate-600">
              We support long-term commercial transport partnerships through
              flexible chartering solutions, serving international clients
              across energy, chemical, and bulk commodity markets.
            </p>
          </div>
        </motion.div>

        {/* IMAGE 1 */}
        <div className="col-span-4 col-start-9 -mt-20 overflow-hidden">
          <motion.img
            style={{ y: yImageFast }}
            src="/pictures/ship_2.png"
            alt="Global chartering and maritime operations"
            className="w-full h-[330px] object-cover scale-110"
          />
        </div>

        {/* --- BLOCK 2: SHIPPING --- */}
        <div className="col-span-4 col-start-3 mt-0 overflow-hidden">
          <motion.img
            style={{ y: yImageSlow }}
            src="/pictures/ship_4.png"
            alt="Shipping operations"
            className="w-full h-[320px] object-cover scale-110"
          />
        </div>

        <motion.div
          style={{ y: yText }}
          className="col-span-4 col-start-8 space-y-6"
        >
          <h3 className="sectionSubtitle text-slate-900 italic">Shipping</h3>
          <p className="sectionBody text-slate-600">
            Our shipping operations span crude oil, refined petroleum products,
            chemicals, LNG, and bulk cargo, supported by a growing fleet and a
            global route network connecting major international trade regions.
          </p>
        </motion.div>

        {/* --- BLOCK 3: SHIPBUILDING --- */}
        <motion.div
          style={{ y: yText }}
          className="col-span-5 col-start-3 space-y-8"
        >
          <h3 className="sectionSubtitle text-slate-900 italic">
            Shipbuilding
          </h3>
          <p className="sectionBody text-slate-600 max-w-sm">
            We continue to invest in high-performance vessel construction,
            intelligent shipbuilding systems, and next-generation energy vessel
            solutions to optimize fleet structure and support long-term growth.
          </p>

          <div className="overflow-hidden">
            <motion.img
              style={{ y: yImageFast }}
              src="/pictures/ship_6.png"
              alt="Shipbuilding and vessel construction"
              className="w-full h-[420px] object-cover scale-110"
            />
          </div>
        </motion.div>

        {/* --- BLOCK 4: INTEGRATED ADVANTAGES --- */}
        <motion.div
          style={{ y: yText }}
          className="col-span-4 col-start-9 -mt-32"
        >
          <div className="overflow-hidden">
            <motion.img
              style={{ y: yImageSlow }}
              src="/pictures/ship_1.png"
              alt="Integrated maritime solutions"
              className="w-full h-[360px] object-cover scale-110"
            />
          </div>

          <h3 className="sectionSubtitle text-slate-900 italic mt-8">
            Integrated Advantages
          </h3>
          <p className="sectionBody text-slate-600 mt-4">
            With an experienced maritime team, modern fleet strategy, advanced
            operating capabilities, extensive routes, and a strong focus on
            efficiency and service quality, we provide reliable transportation
            solutions tailored to client needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
