import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionStyle } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Detects narrow viewports so we can swap the desktop continuous parallax
// for scroll-triggered reveals on mobile. The hook updates live, so toggling
// devtools' mobile preview switches the animation mode without a reload.
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

export default function AboutSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Desktop continuous parallax — unchanged. These motion values are still
  // computed on mobile (cheap) but they are *not* applied as style there;
  // `motionProps` below decides per breakpoint.
  const yHeadline = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yContent = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [100, -220]);
  const xImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Picks the motion props for an element: desktop = continuous parallax via
  // style, mobile = a one-shot fade-up triggered when the element scrolls
  // into view. `delay` lets us stagger siblings within the same block.
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
      className="sectionShell relative w-full h-full bg-white overflow-visible"
    >
      {/* Mobile-only chapter index — gives the section a small "01" anchor
          at the top, matching an editorial feel. Hidden on desktop so the
          original laptop header stays untouched. */}
      <motion.span
        className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.28em] text-orange-500 md:hidden"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        01 — Chapter
      </motion.span>

      <div className="sectionInner grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-y-40 md:items-start">
        <motion.div
          {...motionProps({}, 0)}
          className="sectionEyebrow text-slate-400 font-bold mb-0 md:col-span-1"
        >
          Company
        </motion.div>

        <motion.div
          {...motionProps({ y: yHeadline, opacity }, 0)}
          className="md:col-span-6 md:col-start-3"
        >
          <h2 className="sectionTitle text-slate-900">
            A growing international maritime group built for long-term global
            shipping leadership
          </h2>
        </motion.div>

        <motion.div
          {...motionProps({ y: yImage, opacity }, 0.1)}
          className="md:col-span-4 md:col-start-9 md:-mt-20"
        >
          <img
            src="/home/company-1.jpeg"
            alt="Oil tanker at sea"
            className="w-full h-56 object-cover transition-all duration-700 md:h-[520px]"
          />
          {/* Mobile-only caption — small editorial note under the image. */}
          <p className="mt-2 block text-[0.72rem] uppercase tracking-[0.18em] text-slate-400 md:hidden">
            Modern fleet — global routes
          </p>
        </motion.div>

        <motion.div
          {...motionProps({ x: xImage, opacity }, 0.1)}
          className="md:col-span-4 md:col-start-3"
        >
          <img
            src="/pictures/ship_1.png"
            className="w-full h-48 object-cover md:h-[380px]"
          />
        </motion.div>

        <motion.div
          {...motionProps({ y: yContent, opacity }, 0.15)}
          className="space-y-6 md:col-span-4 md:col-start-8 md:space-y-8"
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

      {/* The vertical edge badge is decorative — hide it on phones to free
          up horizontal space and avoid overlapping the content. */}
      <div className="hidden fixed right-0 top-1/2 z-1000 -translate-y-1/2 bg-orange-600 text-white p-2 vertical-text text-[10px] tracking-widest md:block uppercase">
        Global Maritime Group
      </div>
    </section>
  );
}
