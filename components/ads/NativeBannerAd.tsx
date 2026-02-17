"use client";

import Script from "next/script";
import { ADS_CONFIG } from "@/lib/ads.config";

// Counter to generate unique IDs when NativeBannerAd is used multiple times on a page
let nativeAdCount = 0;

export function NativeBannerAd() {
  // Safe on all devices — native ads are the only mobile-friendly format
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.nativeBanner.enabled) return null;

  // Each instance gets a unique ID to avoid duplicate Script ID warnings
  const instanceId = ++nativeAdCount;

  return (
    <div className="w-full my-4 rounded-xl overflow-hidden">
      <p className="text-xs text-zinc-400 text-center mb-2">Sponsored</p>
      <div
        id="container-c32afab8b031dc1f4a7d81b36d14ad2a"
        className="w-full"
      />
      <Script
        id={`adsterra-native-banner-${instanceId}`}
        async
        data-cfasync="false"
        src="https://pl28730247.effectivegatecpm.com/c32afab8b031dc1f4a7d81b36d14ad2a/invoke.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
