import CabinDetails from "@/components/story/CabinDetails";
import AircraftPoster from "@/components/story/AircraftPoster";

function Index({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="chapter-index"><span>{number}</span><span className="index-line" />{children}</p>;
}

export default function StorySections() {
  return (
    <div className="story-sections">
      <section id="above" className="chapter chapter-above" aria-labelledby="above-title">
        <div className="chapter-inner hero-inner">
          <AircraftPoster view="hero" />
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">A different perspective on flight</p>
            <h1 id="above-title">Above the<br /><em>ordinary.</em></h1>
            <p className="hero-description">The world can wait.<br />This moment is yours.</p>
          </div>
          <div className="hero-footnote"><span>PRIVATE AVIATION, REIMAGINED</span><a href="#clouds">Scroll to discover <span className="scroll-mark" aria-hidden="true">↓</span></a></div>
          <span className="aircraft-caption" aria-hidden="true">VELAIR 01 <span>THE ART OF ARRIVING</span></span>
        </div>
      </section>
      <section id="clouds" className="chapter chapter-clouds" aria-labelledby="clouds-title">
        <div className="chapter-inner"><div className="chapter-copy cloud-copy">
          <Index number="02">A little distance changes everything</Index>
          <h2 id="clouds-title">Leave the<br /><em>noise below.</em></h2>
          <p>Above the rush. Beyond the routine.<br />Find the space to simply be.</p>
        </div></div>
      </section>
      <section id="cabin" className="chapter chapter-cabin" aria-labelledby="cabin-title">
        <div className="chapter-inner"><AircraftPoster view="cabin" /><div className="chapter-copy cabin-copy">
          <Index number="03">Considered from the inside out</Index>
          <h2 id="cabin-title">A world<br />of <em>your own.</em></h2>
          <p>Room for conversation.<br />Space for a quiet thought.<br />Every detail, on your terms.</p>
          <CabinDetails />
        </div><div className="cabin-annotation" aria-hidden="true"><span className="annotation-line" /><span>OPEN UP TO A DIFFERENT EXPERIENCE</span></div></div>
      </section>
      <section id="craft" className="chapter chapter-craft" aria-labelledby="craft-title">
        <div className="chapter-inner"><div className="chapter-copy craft-copy">
          <Index number="04">The quiet details</Index>
          <h2 id="craft-title">Nothing added.<br /><em>Nothing missing.</em></h2>
          <p>Soft textures. Warm materials. Natural light.<br />A feeling of home, somewhere above it all.</p>
          <div className="material-notes"><span>01 &nbsp; Sculpted comfort</span><span>02 &nbsp; Warm walnut</span><span>03 &nbsp; Open horizons</span></div>
        </div></div>
      </section>
      <section id="horizon" className="chapter chapter-horizon" aria-labelledby="horizon-title">
        <div className="chapter-inner flyby-inner"><AircraftPoster view="side" /><div className="flyby-card">
          <Index number="05">Freedom, in its purest form</Index>
          <h2 id="horizon-title">Some things<br />are better<br /><em>left behind.</em></h2>
          <span className="flyby-rule" />
          <p>Your time. Your direction.<br />An entirely different journey.</p>
          <span className="flyby-stamp" aria-hidden="true">V / 01</span>
        </div></div>
      </section>
      <section id="arrival" className="chapter chapter-arrival" aria-labelledby="arrival-title">
        <div className="chapter-inner arrival-inner">
          <Index number="06">The journey is yours</Index>
          <h2 id="arrival-title">Your horizon.<br /><em>Your rules.</em></h2>
          <a className="replay-link" href="#above">Experience it again <span aria-hidden="true">↗</span></a>
          <footer className="site-footer"><a className="wordmark" href="#above">VELAIR</a><p>An independent design concept.<br />No aviation services are offered.</p><span>© 2026</span></footer>
        </div>
      </section>
    </div>
  );
}
