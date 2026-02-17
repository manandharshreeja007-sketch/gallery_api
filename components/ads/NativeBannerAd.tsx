"use client";

import Script from "next/script";
import { ADS_CONFIG } from "@/lib/ads.config";

export function NativeBannerAd() {
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.nativeBanner.enabled) return null;

  return (
    <div className="w-full my-4 rounded-xl overflow-hidden">
      <p className="text-xs text-zinc-400 text-center mb-2">Sponsored</p>
      <div id="container-c32afab8b031dc1f4a7d81b36d14ad2a" className="w-full" />
      <Script
        id="adsterra-native-banner"
        async
        data-cfasync="false"
        src="https://pl28730247.effectivegatecpm.com/c32afab8b031dc1f4a7d81b36d14ad2a/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
