"use client";

import Script from "next/script";
import { ADS_CONFIG } from "@/lib/ads.config";

export function SkyscraperAd() {
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.skyscraper.enabled) return null;

  return (
    // Completely hidden on mobile and tablet — xl+ only (1280px)
    <div className="hidden xl:block sticky top-20">
      <p className="text-xs text-zinc-400 text-center mb-2">Advertisement</p>
      <div style={{ width: 160, height: 600 }}>
        <Script
          id="adsterra-skyscraper-options"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'ef0e30cdce21c747b2e9624726f3f28e',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          id="adsterra-skyscraper-invoke"
          src="https://www.highperformanceformat.com/ef0e30cdce21c747b2e9624726f3f28e/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
