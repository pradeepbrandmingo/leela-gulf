"use client";

import ContactHero from "@/components/contact/ContactHero";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import ContactNetworkCards from "@/components/contact/ContactNetworkCards";
import ContactLocationsMap from "@/components/contact/ContactLocationsMap";
import ContactCatalogueBar from "@/components/contact/ContactCatalogueBar";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 overflow-hidden relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-secondary-main)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        
        {/* Contact Page Hero Header */}
        <ContactHero />

        {/* Master Universal Lead Capture Form & Related Contact Components */}
        <div className="max-w-[1040px] mx-auto">
          <LeadEnquiryForm sourcePage="Contact Us Page" />
          
          {/* Direct Contact Bar & Global Network Banner Component */}
          <ContactNetworkCards />

          {/* Interactive Office Locations Map Component */}
          <ContactLocationsMap />

          {/* Download Catalogue & WhatsApp Help Bar */}
          <ContactCatalogueBar />
        </div>

      </div>
    </main>
  );
}
