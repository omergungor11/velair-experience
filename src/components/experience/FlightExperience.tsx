"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ErrorInfo, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, getChapterAt } from "@/lib/motion/chapters";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const FlightCanvas = dynamic(() => import("@/components/scene/FlightCanvas"), { ssr: false });
const subscribeMount = () => () => {};
let webglAvailable: boolean | undefined;
function getWebGLSnapshot() {
  if (webglAvailable !== undefined) return webglAvailable;
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    webglAvailable = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { webglAvailable = false; }
  return webglAvailable;
}
function currentChapter() {
  return chapters.find((chapter) => {
    const rect = document.getElementById(chapter.id)?.getBoundingClientRect();
    return rect && rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.4;
  })?.id ?? "above";
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("VELAIR scene unavailable", error.message, info.componentStack); this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function FlightExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const invalidate = useRef<() => void>(() => {});
  const progressBar = useRef<HTMLSpanElement>(null);
  const pendingChapter = useRef<string | null>(null);
  const [active, setActive] = useState<string>("above");
  const [choice, setChoice] = useState<"auto" | "on" | "off">("auto");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const mounted = useSyncExternalStore(subscribeMount, () => true, () => false);
  const webgl = useSyncExternalStore(subscribeMount, getWebGLSnapshot, () => false);
  const subscribeMotion = useCallback((callback: () => void) => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => {
      if (choice === "auto") { pendingChapter.current = currentChapter(); setReady(false); }
      callback();
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, [choice]);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const unavailable = failed || (mounted && !webgl);
  const animated = mounted && webgl && !failed && (choice === "on" || (choice === "auto" && !reducedMotion));
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { pendingChapter.current = currentChapter(); setFailed(true); }, []);

  useGSAP(() => {
    if (pendingChapter.current) {
      document.getElementById(pendingChapter.current)?.scrollIntoView({ behavior: "instant", block: "start" });
      pendingChapter.current = null;
    }
    if (!animated || !root.current) return;
    const playhead = { value: 0 };
    let previousChapter = "";
    let disposed = false;
    const applyProgress = (p: number) => {
        progress.current = p;
        invalidate.current();
        root.current?.style.setProperty("--flight-progress", p.toFixed(5));
        if (progressBar.current) progressBar.current.style.transform = `scaleX(${p})`;
        // Fractional section pixels may place a native anchor just below its boundary.
        const chapter = getChapterAt(Math.round(p * 1e4) / 1e4);
        if (chapter.id !== previousChapter) { previousChapter = chapter.id; setActive(chapter.id); }
    };
    const tween = gsap.fromTo(playhead, { value: 0 }, {
      value: 1, ease: "none",
      scrollTrigger: {
        trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.35, invalidateOnRefresh: true,
        onRefresh: (trigger) => applyProgress(trigger.progress),
      },
      onUpdate: () => applyProgress(playhead.value),
    });
    const refresh = () => {
      if (disposed) return;
      ScrollTrigger.refresh();
      tween.scrollTrigger?.update();
      // Refresh can invalidate a scrubbed tween while the page is already scrolled.
      // Sample its current position immediately, including restored/deep-link loads.
      const p = tween.scrollTrigger?.progress ?? 0;
      tween.totalProgress(p, false);
      applyProgress(p);
    };
    document.fonts.ready.then(refresh);
    const timer = window.setTimeout(refresh, 100);
    return () => { disposed = true; window.clearTimeout(timer); };
  }, { scope: root, dependencies: [animated], revertOnUpdate: true });

  useEffect(() => {
    if (animated || !mounted) return;
    let frame = 0;
    const update = () => { frame = 0; setActive(currentChapter()); };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [animated, mounted]);

  function toggleMotion() {
    pendingChapter.current = currentChapter();
    setReady(false);
    setChoice(animated ? "off" : "on");
  }

  const chapter = chapters.find((item) => item.id === active) ?? chapters[0];
  return (
    <div ref={root} className={`flight-experience ${animated ? "is-animated" : "is-static"} ${ready ? "scene-ready" : ""}`} data-chapter={active}>
      <a className="skip-link" href="#cabin">Skip to the cabin</a>
      <header className="site-header">
        <a className="wordmark" href="#above" aria-label="VELAIR home">VELAIR</a>
        <nav className="main-nav" aria-label="Main navigation"><a href="#clouds">The experience</a><a href="#cabin">On board</a><a href="#horizon">Beyond</a></nav>
        <a className="header-cta" href="#cabin">Step inside <span aria-hidden="true">↗</span></a>
      </header>
      <div className="scene-shell" aria-hidden="true">
        <div className="cloud-surface"><Image src="/images/cloud-atmosphere.png" alt="" fill sizes="100vw" quality={85} preload /></div>
        <div className="sky-wash" />
        {animated && <SceneBoundary onError={onFailure}><FlightCanvas progress={progress} invalidateRef={invalidate} onReady={onReady} onFailure={onFailure} /></SceneBoundary>}
        <div className="scene-grain" />
      </div>
      <main>{children}</main>
      <aside className="flight-utility" aria-label="Experience controls">
        <div className="chapter-status"><span>{chapter.number}</span><span className="utility-separator" /><span>06</span><span className="utility-label">{chapter.id === "above" ? "THE DEPARTURE" : chapter.id.toUpperCase()}</span></div>
        <button type="button" className="motion-toggle" onClick={toggleMotion} aria-pressed={!animated} disabled={unavailable}><span className="motion-symbol" aria-hidden="true">{animated ? "Ⅱ" : "▷"}</span>{unavailable ? "Still experience" : animated ? "Reduce motion" : "Enable motion"}</button>
        <div className="flight-progress" aria-hidden="true"><span ref={progressBar} /></div>
      </aside>
      <nav className="chapter-dots" aria-label="Flight chapters">{chapters.map((item) => <a key={item.id} href={`#${item.id}`} aria-label={`${item.number}: ${item.title}`} aria-current={active === item.id ? "step" : undefined}><span>{item.number}</span></a>)}</nav>
    </div>
  );
}
