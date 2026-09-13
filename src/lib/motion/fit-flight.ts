import type { FlightPose } from "./sample-flight";

function smoothstep(value: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

/** Viewport fitting remains continuous at the cabin and side-flight boundaries. */
export function fitFlight(pose: FlightPose, progress: number, width: number, height: number): FlightPose {
  const fitted = { ...pose, jetPosition: [...pose.jetPosition] as [number, number, number], zoom: pose.zoom * height / 900 };
  if (width >= 760) return fitted;
  const cabin = smoothstep(progress, 0.28, 0.43) * (1 - smoothstep(progress, 0.6, 0.76));
  const early = 1 - smoothstep(progress, 0.6, 0.76);
  const fitCap = (width / 16.5) * (1 - cabin) + (height / 25) * cabin;
  fitted.zoom = fitted.zoom * (1 - early) + Math.min(fitted.zoom, fitCap) * early;
  fitted.jetPosition[2] += early * (2.5 + 2.4 * cabin);
  return fitted;
}
