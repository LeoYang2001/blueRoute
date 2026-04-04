import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // PARALLAX MAPPINGS
  // Large headline: subtle vertical drift
  const yHeadline = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Right content: moves up faster than the scroll
  const yContent = useTransform(scrollYProgress, [0, 1], [150, -150]);

  const yImage = useTransform(scrollYProgress, [0, 1], [100, -220]);

  // Bottom image: subtle horizontal drift for a "floating" feel
  const xImage = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  // General fade logic
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="sectionShell relative w-full h-full bg-white  overflow-visible"
    >
      <div className="sectionInner  grid grid-cols-12 gap-y-40 items-start">
        <div className="sectionEyebrow col-span-1 text-slate-400 font-bold mb-0">
          Company
        </div>

        <motion.div
          style={{ y: yHeadline, opacity }}
          className="col-span-6 col-start-3"
        >
          <h2 className="sectionTitle text-slate-900">
            Welcome to CargoKite, where engineering excellence meets innovation
          </h2>
        </motion.div>

        <motion.div
          style={{ y: yImage, opacity }}
          className="col-span-4 col-start-9 -mt-20"
        >
          <img
            src="https://cargokite.com/home-abt-new.b4674cc5.jpeg"
            alt="CargoKite Team"
            className="w-full grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>

        <motion.div
          style={{ x: xImage, opacity }}
          className="col-span-4 col-start-3"
        >
          <img
            src="https://cargokite.com/home-intro-2.3b94665f.jpeg"
            alt="Cargo containers"
            className="w-full h-100 object-cover"
          />
        </motion.div>

        <motion.div
          style={{ y: yContent, opacity }}
          className="col-span-4 col-start-8 space-y-8"
        >
          <h3 className="sectionSubtitle text-slate-900">
            We are a tech startup from Munich reinventing how goods are
            transported across the ocean.
          </h3>
          <p className="sectionBody text-slate-600">
            CargoKite is a maritime hard tech company based in Munich, Germany.
            The company was founded in 2022 with the mission of sustainable and
            at the same time economically viable commercial shipping.
          </p>
          <p className="sectionBody text-slate-600">
            We are convinced that software solutions alone won't suffice to
            decarbonize the shipping industry. We have therefore developed an
            entirely new ship class which uses the wind as its main source of
            propulsion.
          </p>
          <button className="w-fit text-orange-500 font-medium border-b border-orange-500 pb-1 hover:text-orange-600 transition-colors">
            More about us
          </button>
        </motion.div>
      </div>

      {/* Side badge similar to 'Site of the Day' */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 bg-orange-600 text-white p-2 vertical-text text-[10px] tracking-widest block uppercase">
        Innovation Lead 2026
      </div>
    </section>
  );
}
