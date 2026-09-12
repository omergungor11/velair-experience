import type { ChapterId } from "@/lib/motion/chapters";

export type Vector3Tuple = readonly [number, number, number];
export type QualityTier = "full" | "lite" | "static";

/** Motion owns these values; R3F reads them without per-frame React setState. */
export interface FlightState {
  progress: number;
  chapter: ChapterId;
  cameraPosition: Vector3Tuple;
  cameraTarget: Vector3Tuple;
  jetPosition: Vector3Tuple;
  jetRotation: Vector3Tuple;
  shellReveal: number;
  cloudOpacity: number;
}

/** Asset node names and local axes are specified in docs/ASSETS.md. */
export const jetNodes = [
  "JetRoot", "FuselageLower", "FuselageUpper", "Wings", "Tail",
  "Engines", "CabinFloor", "Seats", "Tables", "Windows",
] as const;
