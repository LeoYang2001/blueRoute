import { motion } from "framer-motion";

const NON_HEADLINE_DELAY = 1;

export default function FleetOverviewSection() {
  //  background: #f8f9fa;
  return (
    <section className="fleetSection fleetSection--overview fleetOverviewSection">
      <motion.div
        className="fleetSection__inner fleetOverviewSection__inner"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="fleetOverviewSection__topGrid">
          <motion.div
            className="fleetOverviewSection__left"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65 }}
          >
            <p className="fleetSection__eyebrow">Fleet Overview</p>
            <h1
              style={{
                color: "#090b12",
              }}
            >
              Modern Fleet, Global Reach
            </h1>
          </motion.div>

          <motion.p
            className="fleetOverviewSection__intro"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: NON_HEADLINE_DELAY + 0.08 }}
          >
            Operating around 20 vessels, our fleet supports crude oil, refined
            products, LNG, fuel oil, and bulk cargo movement across global
            maritime routes with reliability and long-term scale in focus.
          </motion.p>
        </div>

        <motion.div
          className="fleetOverviewSection__visualRow"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: NON_HEADLINE_DELAY + 0.12 }}
        >
          <motion.figure
            className="fleetOverviewFigure fleetOverviewFigure--large"
            initial={{ y: 24, scale: 1.02, opacity: 0 }}
            whileInView={{ y: 0, scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, delay: NON_HEADLINE_DELAY + 0.16 }}
          >
            <img src="/pictures/ship_3.png" alt="Modern tanker fleet" />
          </motion.figure>
        </motion.div>

        <motion.div
          className="fleetOverviewStats"
          role="list"
          aria-label="Fleet overview stats"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: NON_HEADLINE_DELAY + 0.2 }}
        >
          <article className="fleetOverviewStatCard" role="listitem">
            <span className="fleetOverviewStatCard__index">01</span>
            <h3>20 Vessels</h3>
            <p>Current operating fleet scale</p>
          </article>
          <article className="fleetOverviewStatCard" role="listitem">
            <span className="fleetOverviewStatCard__index">02</span>
            <h3>3.3M DWT Target</h3>
            <p>Long-term capacity development goal</p>
          </article>
          <article className="fleetOverviewStatCard" role="listitem">
            <span className="fleetOverviewStatCard__index">03</span>
            <h3>Global Routes</h3>
            <p>Coverage across strategic sea lanes</p>
          </article>
          <article className="fleetOverviewStatCard" role="listitem">
            <span className="fleetOverviewStatCard__index">04</span>
            <h3>Energy & Bulk Transport</h3>
            <p>Crude oil, products, LNG, fuel oil, and bulk cargo</p>
          </article>
        </motion.div>
      </motion.div>

      {/* <div className="fleetOverviewSection__badge">Global Maritime Group</div> */}
    </section>
  );
}
