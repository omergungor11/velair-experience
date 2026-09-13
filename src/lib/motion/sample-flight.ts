type Vector3Tuple = [number, number, number];

export type FlightPose = {
  jetPosition: Vector3Tuple;
  /** Euler XYZ angles, in radians; there are no wraparound discontinuities. */
  jetRotation: Vector3Tuple;
  cameraPosition: Vector3Tuple;
  cameraTarget: Vector3Tuple;
  /** Orthographic zoom at a viewport height of 900 CSS pixels. */
  zoom: number;
  /** Cabin shell opening: 0 is closed, 1 is fully open. */
  reveal: number;
  /** Cloud density/opacity envelope, normalized to [0, 1]. */
  cloud: number;
};

type FlightKeyframe = FlightPose & {
  at: number;
  mobilePosition: Vector3Tuple;
  mobileZoom: number;
};

// Nose points along local -Z; Y is up. The camera's positive Z offset is
// deliberately nonzero even in plan view, keeping lookAt away from its up axis.
const keyframes: readonly FlightKeyframe[] = [
  {
    at: 0,
    jetPosition: [4.5, 0, 0], jetRotation: [0, -0.08, 0],
    cameraPosition: [0, 26, 5], cameraTarget: [0, 0, 0],
    zoom: 46, reveal: 0, cloud: 0.3,
    mobilePosition: [0, 0, 0], mobileZoom: 28,
  },
  {
    at: 0.1,
    jetPosition: [4.5, 0, -0.1], jetRotation: [0, -0.08, 0],
    cameraPosition: [0, 26, 5], cameraTarget: [0, 0, 0],
    zoom: 47, reveal: 0, cloud: 0.34,
    mobilePosition: [0, 0, -0.1], mobileZoom: 28,
  },
  {
    at: 0.18,
    jetPosition: [4.1, 0, -0.15], jetRotation: [0, -0.06, 0],
    cameraPosition: [0, 26, 4], cameraTarget: [0, 0, 0],
    zoom: 49, reveal: 0, cloud: 0.46,
    mobilePosition: [0, 0, -0.15], mobileZoom: 29,
  },
  {
    at: 0.26,
    jetPosition: [3.3, 0, -0.05], jetRotation: [0, -0.025, 0],
    cameraPosition: [0, 25.5, 2], cameraTarget: [0, 0, 0],
    zoom: 56, reveal: 0, cloud: 0.85,
    mobilePosition: [0, 0, -0.05], mobileZoom: 34,
  },
  {
    at: 0.31,
    jetPosition: [2.9, 0, 0], jetRotation: [0, -0.01, 0],
    cameraPosition: [0, 25, 0.6], cameraTarget: [0, 0, 0],
    zoom: 60, reveal: 0, cloud: 1,
    mobilePosition: [0, 0, 0], mobileZoom: 40,
  },
  {
    at: 0.34,
    jetPosition: [2.6, 0, 0], jetRotation: [0, 0, 0],
    cameraPosition: [0, 25, 0.01], cameraTarget: [0, 0, 0],
    zoom: 63, reveal: 0, cloud: 0.76,
    mobilePosition: [0, 0, 0], mobileZoom: 44,
  },
  {
    at: 0.43,
    jetPosition: [2.6, 0, 0], jetRotation: [0, 0, 0],
    cameraPosition: [0, 25, 0.01], cameraTarget: [0, 0, 0],
    zoom: 70, reveal: 1, cloud: 0.12,
    mobilePosition: [0, 0, 0], mobileZoom: 50,
  },
  {
    at: 0.55,
    jetPosition: [2.6, 0, 0], jetRotation: [0, 0, 0],
    cameraPosition: [0, 25, 0.01], cameraTarget: [0, 0, 0],
    zoom: 70, reveal: 1, cloud: 0.12,
    mobilePosition: [0, 0, 0], mobileZoom: 50,
  },
  {
    at: 0.6,
    jetPosition: [2.6, 0, 0], jetRotation: [0, 0, 0],
    cameraPosition: [0, 25, 0.01], cameraTarget: [0, 0, 0],
    zoom: 64, reveal: 1, cloud: 0.18,
    mobilePosition: [0, 0, 0], mobileZoom: 45,
  },
  {
    at: 0.68,
    jetPosition: [2.6, 0, 0], jetRotation: [0, 0, 0],
    cameraPosition: [0, 25, 0.01], cameraTarget: [0, 0, 0],
    zoom: 43, reveal: 0, cloud: 0.28,
    mobilePosition: [0, 0, 0], mobileZoom: 27,
  },
  {
    at: 0.76,
    jetPosition: [-13, 1, 0], jetRotation: [0, -Math.PI / 2, -0.025],
    cameraPosition: [0, 6, 25], cameraTarget: [0, 0, 0],
    zoom: 42, reveal: 0, cloud: 0.48,
    mobilePosition: [-9, 7, 0], mobileZoom: 24,
  },
  {
    at: 0.9,
    jetPosition: [13, 1, 0], jetRotation: [0, -Math.PI / 2, 0.02],
    cameraPosition: [0, 6, 25], cameraTarget: [0, 0, 0],
    zoom: 42, reveal: 0, cloud: 0.26,
    mobilePosition: [9, 7, 0], mobileZoom: 24,
  },
  {
    at: 0.94,
    jetPosition: [17, 2, -8], jetRotation: [0.04, -1.42, 0.045],
    cameraPosition: [0, 8, 26], cameraTarget: [0, 0, 0],
    zoom: 28, reveal: 0, cloud: 0.22,
    mobilePosition: [11, 8, -8], mobileZoom: 15,
  },
  {
    at: 1,
    jetPosition: [22, 3, -22], jetRotation: [0.12, -1.12, 0.02],
    cameraPosition: [0, 10, 27], cameraTarget: [0, 0, 0],
    zoom: 12, reveal: 0, cloud: 0.16,
    mobilePosition: [13, 10, -22], mobileZoom: 7,
  },
];

function mix(from: number, to: number, weight: number) {
  return from + (to - from) * weight;
}

function mixVector(from: Vector3Tuple, to: Vector3Tuple, weight: number): Vector3Tuple {
  return [mix(from[0], to[0], weight), mix(from[1], to[1], weight), mix(from[2], to[2], weight)];
}

/**
 * Absolute, stateless sampling: reverse scroll, deep links and jumps have the
 * same pose as forward playback. Returned tuples are owned by the caller.
 * Scale zoom by viewportHeight / 900 in the orthographic rig. Narrow mobile
 * viewports may further cap zoom for wingspan fit; the cabin intentionally
 * comes closer so its interior remains legible.
 */
export function sampleFlight(progress: number, mobile = false): FlightPose {
  const clamped = Number.isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress));
  let index = 0;

  while (index < keyframes.length - 2 && clamped > keyframes[index + 1].at) {
    index += 1;
  }

  const from = keyframes[index];
  const to = keyframes[index + 1];
  const local = (clamped - from.at) / (to.at - from.at);
  // Smoothstep has zero endpoint velocity. Shared keyframes therefore preserve
  // both pose and velocity continuity without overshoot or a second clock.
  const weight = local * local * (3 - 2 * local);

  return {
    jetPosition: mixVector(mobile ? from.mobilePosition : from.jetPosition, mobile ? to.mobilePosition : to.jetPosition, weight),
    jetRotation: mixVector(from.jetRotation, to.jetRotation, weight),
    cameraPosition: mixVector(from.cameraPosition, to.cameraPosition, weight),
    cameraTarget: mixVector(from.cameraTarget, to.cameraTarget, weight),
    zoom: mix(mobile ? from.mobileZoom : from.zoom, mobile ? to.mobileZoom : to.zoom, weight),
    reveal: mix(from.reveal, to.reveal, weight),
    cloud: mix(from.cloud, to.cloud, weight),
  };
}
