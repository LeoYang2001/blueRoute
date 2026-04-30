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
    <main className="fleetPage">
      <Navbar isCollapsed={isNavbarCollapsed} />

      <CoreBusinessOverview />
      <ShippingServices />
      <BusinessParallaxShowcase />
      <IntegratedCapabilities />
    </main>
  );
}
