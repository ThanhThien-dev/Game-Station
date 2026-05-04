"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import GameList from "./components/GameList";
import Combo from "./components/Combo";
import Promotion from "./components/Promotion";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ComboLightbox from "./components/ComboLightbox";
import BookingForm from "./components/BookingForm";
import AuthModal from "./components/AuthModal";

const Food = dynamic(() => import("./components/Food"), { loading: () => <div className="h-64 bg-zinc-900 animate-pulse" /> });
const Review = dynamic(() => import("./components/Review"), { loading: () => <div className="h-64 bg-zinc-900 animate-pulse" /> });
const MapSection = dynamic(() => import("./components/MapSection"), { loading: () => <div className="h-64 bg-zinc-900 animate-pulse" /> });
const Chatbot = dynamic(() => import("./components/Chatbot"), { ssr: false });

function AuthErrorBannerContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("auth_error");
  if (!error) return null;
  return (
    <div className="fixed top-20 left-4 right-4 z-[100] bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
      <p className="text-red-400 text-sm">Đăng nhập thất bại: {error}. Vui lòng thử lại.</p>
    </div>
  );
}

function AuthErrorBanner() {
  return (
    <Suspense fallback={null}>
      <AuthErrorBannerContent />
    </Suspense>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [showComboLightbox, setShowComboLightbox] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleBook = () => {
    if (user) {
      setShowBookingForm(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowBookingForm(true);
  };

  return (
    <main className="min-h-screen bg-zinc-950">
      <AuthErrorBanner />
      <Navigation onBookClick={handleBook} />
      <Hero onComboClick={() => setShowComboLightbox(true)} onBookClick={handleBook} />
      <div id="games"><GameList /></div>
      <div id="combo"><Combo onBookClick={handleBook} /></div>
      <div id="promo"><Promotion /></div>
      <div id="food"><Food /></div>
      <Review />
      <div id="map"><MapSection /></div>
      <Footer />
      <Chatbot />
      <ComboLightbox isOpen={showComboLightbox} onClose={() => setShowComboLightbox(false)} />
      <BookingForm isOpen={showBookingForm} onClose={() => setShowBookingForm(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLoginSuccess={handleAuthSuccess} />
    </main>
  );
}