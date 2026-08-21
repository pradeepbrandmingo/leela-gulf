"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ExternalLink } from "lucide-react";

/**
 * Location Data Array for Gujrat, New Delhi, and USA.
 */
const LOCATIONS = [
  {
    id: "gujrat",
    name: "GUJRAT",
    address: "F12 Mangalam Nirwana 2, B/h. Umiya Campus, Sola, Ahmedabad 380060 Gujarat, India.",
    email: "info@leelagulf.com",
    phones: ["+1 (908) 663-8782", "+91 98670 99519"],
    mapUrl:
      "https://maps.google.com/maps?q=Sola%2C%20Ahmedabad%2C%20Gujarat%20380060&t=&z=13&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Sola,+Ahmedabad,+Gujarat+380060",
  },
  {
    id: "delhi",
    name: "NEW DELHI",
    address: "Trade Desk 4, Connaught Place, Central Business District, New Delhi 110001, India.",
    email: "delhi@leelagulf.com",
    phones: ["+91 98670 99519"],
    mapUrl:
      "https://maps.google.com/maps?q=Connaught%20Place%2C%20New%20Delhi%2C%20Delhi%20110001&t=&z=13&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=Connaught+Place,+New+Delhi",
  },
  {
    id: "usa",
    name: "USA",
    address: "International Trade Desk, 500 5th Avenue, Suite 2800, New York, NY 10110, USA.",
    email: "usa@leelagulf.com",
    phones: ["+1 (908) 663-8782"],
    mapUrl:
      "https://maps.google.com/maps?q=500%205th%20Ave%2C%20New%20York%2C%20NY%2010110&t=&z=13&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://maps.google.com/?q=500+5th+Ave,+New+York,+NY+10110",
  },
];

/**
 * ContactLocationsMap - Interactive Office Locations Map Component.
 * Using global gold theme variables and animated gold gradients matching website design system.
 */
export default function ContactLocationsMap() {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("gujrat");

  const currentLocation = LOCATIONS.find((loc) => loc.id === activeTab) || LOCATIONS[0];

  return (
    <div className="w-full mt-8 sm:mt-10">
      {/* Outer Card Container */}
      <div className="bg-[#0e1014] border border-[var(--color-secondary-main)]/40 rounded-3xl overflow-hidden shadow-2xl relative">
        
        <div className="flex flex-col md:block relative w-full md:h-[470px]">
          
          {/* ═════════════════════════════════════════════════════════════════
              FLOATING DARK LOCATION CARD 
              (Mobile: Clean Stack Above Map | Desktop: Floating Overlay at top-[115px] left-3.5)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="w-full md:w-[360px] md:absolute md:top-[115px] md:left-3.5 z-20 p-3.5 md:p-0">
            <div className="bg-[#0e1014]/95 backdrop-blur-xl border border-[#2b2f3a] rounded-2xl shadow-2xl overflow-hidden">
              
              {/* ── TOP 3 LOCATION TABS ── */}
              <div className="grid grid-cols-3 border-b border-[#242834]">
                {LOCATIONS.map((loc) => {
                  const isActive = activeTab === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setActiveTab(loc.id)}
                      className={`py-3 px-2 text-xs font-heading font-bold transition-all relative cursor-pointer text-center ${
                        isActive
                          ? "text-gradient-gold-animated bg-[#141620]"
                          : "text-gray-400 hover:text-white bg-[#0e1014]"
                      }`}
                    >
                      <span>{loc.name}</span>
                      
                      {/* Gold Active Bottom Indicator Line */}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-gold-animated animate-fadeIn" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── CARD BODY CONTENT (Address, Email, Phone, Directions) ── */}
              <div className="p-4 sm:p-5 space-y-3 animate-fadeIn">
                
                {/* ADDRESS SECTION */}
                <div>
                  <span className="block font-heading font-bold text-[10px] text-gradient-gold-animated uppercase tracking-wider mb-0.5">
                    {isRTL ? "العنوان" : "ADDRESS"}
                  </span>
                  <p className="font-subheading text-xs text-gray-200 leading-relaxed">
                    {currentLocation.address}
                  </p>
                </div>

                {/* EMAIL SECTION */}
                <div>
                  <span className="block font-heading font-bold text-[10px] text-gradient-gold-animated uppercase tracking-wider mb-0.5">
                    {isRTL ? "البريد الإلكتروني" : "EMAIL"}
                  </span>
                  <a
                    href={`mailto:${currentLocation.email}`}
                    className="font-subheading text-xs text-gray-200 hover:text-[var(--color-secondary-main)] transition-colors inline-block"
                  >
                    {currentLocation.email}
                  </a>
                </div>

                {/* PHONE SECTION */}
                <div>
                  <span className="block font-heading font-bold text-[10px] text-gradient-gold-animated uppercase tracking-wider mb-0.5">
                    {isRTL ? "الهاتف" : "PHONE"}
                  </span>
                  <div className="space-y-0.5">
                    {currentLocation.phones.map((phone, pIdx) => (
                      <a
                        key={pIdx}
                        href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                        className="block font-subheading text-xs text-gray-200 hover:text-[var(--color-secondary-main)] transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                {/* GET DIRECTIONS LINK */}
                <div className="pt-2 border-t border-[#242834]">
                  <a
                    href={currentLocation.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-heading font-bold text-xs hover:brightness-125 transition-all group"
                  >
                    <span className="text-gradient-gold-animated">{isRTL ? "احصل على الاتجاهات" : "Get Directions"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[var(--color-secondary-main)] group-hover:scale-110 transition-transform" />
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              LIVE DYNAMIC GOOGLE MAPS (Mobile: 300px height below card | Desktop: Full height)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="w-full h-[300px] sm:h-[340px] md:h-full relative min-h-[300px]">
            {LOCATIONS.map((loc) => (
              <iframe
                key={loc.id}
                src={loc.mapUrl}
                title={loc.name}
                className={`absolute inset-0 w-full h-full border-0 grayscale contrast-[1.1] brightness-90 transition-opacity duration-300 ${
                  activeTab === loc.id ? "opacity-100 z-0 pointer-events-auto" : "opacity-0 z-[-1] pointer-events-none"
                }`}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
