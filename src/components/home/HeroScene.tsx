import { useEffect, useRef, useState } from "react";
import Kite3D from "./Kite3D";
import { KITE_STRING_ANCHOR_OFFSET } from "./Kite3D";
import "../../css/App.css";
import Ship2D from "./Ship2D";

type WakeParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SHIP_BOB_AMPLITUDE = 10;
// const SHIP_BOB_FREQUENCY = 0.00006;
const SHIP_BOB_FREQUENCY = 0.0009;

export default function HeroScene() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const shipImgRef = useRef<HTMLImageElement | null>(null);

  const shipRef = useRef({
    x: window.innerWidth * 0.52,
    y: window.innerHeight * 0.68,
  });

  const kiteRef = useRef({
    x: window.innerWidth * 0.62,
    y: window.innerHeight * 0.36,
  });

  const targetRef = useRef({
    x: window.innerWidth * 0.62,
    y: window.innerHeight * 0.36,
  });

  const [kiteRender, setKiteRender] = useState(kiteRef.current);
  const [shipBobOffset, setShipBobOffset] = useState(0);
  const [, setWakeParticles] = useState<WakeParticle[]>([]);

  const particleId = useRef(0);
  const wakeTimer = useRef(0);

  const syncShipCenter = () => {
    const sceneRect = sceneRef.current?.getBoundingClientRect();
    const shipRect = shipImgRef.current?.getBoundingClientRect();
    if (!sceneRect || !shipRect) return;

    const centerX = shipRect.left - sceneRect.left + shipRect.width / 2;
    const centerY = shipRect.top - sceneRect.top + shipRect.height / 2;
    shipRef.current = { x: centerX, y: centerY };
  };

  // Touch devices and phones lack a meaningful "mouse" — make the kite drift
  // back and forth on its own instead of chasing the (nonexistent) cursor.
  const isTouchRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches,
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Touch devices still emit synthetic mouse events on tap. Ignore them
      // so the kite stays in self-drift mode.
      if (isTouchRef.current) return;
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;

      syncShipCenter();

      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      const ship = shipRef.current;

      targetRef.current = {
        x: Math.max(ship.x - 220, Math.min(ship.x + 220, rawX)),
        y: Math.max(ship.y - 320, Math.min(ship.y - 110, rawY)),
      };
    };

    const onResize = () => {
      syncShipCenter();
      // Re-evaluate touch-ness on resize/rotate so toggling devtools or
      // rotating an iPad updates the kite behavior live.
      isTouchRef.current = window.matchMedia(
        "(hover: none), (pointer: coarse)",
      ).matches;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = now - last;
      last = now;

      syncShipCenter();

      const kite = kiteRef.current;
      const ship = shipRef.current;

      // On touch devices the kite drives its own target with a slow Lissajous-
      // style drift anchored to the ship. The X swings further than Y so it
      // reads as "floating left/right" with a subtle vertical bob.
      if (isTouchRef.current) {
        const driftX = Math.sin(now * 0.00045) * 160;
        const driftY = Math.cos(now * 0.00032) * 32 - 200;
        targetRef.current = {
          x: ship.x + driftX,
          y: ship.y + driftY,
        };
      }

      const target = targetRef.current;

      kite.x = lerp(kite.x, target.x, 0.08);
      kite.y = lerp(kite.y, target.y, 0.08);
      setShipBobOffset(Math.sin(now * SHIP_BOB_FREQUENCY) * SHIP_BOB_AMPLITUDE);

      wakeTimer.current += dt;

      if (wakeTimer.current > 45) {
        wakeTimer.current = 0;

        const leftX = ship.x - 16 + (Math.random() - 0.5) * 8;
        const rightX = ship.x + 16 + (Math.random() - 0.5) * 8;
        const startY = ship.y + 52;

        const particles: WakeParticle[] = [
          {
            id: particleId.current++,
            x: leftX,
            y: startY,
            size: 10 + Math.random() * 8,
            life: 0,
            maxLife: 900 + Math.random() * 300,
          },
          {
            id: particleId.current++,
            x: rightX,
            y: startY,
            size: 10 + Math.random() * 8,
            life: 0,
            maxLife: 900 + Math.random() * 300,
          },
        ];

        setWakeParticles((prev) => [...prev.slice(-80), ...particles]);
      }

      setWakeParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            life: p.life + dt,
            y: p.y + 0.08 * dt,
            size: p.size + 0.015 * dt,
          }))
          .filter((p) => p.life < p.maxLife),
      );

      setKiteRender({ x: kite.x, y: kite.y });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ship = shipRef.current;

  const ropeStart = { x: ship.x, y: ship.y - 18 };
  const ropeEnd = {
    x: kiteRender.x + KITE_STRING_ANCHOR_OFFSET.x,
    y: kiteRender.y + KITE_STRING_ANCHOR_OFFSET.y,
  };

  return (
    <div
      className="heroScene  flex  flex-col justify-end items-center"
      ref={sceneRef}
    >
      <Kite3D x={kiteRender.x} y={kiteRender.y} />

      <div className=" w-50 h-100 mb-10 translate-x-2 flex justify-center items-end  ">
        <Ship2D shipImgRef={shipImgRef} bobOffset={shipBobOffset} />
      </div>
      <svg className="heroScene__rope">
        <line
          x1={ropeStart.x}
          y1={ropeStart.y}
          x2={ropeEnd.x}
          y2={ropeEnd.y}
          stroke="rgba(30,30,30,0.55)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
