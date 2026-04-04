import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Routes } from "react-router-dom";

const STRIP_COUNT = 6;
const STRIP_STAGGER_MS = 110;
const STRIP_SLIDE_MS = 420;
const SCREEN_HOLD_MS = 1000;

const ROUTE_SWITCH_DELAY_MS =
  (STRIP_COUNT - 1) * STRIP_STAGGER_MS + STRIP_SLIDE_MS;
const OVERLAY_HIDE_DELAY_MS =
  (STRIP_COUNT - 1) * STRIP_STAGGER_MS + STRIP_SLIDE_MS * 2 + SCREEN_HOLD_MS;

export function DelayedRoutes({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      const timer_1 = setTimeout(() => {
        setDisplayLocation(location);
      }, ROUTE_SWITCH_DELAY_MS);
      const timer_2 = setTimeout(() => {
        setIsTransitioning(false);
      }, OVERLAY_HIDE_DELAY_MS);
      return () => {
        clearTimeout(timer_1);
        clearTimeout(timer_2);
      };
    }
  }, [location.pathname]);

  return (
    <>
      {isTransitioning && <LoadingOverlay />}
      {/* The Routes tag MUST be here, wrapping the children */}
      <Routes location={displayLocation}>{children}</Routes>
    </>
  );
}

const LoadingOverlay = () => {
  const singleStripDurationMs = STRIP_SLIDE_MS * 2 + SCREEN_HOLD_MS;
  const singleStripDurationSec = singleStripDurationMs / 1000;
  const inStop = STRIP_SLIDE_MS / singleStripDurationMs;
  const holdStop = (STRIP_SLIDE_MS + SCREEN_HOLD_MS) / singleStripDurationMs;

  return (
    <div className="fixed inset-0 z-9999 grid grid-cols-6 pointer-events-none">
      {Array.from({ length: STRIP_COUNT }).map((_, idx) => (
        <div key={idx} className="relative overflow-hidden">
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: ["-100%", "0%", "0%", "100%"] }}
            transition={{
              duration: singleStripDurationSec,
              delay: (idx * STRIP_STAGGER_MS) / 1000,
              times: [0, inStop, holdStop, 1],
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-[#ff6b35]"
          />
        </div>
      ))}
    </div>
  );
};
