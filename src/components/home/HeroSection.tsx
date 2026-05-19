import HeroScene from "./HeroScene";
import "../../css/App.css";
import Navbar from "../Navbar";
import heroVideo from "../../assets/video.mp4";
import { useState, useRef } from "react";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
} from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textShiftY = useTransform(scrollYProgress, [0, 0.8, 1], [0, 50, 120]);
  const yHeadline = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const yEyebrow = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const yH1 = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const yStats = useTransform(scrollYProgress, [0, 1], [90, -110]);
  const ySideText = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const ySideHint = useTransform(scrollYProgress, [0, 1], [20, -10]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [1, 0.88, 0.72],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsNavbarCollapsed(latest > 0.57);
  });

  return (
    <section className="hero" ref={sectionRef}>
      <Navbar isCollapsed={isNavbarCollapsed} />

      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        src={heroVideo}
      />

      <motion.div
        className="hero__videoOverlay"
        style={{ opacity: overlayOpacity }}
      />

      <HeroScene />

      <motion.div
        className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none"
        style={{ y: textShiftY, opacity }}
      >
        {/* bottom-left: headline block */}
        <motion.div
          className="hero__headlineBlock pointer-events-auto"
          style={{ y: yHeadline }}
        >
          <motion.span className="hero__eyebrow" style={{ y: yEyebrow }}>
            Global Maritime Transport · Oil · Chemical · Bulk Cargo
          </motion.span>

          <motion.h1 style={{ y: yH1 }}>
            Advancing
            <br />
            Global Maritime
            <br />
            Transportation
          </motion.h1>

          <motion.div className="hero__investors" style={{ y: yStats }}>
            <span className="hero__investorsLabel">
              A fast-growing international shipping group
            </span>

            <div className="hero__logos text-white opacity-90">
              <div>20 Vessels</div>
              <div>3.3M DWT</div>
              <div>Global Routes</div>
            </div>
          </motion.div>
        </motion.div>

        {/* bottom-right: company message + scroll hint */}
        <div className="hero__sideText pointer-events-auto">
          <motion.p style={{ y: ySideText }}>
            BlueRoute is building a world-class maritime platform focused on
            oil, gas, chemical, LNG, and bulk cargo transportation, supported by
            fleet expansion, shipbuilding innovation, and responsible operations
            across global trade routes.
          </motion.p>

          <motion.div className="hero__scrollHint" style={{ y: ySideHint }}>
            <span className="hero__scrollLine" />
            <span>Scroll to discover</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
