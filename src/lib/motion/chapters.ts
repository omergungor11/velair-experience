/** Shared story contract. Intervals are [start, end), except the final endpoint. */
export const chapters = [
  { id: "above", number: "01", title: "Above the ordinary.", start: 0, end: 0.18 },
  { id: "clouds", number: "02", title: "Leave the noise below.", start: 0.18, end: 0.34 },
  { id: "cabin", number: "03", title: "A world of your own.", start: 0.34, end: 0.60 },
  { id: "craft", number: "04", title: "Nothing added. Nothing missing.", start: 0.60, end: 0.76 },
  { id: "horizon", number: "05", title: "Some things are better left behind.", start: 0.76, end: 0.94 },
  { id: "arrival", number: "06", title: "Your horizon. Your rules.", start: 0.94, end: 1 },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export function getChapterAt(progress: number) {
  const clamped = Number.isNaN(progress) ? 0 : Math.min(1, Math.max(0, progress));
  return chapters.find((chapter) => clamped < chapter.end) ?? chapters[chapters.length - 1];
}
