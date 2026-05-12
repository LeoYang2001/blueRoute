import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function BusinessParallaxShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  return (
    // h-[60vh] on mobile keeps the showcase from eating too much screen,
    // while desktop keeps the original 85vh that gives the parallax room.
    <section
      ref={sectionRef}
      // Vertical overflow stays visible so the orange card can dip below
      // the section, but horizontal overflow is clipped to prevent the
      // scaled parallax image from pushing the page wider than viewport.
      className="relative h-[60vh] overflow-x-clip overflow-y-visible bg-[#0b1a2a] md:h-[85vh]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src="/pictures/showcase.jpeg"
          alt="BlueRoute vessel"
          className="h-full w-full object-cover"
          style={{ y: imageY, scale: imageScale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,14,22,0.12),rgba(7,14,22,0.45))] md:bg-[linear-gradient(to_bottom,rgba(7,14,22,0.12),rgba(7,14,22,0.36))]" />
      </div>

      <motion.div
        className="absolute bottom-0 left-4 right-4 z-20 translate-y-1/2 bg-[#ff4d25] px-5 py-6 text-white md:left-[7vw] md:right-auto md:w-[min(560px,calc(100%-3rem))] md:px-10 md:py-11"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Small editorial header above the card title — chapter marker
            plus a hairline rule for an extra beat of visual polish. */}
        <div className="mb-3 flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/85 md:text-[0.78rem] md:tracking-[0.16em]">
          <span className="block h-px w-6 bg-white/55 md:hidden" />
          <span>Capabilities</span>
        </div>
        <h3 className="m-0 max-w-[14ch] text-[clamp(1.6rem,6vw,4rem)] font-medium leading-[0.98] tracking-[-0.02em] md:max-w-[12ch] md:leading-[0.96] md:tracking-[-0.03em]">
          Integrated Capabilities &amp; Competitive Advantages
        </h3>
      </motion.div>
    </section>
  );
}
