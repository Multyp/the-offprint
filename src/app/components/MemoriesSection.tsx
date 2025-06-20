import React from 'react';
import { Zap } from 'lucide-react';

interface MemoriesSectionProps {
  setlist: string;
  highlights: string;
  notes: string;
  onChange: (field: string, value: string) => void;
  onLoadSetlist: () => void;
  artist: string;
  date: string;
  theme: {
    accent: string;
    border: string;
  };
}

const MemoriesSection: React.FC<MemoriesSectionProps> = ({ setlist, highlights, notes, onChange, onLoadSetlist, artist, date, theme }) => (
  <div className={`border-2 ${theme.border} p-6 mb-6 transform -rotate-1`}>
    <h2 className={`text-2xl ${theme.accent} mb-4 flex items-center gap-2`}>
      <Zap size={24} />
      THE MEMORIES
    </h2>
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm uppercase tracking-wide">Setlist Highlights</label>
          {artist && date && (
            <button
              onClick={onLoadSetlist}
              className={`text-xs px-2 py-1 ${theme.accent} border ${theme.border} hover:bg-opacity-20 transition-all`}
            >
              Auto-load Setlist
            </button>
          )}
        </div>
        <textarea
          value={setlist}
          onChange={(e) => onChange('setlist', e.target.value)}
          className="w-full bg-transparent border-2 border-gray-600 focus:border-pink-500 outline-none p-3 text-white h-24 resize-none"
          placeholder="Songs that hit different..."
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">Best Moments</label>
        <textarea
          value={highlights}
          onChange={(e) => onChange('highlights', e.target.value)}
          className="w-full bg-transparent border-2 border-gray-600 focus:border-pink-500 outline-none p-3 text-white h-24 resize-none"
          placeholder="Crowd surfing? Stage dive? That perfect breakdown?"
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">Personal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full bg-transparent border-2 border-gray-600 focus:border-pink-500 outline-none p-3 text-white h-32 resize-none"
          placeholder="How did this show change you? What will you remember forever?"
        />
      </div>
    </div>
  </div>
);

export default MemoriesSection; 