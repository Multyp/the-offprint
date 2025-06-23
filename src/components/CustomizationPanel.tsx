"use client";

import { Palette, Type, Layout, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CustomizationOptions } from "@/types/concert";
import { TemplateSelector } from "./TemplateSelector";

interface CustomizationPanelProps {
  /** Current customization options */
  options: CustomizationOptions;
  /** Callback when options change */
  onChange: (options: CustomizationOptions) => void;
}

/**
 * Panel for customizing the visual appearance of the memory card
 * Includes color schemes, fonts, layout, and special effects
 */
export function CustomizationPanel({
  options,
  onChange,
}: CustomizationPanelProps) {
  const colorSchemes = [
    {
      id: "neon-pink",
      name: "Neon Pink",
      color: "#ff0080",
      description: "Hot pink punk energy",
    },
    {
      id: "electric-blue",
      name: "Electric Blue",
      color: "#00ffff",
      description: "Cyberpunk vibes",
    },
    {
      id: "toxic-green",
      name: "Toxic Green",
      color: "#39ff14",
      description: "Radioactive glow",
    },
    {
      id: "blood-red",
      name: "Blood Red",
      color: "#ff073a",
      description: "Classic punk rage",
    },
  ] as const;

  const fonts = [
    {
      id: "typewriter",
      name: "Typewriter",
      description: "Classic punk zine aesthetic",
    },
    { id: "zine", name: "Zine Style", description: "Hand-stamped letters" },
    { id: "handwritten", name: "Handwritten", description: "Personal touch" },
    { id: "creepy", name: "Horror Punk", description: "Spooky vibes" },
    { id: "mono", name: "Code Punk", description: "Digital underground" },
  ] as const;

  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <Card className="rough-border border-2 border-black bg-white">
      <CardHeader className="bg-black text-white">
        <CardTitle className="flex items-center gap-2 font-zine text-xl">
          <Palette className="w-5 h-5" />
          DIY CUSTOMIZATION
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Template Schemes */}
        <TemplateSelector options={options} onChange={onChange} />

        {/* Font Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 font-typewriter font-bold">
            <Type className="w-4 h-4" />
            Font Style
          </Label>
          <div className="space-y-2">
            {fonts.map((font) => (
              <Button
                key={font.id}
                variant={options.font === font.id ? "default" : "outline"}
                className={`w-full p-3 h-auto flex-col items-start text-left font-typewriter ${
                  options.font === font.id
                    ? "bg-black text-white border-2"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => updateOption("font", font.id)}
              >
                <span className="font-bold text-sm">{font.name}</span>
                <span className="text-xs opacity-70">{font.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Layout Toggle */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 font-typewriter font-bold">
            <Layout className="w-4 h-4" />
            Layout Orientation
          </Label>
          <div className="flex gap-2">
            <Button
              variant={options.layout === "vertical" ? "default" : "outline"}
              className={`flex-1 font-typewriter ${
                options.layout === "vertical"
                  ? "bg-black text-white"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => updateOption("layout", "vertical")}
            >
              Vertical
            </Button>
            <Button
              variant={options.layout === "horizontal" ? "default" : "outline"}
              className={`flex-1 font-typewriter ${
                options.layout === "horizontal"
                  ? "bg-black text-white"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => updateOption("layout", "horizontal")}
            >
              Horizontal
            </Button>
          </div>
        </div>

        {/* Polaroid Frame Toggle */}
        <div className="flex items-center justify-between">
          <Label
            htmlFor="polaroid"
            className="flex items-center gap-2 font-typewriter font-bold"
          >
            <Camera className="w-4 h-4" />
            Polaroid Frame Effect
          </Label>
          <Switch
            id="polaroid"
            checked={options.polaroidFrame}
            onCheckedChange={(checked) =>
              updateOption("polaroidFrame", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
