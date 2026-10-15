"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ContrastCheckerDemo from "@/components/ContrastCheckerDemo";
import CivicMissionSection from "@/components/CivicMissionSection";
import Footer from "@/components/Footer";
import ScannerDashboard from "@/components/scanner/ScannerDashboard";
import AccessibilitySettingsModal from "@/components/settings/AccessibilitySettingsModal";
import { MascotProvider, useMascot } from "@/context/MascotContext";
import { LanguageProvider, useTranslation } from "@/context/LanguageContext";

function MainApp() {
  const { activeView } = useMascot();
  const { settingsOpen, setSettingsOpen } = useTranslation();

  return (
    <>
      <AccessibilitySettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      {activeView === "scanner" ? (
        <ScannerDashboard />
      ) : (
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917]">
          {/* Navigation */}
          <Navbar />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Playful Hero Section with Mascot & URL Scanner */}
        <HeroSection />

        {/* 3 Core Features: Detect Barriers, Understand Issues, Fix with Confidence */}
        <FeaturesSection />

        {/* 3-Step Walkthrough: How AccessAble AI Works */}
        <HowItWorksSection />

        {/* Interactive WCAG 2.2 Contrast Calculator */}
        <ContrastCheckerDemo />

        {/* Civic Impact & Digital Dignity Manifesto */}
        <CivicMissionSection />
      </main>

      {/* Simple Accessible Footer */}
      <Footer />
    </div>
    )}
    </>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <MascotProvider>
        <MainApp />
      </MascotProvider>
    </LanguageProvider>
  );
}

