"use client";

import { LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/consts/templates";
import type { CustomizationOptions } from "@/types/concert";

interface TemplateSelectorProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
}

export function TemplateSelector({ options, onChange }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 font-typewriter font-bold">
        <LayoutTemplate className="w-4 h-4" />
        Design Template
      </div>
      <div className="grid grid-cols-4 gap-2">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant={
              options.colorScheme === template.id ? "default" : "outline"
            }
            className={`p-2 h-auto flex-col items-center text-center ${
              options.colorScheme === template.id
                ? "bg-black text-white border-2"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onChange({ ...options, ...template.config })}
          >
            <div className="text-2xl mb-1">{template.preview}</div>
            <span className="text-xs font-typewriter">{template.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
