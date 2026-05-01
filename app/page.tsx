"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import GameList from "./components/GameList";
import Combo from "./components/Combo";
import Promotion from "./components/Promotion";
import Food from "./components/Food";
import Review from "./components/Review";
import MapSection from "./components/MapSection";
import Chatbot from "./components/Chatbot";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ComboLightbox from "./components/ComboLightbox";

export default function Home() {
  const [showComboLightbox, setShowComboLightbox] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-950">
      <Navigation />
      <Hero onComboClick={() => setShowComboLightbox(true)} />
      <div id="games"><GameList /></div>
      <div id="combo"><Combo /></div>
      <div id="promo"><Promotion /></div>
      <div id="food"><Food /></div>
      <Review />
      <div id="map"><MapSection /></div>
      <Footer />
      <Chatbot />
      <ComboLightbox isOpen={showComboLightbox} onClose={() => setShowComboLightbox(false)} />
    </main>
  );
}