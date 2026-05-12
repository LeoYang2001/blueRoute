import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CoreBusinessOverview from "../components/business/CoreBusinessOverview";
import ShippingServices from "../components/business/ShippingServices";
import BusinessParallaxShowcase from "../components/business/BusinessParallaxShowcase";
import IntegratedCapabilities from "../components/business/IntegratedCapabilities";

export default function Business() {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.57;
      setIsNavbarCollapsed(window.scrollY > threshold);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // `overflow-x-clip` on main is a hard backstop: any section below that
    // accidentally renders wider than the viewport (oversized parallax SVGs,
    // a Three.js canvas mid-resize, etc.) gets clipped here rather than
    // leaving the page horizontally scrollable. `clip` doesn't form a
    // containing block, so sticky descendants (CoreBusinessOverview's
    // sticky scene) keep working. `w-full` is explicit so the main can't
    // ever shrink below viewport width either.
    <main className="fleetPage w-full overflow-x-clip">
      <Navbar isCollapsed={isNavbarCollapsed} />

      <CoreBusinessOverview />
      <ShippingServices />
      <BusinessParallaxShowcase />
      <IntegratedCapabilities />
    </main>
  );
}
