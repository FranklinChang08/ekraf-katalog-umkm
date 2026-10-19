"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" || window.location.hostname === "localhost")
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service worker terdaftar dengan sukses
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        })
        .catch((error) => {
          // Log error jika pendaftaran gagal
          console.warn("PWA Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}

