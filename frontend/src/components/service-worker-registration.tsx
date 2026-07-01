"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;
        console.log("SW registered:", reg.scope);

        // Check for updates periodically
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                console.log("New service worker activated");
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });

    return () => {
      if (registration) {
        registration.unregister();
      }
    };
  }, []);

  return null;
}
