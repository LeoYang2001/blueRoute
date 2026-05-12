import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yHeadline = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yContent = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [100, -220]);
  const xImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="sectionShell relative w-full h-full bg-white overflow-visible"
    >
      <div className="sectionInner grid grid-cols-12 gap-y-40 items-start">
        <div className="sectionEyebrow col-span-1 text-slate-400 font-bold mb-0">
          Company
        </div>

        <motion.div
          style={{ y: yHeadline, opacity }}
          className="col-span-6 col-start-3"
        >
          <h2 className="sectionTitle text-slate-900">
            A growing international maritime group built for long-term global
            shipping leadership
          </h2>
        </motion.div>

        <motion.div
          style={{ y: yImage, opacity }}
          className="col-span-4 col-start-9 -mt-20"
        >
          <img
            src="/pictures/ship_3.png"
            alt="Oil tanker at sea"
            className="w-full h-[520px] object-cover   transition-all duration-700"
          />
        </motion.div>

        <motion.div
          style={{ x: xImage, opacity }}
          className="col-span-4 col-start-3"
        >
          <img
            src="/pictures/factory.png"
            className="w-full   h-[380px] object-cover"
          />
        </motion.div>

        <motion.div
          style={{ y: yContent, opacity }}
          className="col-span-4 col-start-8 space-y-8"
        >
          <h3 className="sectionSubtitle text-slate-900">
            Founded in Hong Kong in 2020 and headquartered in Fuzhou, the group
            focuses on international transportation across oil, chemical, LNG,
            and bulk cargo markets.
          </h3>

          <p className="sectionBody text-slate-600">
            Starting from a single 46,000-ton MR tanker, the company has grown
            into an expanding maritime platform with approximately 20 vessels in
            operation, supported by an ambitious fleet development strategy and
            a strong international market orientation.
          </p>

          <p className="sectionBody text-slate-600">
            With a long-term vision to become a world-class ocean carrier, the
            group continues to invest in fleet modernization, shipbuilding, and
            efficient global transportation solutions while strengthening its
            presence across major international trade routes.
          </p>
        </motion.div>
      </div>

      <div className="fixed right-0 top-1/2 z-1000 -translate-y-1/2 bg-orange-600 text-white p-2 vertical-text text-[10px] tracking-widest block uppercase">
        Global Maritime Group
      </div>
    </section>
  );
}
