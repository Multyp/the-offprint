import React from 'react';
import Image from 'next/image';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

/**
 * Props for the MemoryZinePreview component.
 */
export interface MemoryZinePreviewProps {
  formData: {
    artist: string;
    venue: string;
    date: string;
    city: string;
    genre: string;
    rating: number;
    emotions: string[];
    setlist: string;
    highlights: string;
    notes: string;
    photos: Array<{ id: number; src: string | ArrayBuffer | null; name: string }>;
    searchedEvent: unknown;
  };
  customization: {
    theme: string;
    colorScheme: string;
    font: string;
    layout: string;
    photoSize: string;
    textSize: string;
    borderStyle: string;
    backgroundPattern: string;
    stickers: Array<{ id: number; emoji: string; x: number; y: number }>;
  };
  /** Called when a sticker is moved (only if draggableStickers is true) */
  onStickerMove?: (id: number, x: number, y: number) => void;
  /** If true, stickers are draggable */
  draggableStickers?: boolean;
}

/**
 * Renders the memory zine preview, including stickers, photos, and all layout.
 * Used in both Customize and Preview steps.
 */
const MemoryZinePreview: React.FC<MemoryZinePreviewProps> = ({
  formData,
  customization,
  onStickerMove,
  draggableStickers = false,
}) => {
  // Helper for drag
  const handleDrag = (id: number, e: DraggableEvent, data: DraggableData) => {
    if (onStickerMove) {
      // Convert px to % relative to container
      const parent = data.node.parentElement;
      if (!parent) return;
      const xPct = (data.x / parent.offsetWidth) * 100;
      const yPct = (data.y / parent.offsetHeight) * 100;
      onStickerMove(id, xPct, yPct);
    }
  };

  return (
    <div id="pdf-preview" className="bg-white text-black p-8 mb-8 shadow-2xl relative overflow-hidden" style={{aspectRatio: '8.5/11', minHeight: '900px'}}>
      {/* Background Pattern */}
      {customization.backgroundPattern !== 'none' && (
        <div className={`absolute inset-0 opacity-5 ${
          customization.backgroundPattern === 'grunge' ? 'bg-gradient-to-br from-gray-900 via-transparent to-gray-900' :
          customization.backgroundPattern === 'noise' ? 'bg-gray-100' :
          'bg-gray-50'
        }`}></div>
      )}
      {/* Stickers */}
      {customization.stickers.map(sticker => {
        const style = { left: `${sticker.x}%`, top: `${sticker.y}%` };
        if (draggableStickers) {
          return (
            <Draggable
              key={sticker.id}
              defaultPosition={{
                x: (sticker.x / 100) * 600, // assume 600px width for initial
                y: (sticker.y / 100) * 900, // assume 900px height for initial
              }}
              onStop={(e, data) => handleDrag(sticker.id, e, data)}
              bounds="parent"
            >
              <div
                className="absolute text-3xl opacity-80 cursor-move"
                style={{zIndex: 20}}
              >
                {sticker.emoji}
              </div>
            </Draggable>
          );
        }
        return (
          <div
            key={sticker.id}
            className="absolute text-3xl opacity-60 print:opacity-40"
            style={style}
          >
            {sticker.emoji}
          </div>
        );
      })}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className={`text-center mb-8 pb-4 ${
          customization.borderStyle === 'solid' ? 'border-b-4 border-solid' :
          customization.borderStyle === 'dotted' ? 'border-b-4 border-dotted' :
          customization.borderStyle === 'double' ? 'border-b-4 border-double' :
          'border-b-4 border-dashed'
        } border-black`}>
          <h1 className={`font-black mb-2 ${
            customization.layout === 'chaotic' ? 'transform -rotate-1' : ''
          } ${
            customization.textSize === 'large' ? 'text-5xl' :
            customization.textSize === 'small' ? 'text-3xl' : 'text-4xl'
          }`}>
            {formData.artist || 'ARTIST NAME'}
          </h1>
          <div className="flex justify-between items-center text-sm">
            <span>{formData.venue}</span>
            <span>{formData.date}</span>
          </div>
        </div>
        {/* Content Layout */}
        <div className={`flex-1 ${
          customization.layout === 'collage' ? 'grid grid-cols-3 gap-4' :
          customization.layout === 'minimal' ? 'space-y-8' :
          'grid grid-cols-2 gap-6'
        }`}>
          {/* Left Column / Main Content */}
          <div className={`space-y-4 ${customization.layout === 'collage' ? 'col-span-2' : ''}`}>
            <div className={`pl-4 ${
              customization.borderStyle === 'solid' ? 'border-l-8 border-solid' :
              customization.borderStyle === 'dotted' ? 'border-l-8 border-dotted' :
              customization.borderStyle === 'double' ? 'border-l-8 border-double' :
              'border-l-8 border-dashed'
            } border-black`}>
              <h3 className={`font-bold mb-2 ${
                customization.textSize === 'large' ? 'text-xl' :
                customization.textSize === 'small' ? 'text-base' : 'text-lg'
              }`}>GENRE</h3>
              <p className={`$${
                customization.textSize === 'large' ? 'text-2xl' :
                customization.textSize === 'small' ? 'text-lg' : 'text-xl'
              }`}>{formData.genre}</p>
            </div>
            <div className={`p-4 ${
              customization.borderStyle === 'solid' ? 'border-2 border-solid' :
              customization.borderStyle === 'dotted' ? 'border-2 border-dotted' :
              customization.borderStyle === 'double' ? 'border-2 border-double' :
              'border-2 border-dashed'
            } border-gray-600`}>
              <h3 className={`font-bold mb-2 ${
                customization.textSize === 'large' ? 'text-xl' :
                customization.textSize === 'small' ? 'text-base' : 'text-lg'
              }`}>INTENSITY</h3>
              <div className={`font-black ${
                customization.textSize === 'large' ? 'text-8xl' :
                customization.textSize === 'small' ? 'text-4xl' : 'text-6xl'
              }`}>{formData.rating}/10</div>
            </div>
            <div className="bg-black text-white p-4">
              <h3 className={`font-bold mb-2 ${
                customization.textSize === 'large' ? 'text-xl' :
                customization.textSize === 'small' ? 'text-base' : 'text-lg'
              }`}>EMOTIONS</h3>
              <div className="flex flex-wrap gap-2">
                {formData.emotions.map(emotion => (
                  <span key={emotion} className={`bg-gray-800 px-2 py-1 uppercase ${
                    customization.textSize === 'large' ? 'text-sm' :
                    customization.textSize === 'small' ? 'text-xs' : 'text-xs'
                  }`}>
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
            {/* Photos */}
            {formData.photos.length > 0 && (
              <div className={`grid gap-2 ${
                customization.photoSize === 'large' ? 'grid-cols-1' :
                customization.photoSize === 'small' ? 'grid-cols-4' : 'grid-cols-2'
              }`}>
                {formData.photos.slice(0, customization.photoSize === 'large' ? 2 : 4).map(photo => (
                  <div key={photo.id} className={`${customization.layout === 'chaotic' ? 'transform rotate-1' : ''}`}>
                    <Image
                      src={typeof photo.src === 'string' ? photo.src : ''}
                      alt="Concert memory"
                      className={`w-full object-cover border-2 border-gray-400 ${
                        customization.photoSize === 'large' ? 'h-48' :
                        customization.photoSize === 'small' ? 'h-16' : 'h-24'
                      }`}
                      width={customization.photoSize === 'large' ? 400 : customization.photoSize === 'small' ? 100 : 200}
                      height={customization.photoSize === 'large' ? 192 : customization.photoSize === 'small' ? 64 : 96}
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Right Column / Secondary Content */}
          {customization.layout !== 'minimal' && (
            <div className="space-y-4">
              {formData.setlist && (
                <div className={`p-4 ${
                  customization.borderStyle === 'solid' ? 'border-2 border-solid' :
                  customization.borderStyle === 'dotted' ? 'border-2 border-dotted' :
                  customization.borderStyle === 'double' ? 'border-2 border-double' :
                  'border-2 border-dashed'
                } border-black`}>
                  <h3 className={`font-bold mb-2 ${
                    customization.textSize === 'large' ? 'text-xl' :
                    customization.textSize === 'small' ? 'text-base' : 'text-lg'
                  }`}>SETLIST</h3>
                  <pre className={`whitespace-pre-wrap ${
                    customization.textSize === 'large' ? 'text-sm' :
                    customization.textSize === 'small' ? 'text-xs' : 'text-sm'
                  }`}>{formData.setlist}</pre>
                </div>
              )}
              {formData.highlights && (
                <div className={`p-4 ${
                  customization.borderStyle === 'solid' ? 'border-2 border-solid' :
                  customization.borderStyle === 'dotted' ? 'border-2 border-dotted' :
                  customization.borderStyle === 'double' ? 'border-2 border-double' :
                  'border-2 border-dashed'
                } border-black`}>
                  <h3 className={`font-bold mb-2 ${
                    customization.textSize === 'large' ? 'text-xl' :
                    customization.textSize === 'small' ? 'text-base' : 'text-lg'
                  }`}>BEST MOMENTS</h3>
                  <p className={`$${
                    customization.textSize === 'large' ? 'text-sm' :
                    customization.textSize === 'small' ? 'text-xs' : 'text-sm'
                  }`}>{formData.highlights}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Notes Footer */}
        {formData.notes && (
          <div className={`mt-6 pt-4 ${
            customization.borderStyle === 'solid' ? 'border-t-4 border-solid' :
            customization.borderStyle === 'dotted' ? 'border-t-4 border-dotted' :
            customization.borderStyle === 'double' ? 'border-t-4 border-double' :
            'border-t-4 border-dashed'
          } border-black`}>
            <h3 className={`font-bold mb-2 ${
              customization.textSize === 'large' ? 'text-xl' :
              customization.textSize === 'small' ? 'text-base' : 'text-lg'
            }`}>PERSONAL NOTES</h3>
            <p className={`italic ${
              customization.textSize === 'large' ? 'text-base' :
              customization.textSize === 'small' ? 'text-xs' : 'text-sm'
            }`}>
              &quot;{formData.notes}&quot;
            </p>
          </div>
        )}
        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <div className={`inline-block px-4 py-2 ${
            customization.borderStyle === 'solid' ? 'border-2 border-solid' :
            customization.borderStyle === 'dotted' ? 'border-2 border-dotted' :
            customization.borderStyle === 'double' ? 'border-2 border-double' :
            'border-2 border-dashed'
          } border-black ${customization.layout === 'chaotic' ? 'transform rotate-1' : ''}`}>
            <p className="text-xs uppercase tracking-wider">
              Concert Memory Zine • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryZinePreview; 