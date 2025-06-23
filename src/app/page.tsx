"use client";

import { useState } from "react";
import { ConcertForm } from "@/components/ConcertForm";
import { ConcertPreview } from "@/components/ConcertPreview";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { PDFGenerator } from "@/components/PDFGenerator";
import { Header } from "@/components/Header";
import type { ConcertMemory, CustomizationOptions } from "@/types/concert";

export default function Home() {
  const [concertData, setConcertData] = useState<ConcertMemory>({
    artist: "",
    venue: "",
    date: "",
    notes: "",
    setlist: "",
    moodRating: 3,
  });

  const [customization, setCustomization] = useState<CustomizationOptions>({
    colorScheme: "neon-pink",
    font: "typewriter",
    layout: "vertical",
    polaroidFrame: false,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and Customization */}
          <div className="space-y-8">
            <ConcertForm data={concertData} onChange={setConcertData} />

            <CustomizationPanel
              options={customization}
              onChange={setCustomization}
            />

            <PDFGenerator
              concertData={concertData}
              customization={customization}
              isGenerating={isGenerating}
              onGenerateStart={() => setIsGenerating(true)}
              onGenerateEnd={() => setIsGenerating(false)}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <ConcertPreview
              data={concertData}
              customization={customization}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
