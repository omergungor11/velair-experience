import { getImageProps } from "next/image";

/** Art-directed stills exported from the same scene used by the live experience. */
export default function AircraftPoster({ view }: { view: "hero" | "cabin" | "side" }) {
  const shared = { alt: "", sizes: "100vw", quality: 85 };
  const { props: desktop } = getImageProps({ ...shared, src: `/images/jet-${view}-desktop.png`, width: 1440, height: 900 });
  const { props: mobile } = getImageProps({ ...shared, src: `/images/jet-${view}-mobile.png`, width: 375, height: 844 });
  return (
    <picture className={`aircraft-poster aircraft-poster-${view}`}>
      <source media="(max-width: 759px)" srcSet={mobile.srcSet} />
      {/* getImageProps provides Next image optimization for this art-directed picture. */}
      <img {...desktop} alt="" loading={view === "hero" ? "eager" : "lazy"} />
    </picture>
  );
}
