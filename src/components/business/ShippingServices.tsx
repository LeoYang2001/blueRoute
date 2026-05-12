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
  // Initial globe size deliberately small (320px wide) so the Three.js
  // canvas doesn't briefly render wider than a phone viewport before the
  // ResizeObserver below adjusts it to the host's actual clientWidth.
  // Without this, a momentary 520px-wide canvas can push the page wider
  // than viewport on mobile and cause a horizontal-scroll flash.
  const [globeSize, setGlobeSize] = useState({ width: 320, height: 320 });
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

  // Used by the mobile-only swap button to flip origin / destination.
  const swapRoute = () => {
    if (!originRegion || !destRegion) return;
    setOriginRegion(destRegion);
    setDestRegion(originRegion);
  };

  // Mobile dropdown change handlers. A `<select>` directly assigns the new
  // value, so we don't need the chip-click cycle logic. If the user picks
  // the same region for both sides via the dropdown, clear the other side
  // so we never end up with origin === destination.
  const handleOriginChange = (value: string) => {
    const name = (value || null) as RegionName | null;
    setOriginRegion(name);
    if (name && name === destRegion) setDestRegion(null);
  };

  const handleDestChange = (value: string) => {
    const name = (value || null) as RegionName | null;
    setDestRegion(name);
    if (name && name === originRegion) setOriginRegion(null);
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
      className="bg-[#f8f9fa] overflow-x-clip px-5 pt-14 pb-16 md:min-h-screen md:px-[7vw] md:py-36"
    >
      {/* Three grid children (Header / Controls / Globe) so we can place them
          independently. On mobile they stack in DOM order: header → controls
          → globe (matching the user's "globe under selector" ask). On desktop
          we use explicit grid-row/grid-col placement to recreate the original
          two-column layout: header + controls in column 1 (rows 1 and 2),
          globe spanning both rows in column 2. */}
      <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-12">
        {/* ─── Header (eyebrow + title + paragraph) ─── */}
        <div className="min-w-0 md:col-start-1 md:row-start-1">
          {/* Mobile-only chapter index above the eyebrow */}
          <motion.p
            className="mb-2 inline-flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#ff5c2f] md:hidden"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span>02</span>
            <span className="block h-px w-5 bg-[rgba(255,92,47,0.5)]" />
            <span className="text-[rgba(15,23,42,0.55)]">Reach</span>
          </motion.p>

          <motion.p
            className="mb-4 text-[0.7rem] uppercase tracking-[0.2em] text-[rgba(15,23,42,0.45)] md:mb-6 md:text-[0.75rem]"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Global Coverage
          </motion.p>

          <motion.h2
            className="m-0 max-w-[12.5ch] text-[clamp(1.9rem,8.4vw,5.8rem)] font-[560] leading-[1.02] tracking-[-0.04em] text-[#0d1118] md:leading-[0.94] md:tracking-[-0.045em]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.04 }}
          >
            Shipping Services &amp; Market Reach
          </motion.h2>

          <p className="mt-5 max-w-[58ch] break-words text-[0.94rem] leading-[1.55] md:mt-7 md:text-[1rem] md:leading-[1.68]">
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
        </div>

        {/* ─── Controls (From/To card + chips + status) ─── */}
        <div className="min-w-0 md:col-start-1 md:row-start-2">
          {/* Mobile-only From/To dropdown selector.
              Each side has an invisible native <select> stretched across the
              cell (absolute inset-0 + opacity-0) — tapping the cell pops the
              OS-native picker, which is the most usable option on touch
              devices. The visible UI shows the current selection with a
              chevron affordance so users know it's interactive. */}
          <div className="flex items-stretch gap-2 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] md:hidden">
            {/* From dropdown */}
            <div className="relative min-w-0 flex-1">
              <div className="text-[0.6rem] uppercase tracking-[0.15em] text-[rgba(15,23,42,0.42)]">
                From
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`min-w-0 flex-1 truncate text-[0.95rem] font-medium ${
                    originRegion
                      ? "text-[#0d1118]"
                      : "text-[rgba(15,23,42,0.35)]"
                  }`}
                >
                  {originRegion ?? "Select"}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className="shrink-0 text-[rgba(15,23,42,0.45)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </div>
              <select
                value={originRegion ?? ""}
                onChange={(e) => handleOriginChange(e.target.value)}
                aria-label="Select origin region"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="">Select</option>
                {REGIONS.map((r) => (
                  <option
                    key={r.name}
                    value={r.name}
                    disabled={r.name === destRegion}
                  >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap */}
            <button
              type="button"
              onClick={swapRoute}
              disabled={!originRegion || !destRegion}
              aria-label="Swap origin and destination"
              className="grid h-9 w-9 shrink-0 self-center place-items-center rounded-full border border-[rgba(15,23,42,0.12)] bg-white text-[#0d1118] transition-opacity duration-200 disabled:opacity-30"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 5h10M11 3l2 2-2 2M13 11H3M5 9l-2 2 2 2" />
              </svg>
            </button>

            {/* To dropdown — visual mirror of From, chevron on the right of
                the value still (but right-aligned column overall). */}
            <div className="relative min-w-0 flex-1">
              <div className="text-right text-[0.6rem] uppercase tracking-[0.15em] text-[rgba(15,23,42,0.42)]">
                To
              </div>
              <div className="mt-0.5 flex items-center justify-end gap-1.5">
                <span
                  className={`min-w-0 truncate text-right text-[0.95rem] font-medium ${
                    destRegion ? "text-[#0d1118]" : "text-[rgba(15,23,42,0.35)]"
                  }`}
                >
                  {destRegion ?? "Select"}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  className="shrink-0 text-[rgba(15,23,42,0.45)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </div>
              <select
                value={destRegion ?? ""}
                onChange={(e) => handleDestChange(e.target.value)}
                aria-label="Select destination region"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              >
                <option value="">Select</option>
                {REGIONS.map((r) => (
                  <option
                    key={r.name}
                    value={r.name}
                    disabled={r.name === originRegion}
                  >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop-only chip row. Mobile uses the dropdown selector above
              instead (native OS picker via hidden <select>). */}
          <ul className="mt-9 hidden flex-wrap gap-2.5 md:flex">
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
                  className={`flex shrink-0 list-none cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-[0.8rem] font-medium tracking-[0.03em] transition-colors duration-200 ${stateClass}`}
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

          {/* Mobile-only status line — shows the route in plain text right
              under the chip row so users know what they've selected without
              looking back at the From/To card. */}
          <motion.p
            key={`mobile-${statusText}`}
            className="mt-3 text-[0.78rem] text-[rgba(15,23,42,0.55)] md:hidden"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {statusText}
          </motion.p>

          {/* Desktop status line. */}
          <motion.p
            key={statusText}
            className="mt-4 hidden text-[0.82rem] text-[rgba(15,23,42,0.55)] md:block"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {statusText}
          </motion.p>
        </div>

        {/* ─── Globe ───
            Mobile: stacks below the controls (last in DOM order under
            single-column grid).  Desktop: explicitly placed in column 2,
            spanning both rows, so the original side-by-side layout is
            preserved. Reduced mobile height keeps the section compact and
            also gives the canvas a tighter aspect ratio than the previous
            empty-looking 344px. */}
        <div
          ref={globeHostRef}
          className="relative h-96 w-full overflow-visible md:h-150 md:col-start-2 md:row-span-2 md:row-start-1"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mobile scales the globe up considerably (1.5×) — the canvas
                itself is already viewport-sized, but the rendered globe sphere
                only takes ~50% of canvas height at the default altitude.
                Without this scale the globe looked like a tiny coin. Desktop
                stays at the original 1.06 nudge. */}
            <div className="origin-center scale-[1.5] md:scale-[1.06]">
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
