import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type RegionPoint = {
  name: string;
  lat: number;
  lng: number;
};

type RegionName =
  | "Europe"
  | "Middle East"
  | "South America"
  | "South Africa"
  | "Southeast Asia";

type GeoFeature = {
  properties?: Record<string, unknown>;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
};

type GeoFeatureCollection = {
  features: GeoFeature[];
};

const REGIONS: Array<RegionPoint & { name: RegionName }> = [
  { name: "Europe", lat: 50.11, lng: 8.68 },
  { name: "Middle East", lat: 25.2, lng: 55.27 },
  { name: "South America", lat: -23.55, lng: -46.63 },
  { name: "South Africa", lat: -33.92, lng: 18.42 },
  { name: "Southeast Asia", lat: 1.29, lng: 103.85 },
];

const SUPPORTING_COPY =
  "The company operates across key international shipping regions, including Europe, the Middle East, South America, South Africa, and Southeast Asia, with access to major petrochemical hubs and strategic maritime routes worldwide.";

const REGION_BOUNDS: Record<
  RegionName,
  { latMin: number; latMax: number; lngMin: number; lngMax: number }
> = {
  Europe: { latMin: 35, latMax: 72, lngMin: -10, lngMax: 40 },
  "Middle East": { latMin: 12, latMax: 40, lngMin: 32, lngMax: 62 },
  "South America": { latMin: -56, latMax: 13, lngMin: -82, lngMax: -35 },
  "South Africa": { latMin: -36, latMax: -22, lngMin: 16, lngMax: 33 },
  "Southeast Asia": { latMin: -10, latMax: 24, lngMin: 92, lngMax: 132 },
};

function walkCoords(input: unknown, points: Array<[number, number]>) {
  if (!Array.isArray(input)) return;
  if (
    input.length >= 2 &&
    typeof input[0] === "number" &&
    typeof input[1] === "number"
  ) {
    points.push([input[0], input[1]]);
    return;
  }
  input.forEach((child) => walkCoords(child, points));
}

function getFeatureCenter(
  feature: GeoFeature,
): { lat: number; lng: number } | null {
  const points: Array<[number, number]> = [];
  walkCoords(feature.geometry?.coordinates, points);
  if (!points.length) return null;

  let lngSum = 0;
  let latSum = 0;
  points.forEach(([lng, lat]) => {
    lngSum += lng;
    latSum += lat;
  });

  return {
    lng: lngSum / points.length,
    lat: latSum / points.length,
  };
}

function isRegionFeature(feature: GeoFeature, regionName: RegionName) {
  const center = getFeatureCenter(feature);
  if (!center) return false;

  const region = REGION_BOUNDS[regionName];
  return (
    center.lat >= region.latMin &&
    center.lat <= region.latMax &&
    center.lng >= region.lngMin &&
    center.lng <= region.lngMax
  );
}

function HighlightWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = (index / Math.max(total, 1)) * 0.86;
  const end = Math.min(start + 0.13, 1);
  const color = useTransform(
    progress,
    [start, end],
    ["rgba(15,23,42,0.22)", "rgba(15,23,42,0.82)"],
  );

  return <motion.span style={{ color }}>{word} </motion.span>;
}

export default function ShippingServices() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const globeHostRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);
  const [globeSize, setGlobeSize] = useState({ width: 520, height: 520 });
  const [worldData, setWorldData] = useState<GeoFeatureCollection | null>(null);
  const [activeRegion, setActiveRegion] = useState<RegionName>("Europe");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 85%", "end 40%"],
  });

  useEffect(() => {
    const host = globeHostRef.current;
    if (!host) return;

    const resize = () => {
      const width = host.clientWidth;
      const height =
        host.clientHeight || Math.max(440, Math.round(width * 0.82));
      setGlobeSize({ width, height });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    )
      .then((res) => res.json())
      .then((data: GeoFeatureCollection) => {
        if (!cancelled) setWorldData(data);
      })
      .catch(() => {
        if (!cancelled) setWorldData({ features: [] });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.pointOfView({ lat: 18, lng: -28, altitude: 1.8 }, 0);
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.42;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;
  }, [worldData]);

  const handleRegionSelect = (region: RegionPoint & { name: RegionName }) => {
    setActiveRegion(region.name);
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.autoRotate = false;
    globeRef.current.pointOfView(
      { lat: region.lat, lng: region.lng, altitude: 1.5 },
      1200,
    );
  };

  const activeRegionData = REGIONS.find((r) => r.name === activeRegion);

  const words = SUPPORTING_COPY.split(" ");

  return (
    <section
      ref={sectionRef}
      className="bg-[#f8f9fa] min-h-screen px-6 py-28 md:px-[7vw] md:py-36"
    >
      <div className="mx-auto grid w-full max-w-350 gap-12 md:grid-cols-[0.92fr_1.08fr] md:items-center">
        <div>
          <motion.p
            className="mb-6 text-[0.75rem] uppercase tracking-[0.2em] text-[rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Global Coverage
          </motion.p>

          <motion.h2
            className="m-0 max-w-[12.5ch] text-[clamp(2.6rem,5.8vw,5.8rem)] font-[560] leading-[0.94] tracking-[-0.045em] text-[#0d1118]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.04 }}
          >
            Shipping Services &amp; Market Reach
          </motion.h2>

          <p className="mt-7 max-w-[58ch] text-[1rem] leading-[1.68]">
            {words.map((word, i) => (
              <HighlightWord
                key={`${word}-${i}`}
                word={word}
                index={i}
                total={words.length}
                progress={scrollYProgress}
              />
            ))}
          </p>

          <ul className="mt-9 flex flex-wrap gap-2.5">
            {REGIONS.map((region, i) => (
              <motion.li
                key={region.name}
                className={`list-none cursor-pointer rounded-full border px-4 py-2 text-[0.8rem] font-medium tracking-[0.03em] transition-colors duration-200 ${
                  activeRegion === region.name
                    ? "border-[#ff6b35] bg-[#ff6b35] text-white"
                    : "border-[rgba(15,23,42,0.12)] bg-white text-[rgba(15,23,42,0.72)] hover:border-[rgba(255,107,53,0.45)] hover:text-[rgba(255,107,53,0.95)]"
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.7 }}
                transition={{
                  duration: 0.38,
                  ease: "easeOut",
                  delay: 0.04 * i,
                }}
                onClick={() => handleRegionSelect(region)}
              >
                {region.name}
              </motion.li>
            ))}
          </ul>
        </div>

        <div
          ref={globeHostRef}
          className="relative h-110 w-full overflow-visible md:h-150"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="origin-center scale-[1.06]">
              <Globe
                ref={globeRef}
                width={globeSize.width}
                height={globeSize.height}
                backgroundColor="rgba(0,0,0,0)"
                showGlobe={false}
                showAtmosphere={true}
                hexPolygonsData={worldData?.features ?? []}
                hexPolygonResolution={3}
                hexPolygonMargin={0.68}
                hexPolygonUseDots={true}
                hexPolygonColor={(feature) =>
                  isRegionFeature(feature as GeoFeature, activeRegion)
                    ? "rgba(255, 107, 53, 0.95)"
                    : "rgba(210, 215, 223, 0.7)"
                }
                pointsData={REGIONS}
                pointLat="lat"
                pointLng="lng"
                pointColor={(point) =>
                  (point as RegionPoint).name === activeRegion
                    ? "#ff6b35"
                    : "#6f7ca6"
                }
                pointAltitude={0.02}
                pointRadius={0.28}
                labelsData={REGIONS}
                labelLat="lat"
                labelLng="lng"
                labelText="name"
                labelSize={1.05}
                labelDotRadius={0.32}
                labelColor={(label) =>
                  (label as RegionPoint).name === activeRegion
                    ? "rgba(255,107,53,0.95)"
                    : "rgba(55,73,128,0.8)"
                }
                labelResolution={2}
                ringsData={activeRegionData ? [activeRegionData] : []}
                ringLat="lat"
                ringLng="lng"
                ringColor={() => ["rgba(255,107,53,0.5)", "rgba(255,107,53,0)"]}
                ringMaxRadius={7.8}
                ringPropagationSpeed={1.9}
                ringRepeatPeriod={860}
                atmosphereColor="#d7dce3"
                atmosphereAltitude={0.14}
                enablePointerInteraction={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
