import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SafetyGovernance from "../components/safety/SafetyGovernance";
import SafetyPerformanceReliability from "../components/safety/SafetyPerformanceReliability";
import EnvironmentalStewardship from "../components/safety/EnvironmentalStewardship";
import "../css/SafetySustainability.css";

export default function SafetySustainability() {
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

      <SafetyGovernance />
      <SafetyPerformanceReliability />
      <EnvironmentalStewardship />
    </main>
  );
}
