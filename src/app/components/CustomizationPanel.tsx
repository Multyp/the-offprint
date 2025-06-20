import React from 'react';
import { X } from 'lucide-react';

interface Customization {
  theme: string;
  colorScheme: string;
  font: string;
  layout: string;
  photoSize: string;
  textSize: string;
  borderStyle: string;
  backgroundPattern: string;
  stickers: { id: number; emoji: string; x: number; y: number }[];
}

interface ThemeDef {
  bg: string;
  accent: string;
  border: string;
  secondary: string;
}

interface CustomizationPanelProps {
  customization: Customization;
  onCustomizationChange: (field: string, value: string) => void;
  addSticker: (sticker: string) => void;
  removeSticker: (stickerId: number) => void;
  stickers: string[];
  themes: Record<string, ThemeDef>;
  accent: string;
  border: string;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ customization, onCustomizationChange, addSticker, removeSticker, stickers, themes, accent, border }) => (
  <div className="space-y-6">
    {/* Themes */}
    <div className={`border-2 ${border} p-6`}>
      <h3 className={`text-xl ${accent} mb-4`}>Theme</h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => onCustomizationChange('theme', key)}
            className={`p-4 border-2 transition-all ${
              customization.theme === key 
                ? `${theme.border} ${theme.accent}` 
                : 'border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className={`${theme.bg} h-8 mb-2 rounded`}></div>
            <div className="text-sm uppercase">{key}</div>
          </button>
        ))}
      </div>
    </div>
    {/* Layout Options */}
    <div className={`border-2 ${border} p-6`}>
      <h3 className={`text-xl ${accent} mb-4`}>Style Options</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm uppercase mb-2">Layout</label>
          <select
            value={customization.layout}
            onChange={(e) => onCustomizationChange('layout', e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 p-2 text-white"
          >
            <option value="chaotic">Chaotic</option>
            <option value="minimal">Minimal</option>
            <option value="collage">Collage</option>
            <option value="zine">Zine</option>
          </select>
        </div>
        <div>
          <label className="block text-sm uppercase mb-2">Border Style</label>
          <select
            value={customization.borderStyle}
            onChange={(e) => onCustomizationChange('borderStyle', e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 p-2 text-white"
          >
            {['dashed', 'solid', 'dotted', 'double'].map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm uppercase mb-2">Text Size</label>
          <select
            value={customization.textSize}
            onChange={(e) => onCustomizationChange('textSize', e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 p-2 text-white"
          >
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm uppercase mb-2">Photo Size</label>
          <select
            value={customization.photoSize}
            onChange={(e) => onCustomizationChange('photoSize', e.target.value)}
            className="w-full bg-gray-800 border-2 border-gray-600 p-2 text-white"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
    {/* Stickers */}
    <div className={`border-2 ${border} p-6`}>
      <h3 className={`text-xl ${accent} mb-4`}>Stickers & Decorations</h3>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {stickers.map((sticker, idx) => (
          <button
            key={`${sticker}-${idx}`}
            onClick={() => addSticker(sticker)}
            className="text-2xl p-2 border-2 border-gray-600 hover:border-gray-400 transition-all"
          >
            {sticker}
          </button>
        ))}
      </div>
      {customization.stickers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customization.stickers.map(sticker => (
            <button
              key={sticker.id}
              onClick={() => removeSticker(sticker.id)}
              className="text-lg p-1 bg-gray-800 hover:bg-red-800 transition-all"
            >
              {sticker.emoji} <X size={12} className="inline" />
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default CustomizationPanel; 