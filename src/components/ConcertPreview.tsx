'use client';

import { Calendar, MapPin, Music, Star, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { ConcertMemory, CustomizationOptions } from '@/types/concert';

interface ConcertPreviewProps {
  /** Concert memory data to display */
  data: ConcertMemory;
  /** Visual customization options */
  customization: CustomizationOptions;
  /** Whether PDF is currently being generated */
  isGenerating?: boolean;
}

/**
 * Real-time preview component showing how the memory card will look
 * Updates immediately as user changes form data or customization options
 */
export function ConcertPreview({ data, customization, isGenerating }: ConcertPreviewProps) {
  const getFontClass = (font: string) => {
    switch (font) {
      case 'typewriter': return 'font-typewriter';
      case 'zine': return 'font-zine';
      case 'handwritten': return 'font-handwritten';
      case 'creepy': return 'font-creepy';
      case 'mono': return 'font-mono-alt';
      default: return 'font-typewriter';
    }
  };

  const getThemeClasses = (scheme: string) => {
    return `theme-${scheme}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'fill-current text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const cardClasses = `
    ${getFontClass(customization.font)}
    ${getThemeClasses(customization.colorScheme)}
    ${customization.polaroidFrame ? 'polaroid-frame' : ''}
    ${customization.layout === 'horizontal' ? 'landscape' : 'portrait'}
  `;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-zine">LIVE PREVIEW</h2>
        {isGenerating && (
          <div className="text-sm font-typewriter text-gray-600 animate-pulse">
            Generating PDF...
          </div>
        )}
      </div>
      
      <div className="bg-gray-100 p-8 rounded-lg">
        <div className="max-w-md mx-auto">
          <Card 
            id="concert-preview"
            className={`
              ${cardClasses}
              bg-white border-4 border-black
              rough-border relative overflow-hidden
              ${customization.layout === 'horizontal' ? 'w-full aspect-[3/2]' : 'w-full aspect-[2/3]'}
            `}
            style={{
              // Ensure no opacity effects during PDF generation
              opacity: 1,
              filter: 'none'
            }}
          >
            {/* Accent border stripe */}
            <div 
              className="absolute top-0 left-0 right-0 h-2"
              style={{ backgroundColor: `var(--accent-color, #ff0080)` }}
            />
            
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-2 break-words leading-tight">
                  {data.artist || 'ARTIST NAME'}
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words leading-none">{data.venue || 'VENUE NAME'}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center justify-center gap-2 mb-4 text-sm">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="leading-none">{formatDate(data.date)}</span>
              </div>

              {/* Mood Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-sm font-bold leading-none">MOOD:</span>
                <div className="flex gap-1">
                  {renderStars(data.moodRating)}
                </div>
              </div>

              {/* Notes */}
              {data.notes && (
                <div className="mb-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-bold leading-none">NOTES</span>
                  </div>
                  <p className="text-xs leading-relaxed break-words">
                    {data.notes}
                  </p>
                </div>
              )}

              {/* Setlist */}
              {data.setlist && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-bold leading-none">SETLIST</span>
                  </div>
                  <div className="text-xs space-y-1">
                    {data.setlist.split('\n').filter(song => song.trim()).map((song, index) => (
                      <div key={index} className="break-words leading-relaxed">
                        {index + 1}. {song.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer decoration */}
              <div className="mt-auto pt-4 border-t-2 border-black">
                <div className="text-center text-xs font-bold leading-none">
                  KEEP THIS MEMORY FOREVER
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 font-typewriter text-center">
        This is how your memory card will look when printed.
        <br />
        Make changes above to see them reflected here instantly.
      </p>
    </div>
  );
}