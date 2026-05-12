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
  // Increments on every new transition so the overlay remounts and its
  // strip animation replays from scratch — without this, rapid/double clicks
  // reuse the existing overlay instance and framer-motion never replays.
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    // If the latest navigation already matches what's on screen (e.g. user
    // navigated back to the current page mid-transition), cancel the overlay
    // instead of leaving isTransitioning stuck at true.
    if (location.pathname === displayLocation.pathname) {
      if (isTransitioning) setIsTransitioning(false);
      return;
    }

    setIsTransitioning(true);
    setTransitionKey((k) => k + 1);

    const timer_1 = setTimeout(() => {
      setDisplayLocation(location);
      // Reset scroll to top when the displayed route changes
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    }, ROUTE_SWITCH_DELAY_MS);
    const timer_2 = setTimeout(() => {
      setIsTransitioning(false);
    }, OVERLAY_HIDE_DELAY_MS);
    return () => {
      clearTimeout(timer_1);
      clearTimeout(timer_2);
    };
    // We only react to location.pathname changes. displayLocation/isTransitioning
    // are intentionally omitted: re-running when displayLocation updates would
    // prematurely clear timer_2 and end the overlay before the slide-out plays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {isTransitioning && <LoadingOverlay key={transitionKey} />}
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
