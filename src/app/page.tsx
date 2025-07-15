"use client";

import { useEffect, useState } from "react";
import MainHero from '../app/Home/MainHero/page';
import AppBar from '../components/AppBar/AppBar';
import PaperBagsPage from '../app/Home/ProductCategories/PaperBags/page';
import { useMediaQuery } from '@mui/material';

// Type for beforeinstallprompt event
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export default function Page() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setShowInstallPrompt(false);
    }
  };

  return (
    <>
      {!isMobile && <AppBar />}
      <MainHero />
      <PaperBagsPage />
      {isMobile && showInstallPrompt && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: 0,
            right: 0,
            margin: "auto",
            maxWidth: 320,
            background: "#fff",
            boxShadow: "0 2px 12px #0002",
            borderRadius: 12,
            padding: "1rem",
            textAlign: "center",
            zIndex: 9999,
          }}
        >
          <span style={{ fontWeight: 500, marginBottom: 8, display: "block" }}>
            Install GreenPax to your home screen for a better experience!
          </span>
          <button
            style={{
              background: "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.5rem 1.5rem",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={handleInstallClick}
          >
            Install App
          </button>
        </div>
      )}
    </>
  );
}