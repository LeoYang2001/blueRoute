import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Mirror of the AboutSection hook — kept colocated so each section is
// self-contained. Detects <768px and updates live on resize/devtools toggle.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function BusinessSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Desktop parallax speeds — unchanged so laptop view behaves exactly as
  // before. On mobile the helper below replaces these with whileInView.
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yImageFast = useTransform(scrollYProgress, [0, 1], [64, -64]);
  const yImageSlow = useTransform(scrollYProgress, [0, 1], [26, -26]);

  // Per-breakpoint motion contract. Desktop keeps continuous parallax via
  // `style`. Mobile uses a one-shot fade + slide-up reveal that fires when
  // the element is roughly a third visible, with an optional delay for
  // staggering siblings inside the same capability block.
  const motionProps = (desktopStyle: MotionStyle, delay = 0) =>
    isMobile
      ? {
          initial: { opacity: 0, y: 32 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 } as const,
          transition: {
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1] as const,
            delay,
          },
        }
      : { style: desktopStyle };

  return (
    <section
      ref={containerRef}
      className="sectionShell relative bg-[#f8f9fa] overflow-hidden"
    >
      {/* Mobile-only chapter index — small "02 — Chapter" anchor at top. */}
      <motion.span
        className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.28em] text-orange-500 md:hidden"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        02 — Chapter
      </motion.span>

      <div className="sectionInner grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-y-40 md:items-start">
        {/* --- SECTION LABEL --- */}
        <motion.div
          {...motionProps({}, 0)}
          className="sectionEyebrow text-slate-400 font-bold mb-0 md:col-span-1"
        >
          Business
        </motion.div>

        {/* --- BLOCK 1: INTRO + CHARTERING --- */}
        <motion.div
          {...motionProps({ y: yText }, 0)}
          className="md:col-span-6 md:col-start-3"
        >
          <h2 className="sectionTitle text-slate-900 mb-8 md:mb-20">
            Integrated maritime capabilities across global shipping markets
          </h2>

          <div className="space-y-4 md:max-w-md md:space-y-6">
            <div className="flex items-baseline gap-3 md:block">
              {/* Mobile-only inline index next to the capability title. */}
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-orange-500 md:hidden">
                01
              </span>
              <h3 className="sectionSubtitle text-slate-900 italic">
                Chartering
              </h3>
            </div>
            <p className="sectionBody text-slate-600">
              We support long-term commercial transport partnerships through
              flexible chartering solutions, serving international clients
              across energy, chemical, and bulk commodity markets.
            </p>
          </div>
        </motion.div>

        {/* IMAGE 1 — desktop wraps it in a non-motion `<div>` for overflow;
            on mobile we want the image itself to fade-up, so we use motion
            on the inner img only. The wrapper stays untouched on desktop. */}
        <div className="overflow-hidden md:col-span-4 md:col-start-9 md:-mt-20">
          {isMobile ? (
            <motion.img
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              src="/business/business_1.png"
              alt="Global chartering and maritime operations"
              className="w-full h-48 object-cover scale-110 md:h-[330px]"
            />
          ) : (
            <motion.img
              style={{ y: yImageFast }}
              src="/business/business_1.png"
              alt="Global chartering and maritime operations"
              className="w-full h-48 object-cover scale-110 md:h-[330px]"
            />
          )}
        </div>

        {/* --- BLOCK 2: SHIPPING --- */}
        <div className="overflow-hidden md:col-span-4 md:col-start-3 md:mt-0">
          {isMobile ? (
            <motion.img
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              src="/pictures/ship_4.png"
              alt="Shipping operations"
              className="w-full h-48 object-cover scale-110 md:h-[320px]"
            />
          ) : (
            <motion.img
              style={{ y: yImageSlow }}
              src="/pictures/ship_4.png"
              alt="Shipping operations"
              className="w-full h-48 object-cover scale-110 md:h-[320px]"
            />
          )}
        </div>

        <motion.div
          {...motionProps({ y: yText }, 0.1)}
          className="space-y-4 md:col-span-4 md:col-start-8 md:space-y-6"
        >
          <div className="flex items-baseline gap-3 md:block">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-orange-500 md:hidden">
              02
            </span>
            <h3 className="sectionSubtitle text-slate-900 italic">Shipping</h3>
          </div>
          <p className="sectionBody text-slate-600">
            Our shipping operations span crude oil, refined petroleum products,
            chemicals, LNG, and bulk cargo, supported by a growing fleet and a
            global route network connecting major international trade regions.
          </p>
        </motion.div>

        {/* --- BLOCK 3: SHIPBUILDING --- */}
        <motion.div
          {...motionProps({ y: yText }, 0)}
          className="space-y-5 md:col-span-5 md:col-start-3 md:space-y-8"
        >
          <div className="flex items-baseline gap-3 md:block">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-orange-500 md:hidden">
              03
            </span>
            <h3 className="sectionSubtitle text-slate-900 italic">
              Shipbuilding
            </h3>
          </div>
          <p className="sectionBody text-slate-600 md:max-w-sm">
            We continue to invest in high-performance vessel construction,
            intelligent shipbuilding systems, and next-generation energy vessel
            solutions to optimize fleet structure and support long-term growth.
          </p>

          <div className="overflow-hidden">
            {isMobile ? (
              <motion.img
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.12,
                }}
                src="/pictures/ship_6.png"
                alt="Shipbuilding and vessel construction"
                className="w-full h-56 object-cover scale-110 md:h-[420px]"
              />
            ) : (
              <motion.img
                style={{ y: yImageFast }}
                src="/pictures/ship_6.png"
                alt="Shipbuilding and vessel construction"
                className="w-full h-56 object-cover scale-110 md:h-[420px]"
              />
            )}
          </div>
        </motion.div>

        {/* --- BLOCK 4: INTEGRATED ADVANTAGES --- */}
        <motion.div
          {...motionProps({ y: yText }, 0)}
          className="md:col-span-4 md:col-start-9 md:-mt-32"
        >
          <div className="overflow-hidden">
            {isMobile ? (
              <motion.img
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                src="/pictures/factory.png"
                alt="Integrated maritime solutions"
                className="w-full h-52 object-cover scale-110 md:h-[360px]"
              />
            ) : (
              <motion.img
                style={{ y: yImageSlow }}
                src="/pictures/factory.png"
                alt="Integrated maritime solutions"
                className="w-full h-52 object-cover scale-110 md:h-[360px]"
              />
            )}
          </div>

          <div className="mt-6 flex items-baseline gap-3 md:mt-8 md:block">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-orange-500 md:hidden">
              04
            </span>
            <h3 className="sectionSubtitle text-slate-900 italic">
              Integrated Advantages
            </h3>
          </div>
          <p className="sectionBody text-slate-600 mt-3 md:mt-4">
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
