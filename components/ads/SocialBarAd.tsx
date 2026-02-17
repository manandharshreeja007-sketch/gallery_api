"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ADS_CONFIG } from "@/lib/ads.config";

export function SocialBarAd() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ADS_CONFIG.enabled || !ADS_CONFIG.socialBar.enabled) return;
    // Only on desktop (1024px+)
    if (window.innerWidth < 1024) return;
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      id="adsterra-social-bar"
      src="https://pl28728712.effectivegatecpm.com/e8/db/2e/e8db2ed739d29d3e7aee42d2768daa81.js"
      strategy="afterInteractive"
    />
  );
}
