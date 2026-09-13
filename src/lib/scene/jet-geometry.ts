import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Matrix4,
  Shape,
  ExtrudeGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/** Original parametric aircraft; Y-up, nose -Z. No downloaded model assets. */
export type JetFinish =
  | "pearl" | "wingPanel" | "silver" | "dark" | "ink" | "gold"
  | "leather" | "ivory" | "wood" | "woodLight" | "rug" | "light";

export type JetGeometryPart = {
  name: string;
  material: JetFinish;
  geometry: BufferGeometry;
};

type Bucket = Map<string, { name: string; material: JetFinish; items: BufferGeometry[] }>;
type Point = readonly [number, number, number];

// z, horizontal radius, vertical radius, local vertical centre.
const stations = [
  [-7.1, 0.012, 0.013, -0.13],
  [-6.8, 0.2, 0.2, -0.10],
  [-6.3, 0.40, 0.38, -0.055],
  [-5.65, 0.59, 0.58, 0.01],
  [-4.8, 0.735, 0.74, 0.04],
  [-3.95, 0.8, 0.79, 0.025],
  [-2.1, 0.81, 0.8, 0],
  [1.6, 0.8, 0.79, 0],
  [3.65, 0.755, 0.73, 0.015],
  [4.7, 0.57, 0.57, 0.04],
  [5.6, 0.335, 0.36, 0.07],
  [6.4, 0.16, 0.21, 0.1],
  [7.1, 0.018, 0.024, 0.15],
] as const;

// Cubic Hermite interpolation keeps the long body fair while tapering both ends.
function radiusAt(z: number, channel: 1 | 2 | 3): number {
  let i = 0;
  while (i < stations.length - 2 && stations[i + 1][0] < z) i++;
  const a = stations[i];
  const b = stations[i + 1];
  const prev = stations[Math.max(0, i - 1)];
  const next = stations[Math.min(stations.length - 1, i + 2)];
  const span = b[0] - a[0];
  const t = Math.min(1, Math.max(0, (z - a[0]) / span));
  const m0 = (b[channel] - prev[channel]) / (b[0] - prev[0]);
  const m1 = (next[channel] - a[channel]) / (next[0] - a[0]);
  return (2 * t ** 3 - 3 * t * t + 1) * a[channel]
    + (t ** 3 - 2 * t * t + t) * m0 * span
    + (-2 * t ** 3 + 3 * t * t) * b[channel]
    + (t ** 3 - t * t) * m1 * span;
}

function hullPoint(z: number, theta: number, offset = 0): Point {
  return [
    Math.sin(theta) * (radiusAt(z, 1) + offset),
    Math.cos(theta) * (radiusAt(z, 2) + offset) + radiusAt(z, 3),
    z,
  ];
}

function gridGeometry(rows: Point[][], flip = false): BufferGeometry {
  const position: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const width = rows[0].length;
  rows.forEach((row, y) => row.forEach((point, x) => {
    position.push(...point);
    uv.push(x / (width - 1), y / (rows.length - 1));
  }));
  for (let y = 0; y < rows.length - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const a = y * width + x;
      if (flip) index.push(a, a + width, a + 1, a + 1, a + width, a + width + 1);
      else index.push(a, a + 1, a + width, a + 1, a + width + 1, a + width);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function hull(zStart: number, zEnd: number, angleStart: number, angleEnd: number, offset = 0) {
  const longitudinal = Math.max(8, Math.round((zEnd - zStart) * 9));
  const circumferential = Math.max(8, Math.round(Math.abs(angleEnd - angleStart) * 13));
  const rows: Point[][] = [];
  for (let z = 0; z <= longitudinal; z++) {
    const row: Point[] = [];
    for (let a = 0; a <= circumferential; a++) {
      row.push(hullPoint(zStart + (zEnd - zStart) * z / longitudinal,
        angleStart + (angleEnd - angleStart) * a / circumferential, offset));
    }
    rows.push(row);
  }
  return gridGeometry(rows, true);
}

function box(size: Point, at: Point, radius = 0, rotation?: Point) {
  const geometry = radius
    ? new RoundedBoxGeometry(...size, 2, radius)
    : new BoxGeometry(...size);
  if (rotation) {
    geometry.rotateX(rotation[0]); geometry.rotateY(rotation[1]); geometry.rotateZ(rotation[2]);
  }
  return geometry.translate(...at);
}

function sphere(size: Point, at: Point) {
  return new SphereGeometry(1, 16, 10).scale(...size).translate(...at);
}

function tubeBetween(start: Point, end: Point, radius: number, radialSegments = 8) {
  const a = new Vector3(...start);
  const b = new Vector3(...end);
  const direction = b.clone().sub(a);
  const geometry = new CylinderGeometry(radius, radius, direction.length(), radialSegments);
  const matrix = new Matrix4();
  matrix.lookAt(new Vector3(), direction, new Vector3(0, 0, 1));
  geometry.rotateX(Math.PI / 2).applyMatrix4(matrix);
  return geometry.translate(...a.add(b).multiplyScalar(0.5).toArray());
}

/** A closed, cambered wing from span sections: x, y, leading Z, trailing Z, thickness. */
function airfoil(sections: readonly (readonly [number, number, number, number, number])[], side: number) {
  const top: Point[][] = [];
  const bottom: Point[][] = [];
  const samples = 22;
  for (const [x, y, leading, trailing, thickness] of sections) {
    const topRow: Point[] = [];
    const bottomRow: Point[] = [];
    for (let i = 0; i <= samples; i++) {
      const t = (1 - Math.cos(Math.PI * i / samples)) / 2;
      const profile = Math.max(0, 0.2969 * Math.sqrt(t) - 0.126 * t - 0.3516 * t * t + 0.2843 * t ** 3 - 0.1036 * t ** 4) * 5;
      const camber = 0.035 * Math.sin(Math.PI * t);
      const z = leading + (trailing - leading) * t;
      topRow.push([x * side, y + thickness * profile + camber, z]);
      bottomRow.push([x * side, y - thickness * profile * 0.6 + camber, z]);
    }
    top.push(topRow); bottom.push(bottomRow);
  }
  const upper = gridGeometry(top, side < 0);
  const lower = gridGeometry(bottom, side > 0);
  const tip = gridGeometry([top.at(-1)!, bottom.at(-1)!], side > 0);
  return join([upper, lower, tip]);
}

/** A flush control-surface skin, sampled from the wing's own airfoil. */
function wingControlPanel(sections: readonly (readonly [number, number, number, number, number])[], side: number) {
  const rows: Point[][] = [];
  for (const [x, y, leading, trailing, thickness] of sections) {
    const row: Point[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = 0.74 + i / 8 * 0.23;
      const profile = Math.max(0, 0.2969 * Math.sqrt(t) - 0.126 * t - 0.3516 * t * t + 0.2843 * t ** 3 - 0.1036 * t ** 4) * 5;
      row.push([x * side, y + thickness * profile + 0.035 * Math.sin(Math.PI * t) + 0.008, leading + (trailing - leading) * t]);
    }
    rows.push(row);
  }
  return gridGeometry(rows, side < 0);
}

function fin(points: readonly (readonly [number, number])[], thickness: number, x = 0) {
  const shape = new Shape();
  points.forEach(([z, y], index) => index ? shape.lineTo(z, y) : shape.moveTo(z, y));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.035, bevelThickness: 0.025, curveSegments: 1 });
  // Shape's X is aircraft Z; the extrusion's Z is aircraft X.
  geometry.rotateY(-Math.PI / 2).translate(x + thickness / 2, 0, 0);
  return geometry;
}

function join(geometries: BufferGeometry[]) {
  const normalized = geometries.map((geometry) => {
    const result = geometry.index ? geometry.toNonIndexed() : geometry;
    // All source parts provide the same position/normal/UV contract.
    for (const name of Object.keys(result.attributes)) {
      if (!["position", "normal", "uv"].includes(name)) result.deleteAttribute(name);
    }
    return result;
  });
  const merged = mergeGeometries(normalized, false);
  if (!merged) throw new Error("Jet geometry could not be merged");
  geometries.forEach((geometry) => geometry.dispose());
  normalized.forEach((geometry) => geometry.dispose());
  merged.computeBoundingSphere();
  return merged;
}

function add(bucket: Bucket, name: string, material: JetFinish, geometry: BufferGeometry) {
  const key = `${name}-${material}`;
  if (!bucket.has(key)) bucket.set(key, { name, material, items: [] });
  bucket.get(key)!.items.push(geometry);
}

function finish(bucket: Bucket): JetGeometryPart[] {
  return [...bucket.values()].map(({ name, material, items }) => ({ name, material, geometry: join(items) }));
}

export function createJetGeometries(): {
  exterior: JetGeometryPart[];
  upper: JetGeometryPart[];
  cabin: JetGeometryPart[];
} {
  const exterior: Bucket = new Map();
  const upper: Bucket = new Map();
  const cabin: Bucket = new Map();

  add(exterior, "FuselageLower", "pearl", hull(-7.1, 7.1, Math.PI / 2, Math.PI * 1.5));
  add(exterior, "Nose", "pearl", hull(-7.1, -4.12, -Math.PI / 2, Math.PI / 2));
  add(exterior, "TailCone", "pearl", hull(4.12, 7.1, -Math.PI / 2, Math.PI / 2));
  add(upper, "FuselageUpper", "pearl", hull(-4.12, 4.12, -Math.PI / 2, Math.PI / 2));

  // Four individually separated cockpit panes follow the actual compound hull curvature.
  for (const side of [-1, 1]) {
    add(exterior, "CockpitGlazing", "dark", hull(-5.63, -4.86, side < 0 ? -0.84 : 0.065, side < 0 ? -0.065 : 0.84, 0.018));
    add(exterior, "CockpitGlazing", "dark", hull(-5.17, -4.38, side < 0 ? -1.32 : 0.91, side < 0 ? -0.91 : 1.32, 0.018));

    // Understated livery on both flanks; champagne pinstripe above navy.
    const stripeAngle = side * Math.PI / 2;
    add(exterior, "FuselageTrim", "ink", hull(-4.8, 5.95, stripeAngle + (side < 0 ? -0.1 : 0.035), stripeAngle + (side < 0 ? -0.035 : 0.1), 0.008));
    add(exterior, "FuselageTrim", "gold", hull(-4.8, 5.75, stripeAngle + (side < 0 ? -0.025 : 0.017), stripeAngle + (side < 0 ? -0.017 : 0.025), 0.01));

    // Polished oval surrounds and inset dark glazing, kept with the lifting shell.
    for (let i = 0; i < 9; i++) {
      const z = -3.52 + i * 0.82;
      const angle = side * 1.055;
      const [x, y] = hullPoint(z, angle, 0.015);
      const ring = sphere([0.032, 0.168, 0.217], [0, 0, 0]);
      ring.rotateZ(side * 0.5).translate(x, y, z);
      add(upper, "Windows", "silver", ring);
      const pane = sphere([0.035, 0.143, 0.182], [0, 0, 0]);
      pane.rotateZ(side * 0.5).translate(x + side * 0.023, y + 0.014, z);
      add(upper, "Windows", "dark", pane);
    }

    const mainWing = [
      [0.48, -0.20, -0.75, 3.14, 0.27],
      [1.26, -0.16, -0.38, 3.21, 0.24],
      [3.45, -0.055, 0.97, 3.17, 0.15],
      [5.95, 0.12, 2.47, 3.18, 0.065],
      [6.68, 0.25, 2.95, 3.36, 0.035],
      [6.98, 0.95, 3.18, 3.56, 0.025],
      [7.02, 1.23, 3.40, 3.60, 0.012],
    ] as const;
    add(exterior, "Wings", "pearl", airfoil(mainWing, side));
    add(exterior, "WingControlSurfaces", "wingPanel", wingControlPanel(mainWing.slice(1, 4), side));
    // Leading edge and carefully inset flap seams.
    for (let i = 0; i < mainWing.length - 1; i++) {
      const a = mainWing[i]; const b = mainWing[i + 1];
      add(exterior, "WingEdges", "silver", tubeBetween([side * a[0], a[1], a[2] + 0.025], [side * b[0], b[1], b[2] + 0.025], i < 3 ? 0.02 : 0.012));
    }
    add(exterior, "WingDetails", "ink", tubeBetween([side * 1.26, -0.09, 2.52], [side * 5.90, 0.17, 3.01], 0.008, 5));
    add(exterior, "WingDetails", "ink", tubeBetween([side * 3.80, 0.045, 1.70], [side * 3.78, 0.032, 3.17], 0.007, 5));
    add(exterior, "WingDetails", "gold", tubeBetween([side * 6.77, 0.48, 3.18], [side * 6.96, 1.06, 3.48], 0.018));
    // Three streamlined flap-track fairings under each wing.
    for (let i = 0; i < 3; i++) {
      add(exterior, "Wings", "pearl", sphere([0.07, 0.085, 0.48 - i * 0.07], [side * (1.9 + i * 1.12), -0.16 + i * 0.05, 3.08]));
    }

    add(exterior, "Tail", "pearl", airfoil([
      [0.055, 2.32, 5.63, 7.00, 0.105],
      [1.38, 2.39, 6.18, 7.16, 0.07],
      [2.66, 2.48, 6.78, 7.24, 0.028],
    ], side));
    add(exterior, "TailTrim", "silver", tubeBetween([side * 0.055, 2.32, 5.65], [side * 2.66, 2.48, 6.80], 0.018));

    // Rear nacelles: faired body, recessed intake, bright lip, actual visible fan blades.
    const engineX = side * 1.22;
    const engineY = 0.52;
    const nacelleRows: Point[][] = [];
    const nacelleProfile = [[3.01, 0.395], [3.12, 0.443], [3.34, 0.46], [4.10, 0.435], [4.7, 0.34], [5.13, 0.245]];
    for (const [z, radius] of nacelleProfile) {
      nacelleRows.push(Array.from({ length: 33 }, (_, i) => [engineX + Math.sin(i / 32 * Math.PI * 2) * radius, engineY + Math.cos(i / 32 * Math.PI * 2) * radius, z] as Point));
    }
    add(exterior, "Engines", "pearl", gridGeometry(nacelleRows, true));
    add(exterior, "EngineMounts", "pearl", box([0.65, 0.18, 1.48], [side * 0.85, 0.40, 4.08], 0.07, [0, side * -0.08, side * 0.1]));
    const intake = new TorusGeometry(0.384, 0.033, 8, 32).translate(engineX, engineY, 3.015);
    add(exterior, "EngineMetal", "silver", intake);
    const cavity = new CylinderGeometry(0.366, 0.34, 0.34, 28, 1, true).rotateX(Math.PI / 2).translate(engineX, engineY, 3.19);
    add(exterior, "EngineCavity", "dark", cavity);
    add(exterior, "EngineCavity", "dark", new CylinderGeometry(0.34, 0.34, 0.015, 28).rotateX(Math.PI / 2).translate(engineX, engineY, 3.365));
    add(exterior, "EngineMetal", "silver", new CylinderGeometry(0.24, 0.18, 0.27, 24, 1, true).rotateX(Math.PI / 2).translate(engineX, engineY, 5.14));
    add(exterior, "EngineCavity", "dark", new CylinderGeometry(0.18, 0.18, 0.01, 24).rotateX(Math.PI / 2).translate(engineX, engineY, 5.22));
    for (let blade = 0; blade < 14; blade++) {
      const angle = blade / 14 * Math.PI * 2;
      const bladeGeometry = box([0.037, 0.25, 0.012], [0.06, 0.18, 0], 0, [0.15, 0.24, -0.20]);
      bladeGeometry.rotateZ(angle).translate(engineX, engineY, 3.348);
      add(exterior, "EngineFans", "silver", bladeGeometry);
    }
    add(exterior, "EngineFans", "silver", sphere([0.11, 0.11, 0.20], [engineX, engineY, 3.23]));
  }

  add(exterior, "Tail", "pearl", fin([[4.04, 0.49], [4.56, 0.70], [5.57, 2.58], [6.29, 2.59], [7.01, 0.19]], 0.11));
  add(exterior, "TailMark", "ink", fin([[5.17, 1.31], [5.68, 2.30], [6.12, 2.32], [6.70, 0.60], [6.40, 0.62]], 0.008, 0.067));
  add(exterior, "TailMark", "ink", fin([[5.17, 1.31], [5.68, 2.30], [6.12, 2.32], [6.70, 0.60], [6.40, 0.62]], 0.008, -0.075));

  // Narrow circular cutaway sills cover the outer wall thickness.
  for (const side of [-1, 1]) {
    add(cabin, "CabinWalls", "ivory", box([0.075, 0.32, 7.96], [side * 0.715, -0.085, 0], 0.025));
    add(cabin, "CabinSill", "gold", tubeBetween([side * 0.758, 0.04, -4.04], [side * 0.745, 0.04, 4.04], 0.018));
    add(cabin, "CabinLighting", "light", box([0.022, 0.016, 7.66], [side * 0.662, -0.035, 0]));
  }
  add(cabin, "CabinFloor", "wood", box([1.39, 0.09, 8.12], [0, -0.35, 0], 0.05));
  add(cabin, "CabinFloor", "rug", box([0.33, 0.014, 7.70], [0, -0.293, 0.05], 0.035));
  // Inlaid longitudinal wood strips provide grain scale without texture downloads.
  for (let i = 0; i < 12; i++) {
    const x = -0.63 + i * 0.115;
    add(cabin, "CabinInlay", "woodLight", box([0.006, 0.005, 7.98], [x, -0.3, 0]));
  }

  function chair(x: number, z: number, facing = 1) {
    const parts: [JetFinish, BufferGeometry][] = [];
    // Rounded leather cushions, separate reclined back and dark timber plinth.
    parts.push(["wood", box([0.45, 0.075, 0.52], [0, -0.215, 0], 0.025)]);
    parts.push(["leather", box([0.43, 0.15, 0.46], [0, -0.11, 0], 0.065)]);
    parts.push(["leather", box([0.42, 0.46, 0.14], [0, 0.13, 0.245], 0.055, [-0.13, 0, 0])]);
    parts.push(["ivory", box([0.29, 0.135, 0.06], [0, 0.30, 0.145], 0.027, [-0.13, 0, 0])]);
    for (const side of [-1, 1]) {
      parts.push(["leather", box([0.066, 0.10, 0.46], [side * 0.24, 0.025, 0.01], 0.026)]);
      parts.push(["gold", tubeBetween([side * 0.235, -0.17, 0.12], [side * 0.235, 0.03, 0.12], 0.016)]);
      parts.push(["ivory", tubeBetween([side * 0.171, -0.025, -0.145], [side * 0.171, -0.025, 0.145], 0.004, 4)]);
    }
    for (const [material, geometry] of parts) {
      if (facing < 0) geometry.rotateY(Math.PI);
      geometry.translate(x, 0, z);
      add(cabin, "Seats", material, geometry);
    }
  }

  // Forward club lounge: four facing sculptural seats.
  for (const side of [-1, 1]) {
    chair(side * 0.395, -2.95, -1);
    chair(side * 0.395, -1.60, 1);
    add(cabin, "LoungeTables", "wood", box([0.25, 0.045, 0.50], [side * 0.525, 0.09, -2.275], 0.04));
    add(cabin, "LoungeTables", "gold", box([0.035, 0.34, 0.30], [side * 0.59, -0.095, -2.275], 0.012));
  }

  // Mid-cabin dining area: two armchairs, cantilever walnut table and cream banquette.
  chair(-0.395, -0.25, -1);
  chair(-0.395, 1.05, 1);
  add(cabin, "Tables", "wood", box([0.75, 0.055, 0.64], [0.04, 0.06, 0.42], 0.09));
  add(cabin, "Tables", "gold", box([0.07, 0.35, 0.36], [0.10, -0.145, 0.42], 0.03));
  add(cabin, "DiningSofa", "ivory", box([0.38, 0.17, 1.52], [0.46, -0.09, 0.42], 0.065));
  add(cabin, "DiningSofa", "ivory", box([0.12, 0.36, 1.61], [0.645, 0.06, 0.42], 0.05));
  for (const z of [-0.27, 1.11]) add(cabin, "DiningSofa", "ivory", box([0.39, 0.18, 0.095], [0.46, 0.055, z], 0.028));
  // Two ceramic places and a tiny low sculptural centrepiece.
  for (const z of [0.24, 0.61]) {
    add(cabin, "TableSetting", "ivory", new CylinderGeometry(0.093, 0.083, 0.009, 20).translate(-0.075, 0.094, z));
    add(cabin, "TableSetting", "gold", new CylinderGeometry(0.027, 0.029, 0.06, 12).translate(0.15, 0.123, z));
  }

  // Quiet aft suite: integrated chaise and a softened cabinet wall.
  add(cabin, "PrivateSuite", "wood", box([0.65, 0.16, 1.66], [0.29, -0.22, 2.83], 0.075));
  add(cabin, "PrivateSuite", "ivory", box([0.66, 0.18, 1.70], [0.29, -0.06, 2.83], 0.075));
  add(cabin, "PrivateSuite", "leather", box([0.55, 0.12, 0.40], [0.29, 0.084, 3.39], 0.05, [-0.08, 0.02, 0.02]));
  add(cabin, "PrivateSuite", "rug", box([0.64, 0.012, 0.56], [0.29, 0.039, 2.40], 0.018));
  add(cabin, "SuiteCabinet", "wood", box([0.24, 0.43, 1.16], [-0.54, -0.10, 2.96], 0.038));
  add(cabin, "SuiteCabinet", "gold", tubeBetween([-0.413, 0.11, 2.42], [-0.413, 0.11, 3.48], 0.008));
  for (const z of [-4.00, 3.99]) {
    add(cabin, "CabinBulkheads", "wood", box([1.37, 0.30, 0.065], [0, -0.135, z], 0.025));
    add(cabin, "CabinBulkheads", "gold", box([1.30, 0.016, 0.074], [0, 0.025, z], 0.007));
  }

  return { exterior: finish(exterior), upper: finish(upper), cabin: finish(cabin) };
}
