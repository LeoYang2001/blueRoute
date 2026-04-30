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
    <section
      ref={sectionRef}
      className="relative h-[85vh] overflow-visible bg-[#0b1a2a]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src="/pictures/showcase.jpeg"
          alt="BlueRoute vessel"
          className="h-full w-full object-cover"
          style={{ y: imageY, scale: imageScale }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,14,22,0.12),rgba(7,14,22,0.36))]" />
      </div>

      <motion.div
        className="absolute bottom-0 left-6 z-20 w-[min(560px,calc(100%-3rem))] translate-y-1/2 bg-[#ff4d25] px-7 py-8 text-white md:left-[7vw] md:px-10 md:py-11"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="mb-3 text-[0.78rem] uppercase tracking-[0.16em] text-white/84">
          Capabilities
        </p>
        <h3 className="m-0 max-w-[12ch] text-[clamp(2rem,4.7vw,4rem)] font-medium leading-[0.96] tracking-[-0.03em]">
          Integrated Capabilities &amp; Competitive Advantages
        </h3>
      </motion.div>
    </section>
  );
}
