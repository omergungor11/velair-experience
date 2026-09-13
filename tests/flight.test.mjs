import test from "node:test";
import assert from "node:assert/strict";
import { sampleFlight } from "../src/lib/motion/sample-flight.ts";

const vectorKeys = ["jetPosition", "jetRotation", "cameraPosition", "cameraTarget"];
const scalarKeys = ["zoom", "reveal", "cloud"];
const values = (pose) => [...vectorKeys.flatMap((key) => pose[key]), ...scalarKeys.map((key) => pose[key])];

test("overscroll and invalid progress resolve to finite endpoint poses", () => {
  for (const mobile of [false, true]) {
    for (const progress of [-Infinity, -100, NaN, 0]) {
      assert.deepEqual(sampleFlight(progress, mobile), sampleFlight(0, mobile));
    }
    for (const progress of [1, 100, Infinity]) {
      assert.deepEqual(sampleFlight(progress, mobile), sampleFlight(1, mobile));
    }
    for (let i = 0; i <= 2000; i += 1) {
      const pose = sampleFlight(i / 2000, mobile);
      assert.ok(values(pose).every(Number.isFinite));
      assert.ok(pose.zoom > 0);
      assert.ok(pose.reveal >= 0 && pose.reveal <= 1);
      assert.ok(pose.cloud >= 0 && pose.cloud <= 1);
      // A camera looking exactly along its up vector produces unstable plan views.
      assert.ok(Math.abs(pose.cameraPosition[2] - pose.cameraTarget[2]) >= 0.009);
    }
  }
});

test("forward playback, reverse scroll and large jumps give identical poses", () => {
  const checkpoints = Array.from({ length: 101 }, (_, index) => index / 100);
  for (const mobile of [false, true]) {
    const forward = new Map(checkpoints.map((progress) => [progress, sampleFlight(progress, mobile)]));
    for (const progress of [...checkpoints].reverse()) {
      assert.deepEqual(sampleFlight(progress, mobile), forward.get(progress));
    }
    for (const progress of [0, 0.5, 0.2, 0.85, 0.4, 1, 0.34, 0.94, 0.6, 0.76]) {
      assert.deepEqual(sampleFlight(progress, mobile), forward.get(progress));
    }
  }
});

test("keyframe and chapter boundaries keep pose and velocity continuous", () => {
  const boundaries = [0.1, 0.18, 0.26, 0.31, 0.34, 0.43, 0.55, 0.6, 0.68, 0.76, 0.9, 0.94];
  const delta = 1e-7;
  for (const mobile of [false, true]) {
    for (const progress of boundaries) {
      const before = values(sampleFlight(progress - delta, mobile));
      const at = values(sampleFlight(progress, mobile));
      const after = values(sampleFlight(progress + delta, mobile));
      at.forEach((value, index) => {
        assert.ok(Math.abs(before[index] - value) < 1e-7, `left discontinuity at ${progress}`);
        assert.ok(Math.abs(after[index] - value) < 1e-7, `right discontinuity at ${progress}`);
        const incoming = (value - before[index]) / delta;
        const outgoing = (after[index] - value) / delta;
        assert.ok(Math.abs(incoming - outgoing) < 0.02, `velocity discontinuity at ${progress}`);
      });
    }
  }
});

test("cabin reading holds still and the shell closes before the side turn", () => {
  for (const mobile of [false, true]) {
    const readingPose = sampleFlight(0.43, mobile);
    assert.equal(readingPose.reveal, 1);
    for (const progress of [0.44, 0.48, 0.5, 0.55]) {
      assert.deepEqual(sampleFlight(progress, mobile), readingPose);
    }
    assert.equal(sampleFlight(0.34, mobile).reveal, 0);
    let previousReveal = 1;
    for (let i = 600; i <= 680; i += 1) {
      const pose = sampleFlight(i / 1000, mobile);
      assert.ok(pose.reveal <= previousReveal);
      assert.deepEqual(pose.jetRotation, [0, 0, 0]);
      previousReveal = pose.reveal;
    }
    assert.equal(sampleFlight(0.68, mobile).reveal, 0);
    assert.ok(sampleFlight(0.7, mobile).jetRotation[1] < 0);
    for (let i = 680; i <= 1000; i += 1) {
      assert.equal(sampleFlight(i / 1000, mobile).reveal, 0);
    }
  }
});

test("side flight enters from the left, crosses the panel and retreats into the ending", () => {
  for (const mobile of [false, true]) {
    const start = sampleFlight(0.76, mobile);
    const middle = sampleFlight(0.83, mobile);
    const end = sampleFlight(0.9, mobile);
    assert.ok(start.jetPosition[0] < 0);
    assert.ok(Math.abs(middle.jetPosition[0]) < 1e-10);
    assert.ok(end.jetPosition[0] > 0);
    assert.equal(start.jetRotation[1], -Math.PI / 2);
    let previousX = start.jetPosition[0];
    let previousZoom = end.zoom;
    for (let i = 760; i <= 1000; i += 1) {
      const pose = sampleFlight(i / 1000, mobile);
      assert.ok(pose.jetPosition[0] >= previousX);
      previousX = pose.jetPosition[0];
      if (i >= 900) {
        assert.ok(pose.zoom <= previousZoom);
        previousZoom = pose.zoom;
      }
    }
    assert.ok(sampleFlight(1, mobile).zoom < end.zoom / 2);
    assert.ok(sampleFlight(1, mobile).jetPosition[2] < end.jetPosition[2]);
  }
});

test("mobile centers the plan view and uses a smaller orthographic zoom", () => {
  for (let i = 0; i <= 680; i += 1) {
    const mobile = sampleFlight(i / 1000, true);
    const desktop = sampleFlight(i / 1000);
    assert.equal(mobile.jetPosition[0], 0);
    assert.ok(mobile.zoom < desktop.zoom);
  }
  assert.ok(sampleFlight(0.83, true).jetPosition[1] > sampleFlight(0.83).jetPosition[1]);
});

test("returned tuples can be mutated without changing any later sample", () => {
  for (const mobile of [false, true]) {
    for (const progress of [0, 0.43, 0.5, 0.76, 1]) {
      const expected = sampleFlight(progress, mobile);
      const mutated = sampleFlight(progress, mobile);
      for (const key of vectorKeys) mutated[key].fill(999);
      for (const key of scalarKeys) mutated[key] = 999;
      assert.deepEqual(sampleFlight(progress, mobile), expected);
    }
  }
});
