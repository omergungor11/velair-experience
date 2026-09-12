import test from "node:test";
import assert from "node:assert/strict";
import { chapters, getChapterAt } from "../src/lib/motion/chapters.ts";

test("story covers the full scroll range without gaps or duplicate anchors", () => {
  assert.equal(chapters[0].start, 0);
  assert.equal(chapters.at(-1).end, 1);
  assert.equal(new Set(chapters.map(({ id }) => id)).size, chapters.length);
  chapters.forEach((chapter, index) => {
    assert.ok(chapter.end > chapter.start);
    if (index > 0) assert.equal(chapter.start, chapters[index - 1].end);
  });
});

test("boundary jumps, reverse scrolling, and overscroll resolve predictably", () => {
  assert.equal(getChapterAt(-1).id, "above");
  assert.equal(getChapterAt(0.34).id, "cabin");
  assert.equal(getChapterAt(0.33999).id, "clouds");
  assert.equal(getChapterAt(0.94).id, "arrival");
  assert.equal(getChapterAt(2).id, "arrival");
  assert.equal(getChapterAt(NaN).id, "above");
  assert.equal(getChapterAt(Infinity).id, "arrival");
  assert.equal(getChapterAt(-Infinity).id, "above");
});
