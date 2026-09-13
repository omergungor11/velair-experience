"use client";

import { useState } from "react";

const spaces = [
  { id: "lounge", name: "The lounge", detail: "Face-to-face seating. Uninterrupted conversation. Settle into a space that brings you together." },
  { id: "dining", name: "The table", detail: "A shared table for a slower moment. From a quiet breakfast to the next big idea." },
  { id: "suite", name: "Your retreat", detail: "A private corner to read, rest, and reset. A little room for yourself, wherever you are headed." },
];

export default function CabinDetails() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="cabin-details">
      <div className="cabin-options" aria-label="Explore the cabin">
        {spaces.map((space, index) => <button key={space.id} type="button" aria-pressed={selected === index} aria-controls="cabin-description" onClick={() => setSelected(index)}><span>0{index + 1}</span>{space.name}</button>)}
      </div>
      <p className="cabin-detail-text" id="cabin-description" aria-live="polite">{spaces[selected].detail}</p>
    </div>
  );
}
