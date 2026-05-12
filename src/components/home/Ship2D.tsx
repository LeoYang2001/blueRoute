import type { RefObject } from "react";

type Ship2DProps = {
  shipImgRef?: RefObject<HTMLImageElement | null>;
  bobOffset?: number;
};

export default function Ship2D({ shipImgRef, bobOffset = 0 }: Ship2DProps) {
  return (
    <img
      ref={shipImgRef}
      src="/heroSection/cargo.png"
      alt="Cargo vessel"
      className="absolute w-42.5 select-none pointer-events-none"
      style={{ transform: `translateY(${bobOffset}px)` }}
      draggable={false}
    />
  );
}
