"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { ADS_CONFIG } from "@/lib/ads.config";

export function PopunderAd() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ADS_CONFIG.enabled || !ADS_CONFIG.popunder.enabled) return;
    // Only on desktop
    if (window.innerWidth < 1024) return;
    // Only once per session
    if (sessionStorage.getItem("popunder_fired")) return;
    // Mark as fired
    sessionStorage.setItem("popunder_fired", "true");
    setShouldLoad(true);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      id="adsterra-popunder"
      src="https://pl28729018.effectivegatecpm.com/84/16/bb/8416bb68c10151b820219f267ab089da.js"
      strategy="lazyOnload"
    />
  );
}
