"use client";

import { useState } from "react";
import EventsHero from "@/components/events/EventsHero";
import EventsListing from "@/components/events/EventsListing";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white relative">
      
      {/* ── 1. EVENTS HERO SECTION ── */}
      <EventsHero
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ── 2. EVENTS 3-COLUMN CARDS GRID & GALLERY LIGHTBOX MODAL ── */}
      <EventsListing
        activeTab={activeTab}
      />

    </main>
  );
}
