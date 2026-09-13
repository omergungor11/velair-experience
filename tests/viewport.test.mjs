import test from "node:test";
import assert from "node:assert/strict";
import { sampleFlight } from "../src/lib/motion/sample-flight.ts";
import { fitFlight } from "../src/lib/motion/fit-flight.ts";

test("mobile viewport corrections stay continuous across reveal and side-flight boundaries", () => {
  for (const width of [320, 390, 759]) {
    for (const p of [0.28, 0.34, 0.43, 0.6, 0.68, 0.76]) {
      const before = fitFlight(sampleFlight(p - 1e-7, true), p - 1e-7, width, 844);
      const after = fitFlight(sampleFlight(p + 1e-7, true), p + 1e-7, width, 844);
      assert.ok(Math.abs(before.zoom - after.zoom) < 0.001, `zoom jump at ${p}`);
      assert.ok(Math.abs(before.jetPosition[2] - after.jetPosition[2]) < 0.001, `position jump at ${p}`);
    }
  }
});

test("hero fits a narrow screen and viewport fitting does not mutate source poses", () => {
  const pose = sampleFlight(0, true);
  const original = structuredClone(pose);
  assert.ok(fitFlight(pose, 0, 320, 800).zoom * 14.1 < 320);
  assert.deepEqual(pose, original);
});
