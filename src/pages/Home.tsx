import AboutSection from "../components/home/AboutSection";
import HeroSection from "../components/home/HeroSection";
import ProblemSection from "../components/home/BusinessSection";

export default function Home() {
  return (
    // `overflow-x-hidden` on main is a belt-and-braces backup to the same
    // rule on html/body, in case a parallax / scaled element here tries to
    // extend the page horizontally.
    <main className="overflow-x-hidden">
      {/* Hero keeps its 100vh on every breakpoint (full-bleed video).
          Using `w-full` instead of `w-screen` so the section can't extend
          past the body's actual rendered width. */}
      <section className="w-full h-screen">
        <HeroSection />
      </section>
      {/* About + Business previously had hard-coded 150vh / 200vh wrappers,
          which trapped their mobile-reflowed content inside a viewport-sized
          frame and produced enormous empty scroll. On mobile they collapse
          to whatever height the content actually needs; desktop keeps the
          original tall-section behavior so the parallax has room to play. */}
      <section className="w-full h-auto md:h-[150vh]">
        <AboutSection />
      </section>
      <section className="w-full h-auto md:h-[200vh]">
        <ProblemSection />
      </section>
    </main>
  );
}
