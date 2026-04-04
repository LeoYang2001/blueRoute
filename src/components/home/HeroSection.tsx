import HeroScene from "./HeroScene";
import "../../App.css";
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
  const sectionRef = useRef(null);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const textShiftY = useTransform(scrollYProgress, [0, 0.8, 1], [0, 50, 120]);
  const yHeadline = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Per-element parallax — each layer drifts at a different rate
  const yEyebrow = useTransform(scrollYProgress, [0, 1], [30, -20]);
  const yH1 = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const yInvestors = useTransform(scrollYProgress, [0, 1], [90, -110]);
  const ySideText = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const ySideHint = useTransform(scrollYProgress, [0, 1], [20, -10]);

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [1, 0.88, 0.72],
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsNavbarCollapsed(latest > 0.57);
    console.log("scrollYProgress:", latest);
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
            Zero Emission · Ocean Transport
          </motion.span>
          <motion.h1 style={{ y: yH1 }}>
            Low Emission
            <br />
            Ocean
            <br />
            Transportation
          </motion.h1>
          <motion.div className="hero__investors" style={{ y: yInvestors }}>
            <span className="hero__investorsLabel">
              Backed by top-tier investors
            </span>
            <div className="hero__logos">
              <div>SOSV</div>
              <div>FTTF</div>
              <div>Logo 3</div>
            </div>
          </motion.div>
        </motion.div>

        {/* bottom-right: tagline + scroll hint */}
        <div className="hero__sideText pointer-events-auto">
          <motion.p style={{ y: ySideText }}>
            We develop a novel ship to transport freight more flexibly, with
            lower emissions and at lower costs than today.
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
