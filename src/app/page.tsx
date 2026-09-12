import { chapters } from "@/lib/motion/chapters";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#journey">Skip to journey</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="VELAIR home">VELAIR</a>
        <span className="eyebrow">Private aviation concept</span>
        <a className="text-link" href="#journey">The journey</a>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">An independent design study / 2026</p>
          <h1 id="hero-title">Above the<br /><em>ordinary.</em></h1>
          <div className="hero-bottom">
            <p>A quieter perspective.<br />An entirely different journey.</p>
            <a className="text-link" href="#journey">Explore the chapters <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <section className="journey" id="journey" aria-labelledby="journey-title">
          <div className="section-intro">
            <p className="eyebrow">The flight, in six chapters</p>
            <h2 id="journey-title">A new perspective<br />at every altitude.</h2>
          </div>
          <ol className="chapters">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <span className="eyebrow">{chapter.number}</span>
                <h3>{chapter.title}</h3>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer>
        <span className="wordmark">VELAIR</span>
        <p>Independent portfolio concept. No aviation services are offered.</p>
        <a className="text-link" href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
