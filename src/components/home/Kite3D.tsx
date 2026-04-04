import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Props = {
  x: number;
  y: number;
};

export const KITE_STRING_ANCHOR_OFFSET = {
  x: 0,
  y: 62,
};

function KiteMesh() {
  const ref = useRef<THREE.Group>(null);

  const canopyTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#ff935f");
    gradient.addColorStop(0.45, "#ff6f3b");
    gradient.addColorStop(1, "#e84f1f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "#ffd7c6";
    ctx.lineWidth = 3;
    for (let i = 1; i < 9; i += 1) {
      const x = (size / 9) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 2200; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const a = Math.random() * Math.PI * 2;
      const len = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const canopyRoughnessTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "rgb(210 210 210)";
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 6000; i += 1) {
      const v = 170 + Math.random() * 60;
      ctx.fillStyle = `rgb(${v} ${v} ${v})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }

    ctx.strokeStyle = "rgb(240 240 240)";
    ctx.globalAlpha = 0.35;
    for (let i = 1; i < 9; i += 1) {
      const x = (size / 9) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    return () => {
      canopyTexture?.dispose();
      canopyRoughnessTexture?.dispose();
    };
  }, [canopyTexture, canopyRoughnessTexture]);

  const stringPairs: Array<
    [[number, number, number], [number, number, number]]
  > = [
    [
      [-0.14, -0.58, 0.03],
      [-0.96, 0.48, 0.06],
    ],
    [
      [-0.1, -0.58, 0.03],
      [-0.7, 0.52, 0.1],
    ],
    [
      [-0.06, -0.58, 0.03],
      [-0.44, 0.54, 0.13],
    ],
    [
      [-0.02, -0.58, 0.03],
      [-0.16, 0.56, 0.14],
    ],
    [
      [0.02, -0.58, 0.03],
      [0.16, 0.56, 0.14],
    ],
    [
      [0.06, -0.58, 0.03],
      [0.44, 0.54, 0.13],
    ],
    [
      [0.1, -0.58, 0.03],
      [0.7, 0.52, 0.1],
    ],
    [
      [0.14, -0.58, 0.03],
      [0.96, 0.48, 0.06],
    ],
  ];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 1.1) * 0.24;
    ref.current.rotation.x = -0.2 + Math.cos(t * 1.5) * 0.06;
    ref.current.rotation.z = Math.sin(t * 1.8) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[1.15, 32, 32, 0.2, Math.PI - 0.4, 0, 1.2]} />
        <meshPhysicalMaterial
          map={canopyTexture ?? undefined}
          roughnessMap={canopyRoughnessTexture ?? undefined}
          color="#ff6b3b"
          roughness={0.88}
          metalness={0.02}
          clearcoat={0.08}
          clearcoatRoughness={0.92}
          sheen={0.35}
          sheenRoughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, -0.88, 0]}>
        <capsuleGeometry args={[0.12, 0.32, 8, 16]} />
        <meshStandardMaterial
          color="#d7d7d7"
          roughness={0.75}
          metalness={0.05}
        />
      </mesh>

      {stringPairs.map(([from, to], idx) => (
        <Line
          key={idx}
          points={[from, to]}
          color="#2f3d4a"
          lineWidth={1}
          transparent
          opacity={0.95}
        />
      ))}
    </group>
  );
}

export default function Kite3D({ x, y }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 220,
        height: 200,
        transform: "translate(-50%, -50%)",
        zIndex: 6,
        pointerEvents: "none",
      }}
      className=""
    >
      <Canvas
        camera={{ position: [0, 0, 4.3], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 4]} intensity={2.2} />
        <directionalLight position={[-2, 1, 3]} intensity={0.7} />
        <Float speed={2} rotationIntensity={0.35} floatIntensity={0.32}>
          <KiteMesh />
        </Float>
      </Canvas>
    </div>
  );
}
