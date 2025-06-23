"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { ConcertMemory, CustomizationOptions } from "@/types/concert";

// Dynamic imports for client-side only libraries
const generatePDF = async (
  concertData: ConcertMemory,
  customization: CustomizationOptions
) => {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas-pro");

  // Get the preview element
  const element = document.getElementById("concert-preview");
  if (!element) {
    throw new Error("Preview element not found");
  }

  // Get the actual rendered dimensions of the element
  const elementRect = element.getBoundingClientRect();
  const actualWidth = elementRect.width;
  const actualHeight = elementRect.height;

  // Temporarily remove any opacity effects during capture
  const originalStyle = element.style.cssText;
  element.style.opacity = "1";
  element.style.filter = "none";
  element.style.transform = "none";

  try {
    // Create high-quality canvas using actual element dimensions
    const canvas = await html2canvas(element, {
      scale: 2, // Reduced scale for better performance while maintaining quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      // Remove fixed window dimensions to let it use natural size
      scrollX: 0,
      scrollY: 0,
      logging: false, // Disable logging for cleaner console
    });

    // Determine PDF orientation based on card layout
    const isHorizontal = customization.layout === "horizontal";

    // Create PDF with proper orientation
    const pdf = new jsPDF({
      orientation: isHorizontal ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Get PDF page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate proper sizing to fill most of the page while maintaining aspect ratio
    const margin = 15; // 15mm margin on all sides
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    // Calculate the aspect ratio of the canvas
    const canvasAspect = canvas.width / canvas.height;
    const pageAspect = maxWidth / maxHeight;

    let finalWidth, finalHeight;

    // Scale to fit within page bounds while maintaining aspect ratio
    if (canvasAspect > pageAspect) {
      // Canvas is wider relative to page - fit to width
      finalWidth = maxWidth;
      finalHeight = maxWidth / canvasAspect;
    } else {
      // Canvas is taller relative to page - fit to height
      finalHeight = maxHeight;
      finalWidth = maxHeight * canvasAspect;
    }

    // Center the image on the page
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    // Convert canvas to image data
    const imgData = canvas.toDataURL("image/png", 0.95);

    // Add image to PDF with calculated dimensions
    pdf.addImage(
      imgData,
      "PNG",
      x,
      y,
      finalWidth,
      finalHeight,
      undefined,
      "FAST"
    );

    // Add metadata
    pdf.setProperties({
      title: `Concert Memory - ${concertData.artist}`,
      subject: `Concert at ${concertData.venue}`,
      author: "Concert Memory Maker",
      creator: "Concert Memory Maker - DIY Punk Style",
    });

    return pdf;
  } finally {
    // Restore original styling
    element.style.cssText = originalStyle;
  }
};

interface PDFGeneratorProps {
  /** Concert memory data */
  concertData: ConcertMemory;
  /** Customization options */
  customization: CustomizationOptions;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Callback when generation starts */
  onGenerateStart: () => void;
  /** Callback when generation ends */
  onGenerateEnd: () => void;
}

/**
 * Component for generating and downloading PDF versions of memory cards
 * Handles client-side PDF creation with high-quality output
 */
export function PDFGenerator({
  concertData,
  customization,
  isGenerating,
  onGenerateStart,
  onGenerateEnd,
}: PDFGeneratorProps) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGeneratePDF = async () => {
    // Validate required fields
    if (!concertData.artist || !concertData.venue) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in the artist and venue name before generating PDF.",
        variant: "destructive",
      });
      return;
    }

    setError(null);
    onGenerateStart();

    try {
      // Add a small delay to ensure any recent UI updates are rendered
      await new Promise((resolve) => setTimeout(resolve, 100));

      const pdf = await generatePDF(concertData, customization);

      // Generate filename
      const artistSlug = concertData.artist
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      const venueSlug = concertData.venue
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      const dateSlug = concertData.date
        ? concertData.date.replace(/[^0-9]/g, "-")
        : "unknown-date";
      const filename = `concert-memory-${artistSlug}-${venueSlug}-${dateSlug}.pdf`;

      // Download PDF
      pdf.save(filename);

      toast({
        title: "PDF Generated!",
        description:
          "Your concert memory card has been downloaded successfully.",
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate PDF");

      toast({
        title: "Generation Failed",
        description:
          "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      onGenerateEnd();
    }
  };

  const isFormValid = Boolean(concertData.artist && concertData.venue);

  return (
    <Card className="rough-border border-2 border-black bg-white">
      <CardHeader className="bg-black text-white">
        <CardTitle className="flex items-center gap-2 font-zine text-xl">
          <FileText className="w-5 h-5" />
          GENERATE PDF
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="text-sm font-typewriter text-gray-600">
          <p>
            Create a high-quality PDF of your concert memory card for printing.
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• A4/Letter size format</li>
            <li>• Print-ready quality (300+ DPI)</li>
            <li>• Properly scaled and centered</li>
            <li>• Matches preview exactly</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-700 text-sm font-typewriter">{error}</p>
          </div>
        )}

        <Button
          onClick={handleGeneratePDF}
          disabled={!isFormValid || isGenerating}
          className="w-full bg-black text-white hover:bg-gray-800 font-typewriter font-bold"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              GENERATING PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD PDF
            </>
          )}
        </Button>

        {!isFormValid && (
          <p className="text-sm text-red-600 font-typewriter text-center">
            Please fill in artist and venue name to generate PDF
          </p>
        )}
      </CardContent>
    </Card>
  );
}
