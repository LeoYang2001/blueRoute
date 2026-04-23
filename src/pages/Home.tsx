import AboutSection from "../components/home/AboutSection";
import HeroSection from "../components/home/HeroSection";
import ProblemSection from "../components/home/BusinessSection";

export default function Home() {
  return (
    <main className=" ">
      <section
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <HeroSection />
      </section>
      <section
        style={{
          width: "100vw",
          height: "150vh",
        }}
      >
        <AboutSection />
      </section>
      <section
        style={{
          width: "100vw",
          height: "200vh",
        }}
      >
        <ProblemSection />
      </section>
    </main>
  );
}
