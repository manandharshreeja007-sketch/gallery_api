"use client";

import Script from "next/script";
import { ADS_CONFIG } from "@/lib/ads.config";

interface HorizontalBannerAdProps {
  id: string;
}

export function HorizontalBannerAd({ id }: HorizontalBannerAdProps) {
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.horizontalBanner.enabled) return null;

  return (
    // Show on md+ (768px+) where 468px fits comfortably
    <div className="hidden md:flex flex-col items-center py-4">
      <p className="text-xs text-zinc-400 mb-2">Advertisement</p>
      <div style={{ width: 468, height: 60 }}>
        <Script
          id={`adsterra-banner-options-${id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '02f6d308d378d094580b21afa3ffb2e8',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          id={`adsterra-banner-invoke-${id}`}
          src="https://www.highperformanceformat.com/02f6d308d378d094580b21afa3ffb2e8/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}
