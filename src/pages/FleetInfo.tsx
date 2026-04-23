import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FleetOverviewSection from "../components/fleetinfo/FleetOverviewSection";
import FleetExpansionSection from "../components/fleetinfo/FleetExpansionSection";
import FleetModernizationSection from "../components/fleetinfo/FleetModernizationSection";
import "./FleetInfo.css";

export default function FleetInfo() {
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

      <FleetOverviewSection />
      <FleetExpansionSection />
      <FleetModernizationSection />
    </main>
  );
}
