import { useEffect, useMemo, useRef, useState } from "react";
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
  | "Southeast Asia"
  | "India"
  | "China"
  | "Singapore"
  | "Malaysia";

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
  // Pinned to Jakarta so the label doesn't overlap the new Singapore pin.
  { name: "Southeast Asia", lat: -6.21, lng: 106.85 },
  { name: "India", lat: 19.08, lng: 72.88 }, // Mumbai
  { name: "China", lat: 31.23, lng: 121.47 }, // Shanghai
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Malaysia", lat: 3.0, lng: 101.4 }, // Port Klang area
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
  // SE Asia tightened down to Indonesia/Philippines so it doesn't claim
  // China, India, Malaysia, or Singapore polygons.
  "Southeast Asia": { latMin: -10, latMax: 8, lngMin: 95, lngMax: 142 },
  India: { latMin: 8, latMax: 35, lngMin: 68, lngMax: 90 },
  China: { latMin: 22, latMax: 50, lngMin: 95, lngMax: 135 },
  // Tiny box around Singapore — Malaysia bounds start above it so the
  // Singapore polygon only matches one region.
  Singapore: { latMin: 1, latMax: 1.8, lngMin: 103.5, lngMax: 104.2 },
  Malaysia: { latMin: 2, latMax: 7, lngMin: 99, lngMax: 119.5 },
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
  // Two-step selection: pick an origin region, then a destination — an animated
  // arc draws between them. Defaults seed a route so the UI is non-empty on load.
  const [originRegion, setOriginRegion] = useState<RegionName | null>("Europe");
  const [destRegion, setDestRegion] = useState<RegionName | null>(
    "Southeast Asia",
  );

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
    const controls = globeRef.current.controls();
    controls.autoRotateSpeed = 0.42;
    controls.enableZoom = false;
    controls.enableRotate = false;
    controls.enablePan = false;
  }, [worldData]);

  // Camera / autoRotate behavior is driven by what's selected:
  //  - both endpoints: frame the midpoint of the great-circle arc
  //  - only origin: zoom to it
  //  - nothing: drift back to the default view and resume auto-rotate
  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();

    if (originRegion && destRegion) {
      const o = REGIONS.find((r) => r.name === originRegion);
      const d = REGIONS.find((r) => r.name === destRegion);
      if (!o || !d) return;
      const midLat = (o.lat + d.lat) / 2;
      // Handle dateline wrap so midpoint is on the short arc
      let lngDiff = d.lng - o.lng;
      if (lngDiff > 180) lngDiff -= 360;
      else if (lngDiff < -180) lngDiff += 360;
      let midLng = o.lng + lngDiff / 2;
      if (midLng > 180) midLng -= 360;
      if (midLng < -180) midLng += 360;

      controls.autoRotate = false;
      globeRef.current.pointOfView(
        { lat: midLat, lng: midLng, altitude: 2.4 },
        1500,
      );
    } else if (originRegion) {
      const o = REGIONS.find((r) => r.name === originRegion);
      if (!o) return;
      controls.autoRotate = false;
      globeRef.current.pointOfView(
        { lat: o.lat, lng: o.lng, altitude: 1.7 },
        1200,
      );
    } else {
      controls.autoRotate = true;
      globeRef.current.pointOfView(
        { lat: 18, lng: -28, altitude: 1.8 },
        1200,
      );
    }
  }, [originRegion, destRegion, worldData]);

  const handleRegionSelect = (region: RegionPoint & { name: RegionName }) => {
    // Click flow:
    //   click current origin       → clear both (full reset)
    //   click current destination  → clear destination only
    //   no origin yet              → set as origin
    //   origin set, no destination → set as destination (draw arc)
    //   both already set           → start over: clicked region becomes origin
    if (region.name === originRegion) {
      setOriginRegion(null);
      setDestRegion(null);
      return;
    }
    if (region.name === destRegion) {
      setDestRegion(null);
      return;
    }
    if (!originRegion) {
      setOriginRegion(region.name);
      return;
    }
    if (!destRegion) {
      setDestRegion(region.name);
      return;
    }
    setOriginRegion(region.name);
    setDestRegion(null);
  };

  // Arc payload for react-globe.gl's arcsData prop
  const arcsData = useMemo(() => {
    if (!originRegion || !destRegion) return [];
    const o = REGIONS.find((r) => r.name === originRegion);
    const d = REGIONS.find((r) => r.name === destRegion);
    if (!o || !d) return [];
    return [
      {
        startLat: o.lat,
        startLng: o.lng,
        endLat: d.lat,
        endLng: d.lng,
      },
    ];
  }, [originRegion, destRegion]);

  // Pulsing rings on whichever endpoints are currently selected
  const ringsData = useMemo(() => {
    const arr: Array<RegionPoint & { kind: "origin" | "destination" }> = [];
    if (originRegion) {
      const o = REGIONS.find((r) => r.name === originRegion);
      if (o) arr.push({ ...o, kind: "origin" });
    }
    if (destRegion) {
      const d = REGIONS.find((r) => r.name === destRegion);
      if (d) arr.push({ ...d, kind: "destination" });
    }
    return arr;
  }, [originRegion, destRegion]);

  const statusText = useMemo(() => {
    if (!originRegion) return "Tap a region to set an origin";
    if (!destRegion) return `${originRegion} → tap a destination`;
    return `${originRegion} → ${destRegion}`;
  }, [originRegion, destRegion]);

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
            {REGIONS.map((region, i) => {
              const isOrigin = originRegion === region.name;
              const isDest = destRegion === region.name;
              const stateClass = isOrigin
                ? "border-[#ff6b35] bg-[#ff6b35] text-white"
                : isDest
                  ? "border-[#ff6b35] bg-white text-[#ff6b35]"
                  : "border-[rgba(15,23,42,0.12)] bg-white text-[rgba(15,23,42,0.72)] hover:border-[rgba(255,107,53,0.45)] hover:text-[rgba(255,107,53,0.95)]";
              return (
                <motion.li
                  key={region.name}
                  className={`flex list-none cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-[0.8rem] font-medium tracking-[0.03em] transition-colors duration-200 ${stateClass}`}
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
                  {isOrigin && (
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] opacity-85">
                      From
                    </span>
                  )}
                  {isDest && (
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] opacity-85">
                      To
                    </span>
                  )}
                  {region.name}
                </motion.li>
              );
            })}
          </ul>

          <motion.p
            key={statusText}
            className="mt-4 text-[0.82rem] text-[rgba(15,23,42,0.55)]"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {statusText}
          </motion.p>
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
                hexPolygonColor={(feature) => {
                  const f = feature as GeoFeature;
                  if (originRegion && isRegionFeature(f, originRegion))
                    return "rgba(255, 107, 53, 0.95)";
                  if (destRegion && isRegionFeature(f, destRegion))
                    return "rgba(255, 107, 53, 0.6)";
                  return "rgba(210, 215, 223, 0.7)";
                }}
                pointsData={REGIONS}
                pointLat="lat"
                pointLng="lng"
                pointColor={(point) => {
                  const name = (point as RegionPoint).name;
                  if (name === originRegion || name === destRegion)
                    return "#ff6b35";
                  return "#6f7ca6";
                }}
                pointAltitude={0.02}
                pointRadius={0.32}
                labelsData={REGIONS}
                labelLat="lat"
                labelLng="lng"
                labelText="name"
                labelSize={1.05}
                labelDotRadius={0.32}
                labelColor={(label) => {
                  const name = (label as RegionPoint).name;
                  if (name === originRegion || name === destRegion)
                    return "rgba(255,107,53,0.95)";
                  return "rgba(55,73,128,0.8)";
                }}
                labelResolution={2}
                arcsData={arcsData}
                arcStartLat="startLat"
                arcStartLng="startLng"
                arcEndLat="endLat"
                arcEndLng="endLng"
                arcColor={() => [
                  "rgba(255,107,53,0.95)",
                  "rgba(255,107,53,0.35)",
                ]}
                arcStroke={0.55}
                arcAltitude={0.32}
                arcDashLength={0.4}
                arcDashGap={0.15}
                arcDashAnimateTime={2800}
                arcsTransitionDuration={1200}
                ringsData={ringsData}
                ringLat="lat"
                ringLng="lng"
                ringColor={() => ["rgba(255,107,53,0.55)", "rgba(255,107,53,0)"]}
                ringMaxRadius={6.5}
                ringPropagationSpeed={1.8}
                ringRepeatPeriod={900}
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
