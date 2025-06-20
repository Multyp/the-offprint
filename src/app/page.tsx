"use client";

import React, { useState } from 'react';
import { Palette, Download, RotateCcw } from 'lucide-react';
import MemoryZinePreview from './components/MemoryZinePreview';
import ConcertSearch from './components/ConcertSearch';
import ShowInfoForm from './components/ShowInfoForm';
import PhotoUpload from './components/PhotoUpload';
import EmotionSelector from './components/EmotionSelector';
import MemoriesSection from './components/MemoriesSection';
import CustomizationPanel from './components/CustomizationPanel';
import { useEffect } from 'react';

// --- Types ---
interface Photo {
  id: number;
  src: string | ArrayBuffer | null;
  name: string;
}

interface Sticker {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

interface FormData {
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
  photos: Photo[];
  searchedEvent: SearchResult | null;
}

interface Customization {
  theme: string;
  colorScheme: string;
  font: string;
  layout: string;
  photoSize: string;
  textSize: string;
  borderStyle: string;
  backgroundPattern: string;
  stickers: Sticker[];
}

interface SearchResult {
  id: number;
  artist: string;
  venue: string;
  city: string;
  date: string;
  genre: string;
}

interface ArtistSuggestion {
  id: string;
  name: string;
  country?: string;
}

interface MusicBrainzEvent {
  venue?: { name?: string };
  area?: { name?: string };
  date?: string;
  'life-span'?: { begin?: string };
  artist?: { tags?: { name: string }[] };
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const stickers = [
  '🔥', '🌧️', '⚡', '💀', '✨', '🤘', '🖤', '💥', '🎸', '🎤', '🎶', '🎵', '🥁', '🎷', '🎹', '🕶️', '👟', '🧷', '🦇', '🕸️', '🧛', '🧟', '🦹', '🦸', '🎧', '📸', '🎫', '🚬', '🍺', '🍕', '🧃', '🦄', '👽', '👾', '🦠', '🧨', '🛹', '🛼', '🦅', '🦉', '🦇', '🦋', '🦎', '🦖', '🦕', '🦑', '🦐', '🦞', '🦀', '🦚', '🦜', '🦢', '🦩', '🦦', '🦥', '🦨', '🦡', '🦃', '🦆', '🦅', '🦉', '🦇', '🦈', '🦉', '🦊', '🦋', '🦌', '🦍', '🦏', '🦐', '🦑', '🦒', '🦓', '🦔', '🦕', '🦖', '🦗', '🦘', '🦙', '🦚', '🦛', '🦜', '🦝', '🦞', '🦟', '🦠', '🦡', '🦢', '🦣', '🦤', '🦥', '🦦', '🦧', '🦨', '🦩', '🦪', '🦫', '🦬', '🦭', '🦮', '🦯', '🦰', '🦱', '🦲', '🦳', '🦴', '🦵', '🦶', '🦷', '🦸', '🦹', '🦺', '🦻', '🦼', '🦽', '🦾', '🦿', '🧀', '🧁', '🧂', '🧃', '🧄', '🧅', '🧇', '🧈', '🧉', '🧊', '🧋', '🧍', '🧎', '🧏', '🧐', '🧑', '🧒', '🧓', '🧔', '🧕', '🧖', '🧗', '🧘', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🧠', '🧡', '🧢', '🧣', '🧤', '🧥', '🧦', '🧧', '🧨', '🧩', '🧪', '🧫', '🧬', '🧭', '🧮', '🧯', '🧰', '🧱', '🧲', '🧳', '🧴', '🧵', '🧶', '🧷', '🧸', '🧹', '🧺', '🧻', '🧼', '🧽', '🧾', '🧿', '🩰', '🩱', '🩲', '🩳', '🩴', '🩸', '🩹', '🩺', '🪀', '🪁', '🪂', '🪃', '🪄', '🪅', '🪆', '🪐', '🪑', '🪒', '🪓', '🪔', '🪕', '🪖', '🪗', '🪘', '🪙', '🪚', '🪛', '🪜', '🪝', '🪞', '🪟', '🪠', '🪡', '🪢', '🪣', '🪤', '🪥', '🪦', '🪧', '🪨', '🪰', '🪱', '🪲', '🪳', '🪴', '🪵', '🪶', '🪷', '🪸', '🪹', '🪺', '🫀', '🫁', '🫂', '🫐', '🫑', '🫒', '🫓', '🫔', '🫕', '🫖', '🫗', '🫘', '🫙', '🫠', '🫡', '🫢', '🫣', '🫤', '🫥', '🫦', '🫧', '🫰', '🫱', '🫲', '🫳', '🫴', '🫵', '🫶', '🫷', '🫸', '🫹', '🫺', '🫻', '🫼', '🫽', '🫾', '🫿'];

const ConcertMemoryApp = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'customize' | 'preview'>('form');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const [artistSuggestions, setArtistSuggestions] = useState<ArtistSuggestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [formData, setFormData] = useState<FormData>({
    artist: '',
    venue: '',
    date: '',
    city: '',
    genre: '',
    rating: 5,
    emotions: [],
    setlist: '',
    highlights: '',
    notes: '',
    photos: [],
    searchedEvent: null
  });
  
  const [customization, setCustomization] = useState<Customization>({
    theme: 'punk',
    colorScheme: 'neon-pink',
    font: 'grunge',
    layout: 'chaotic',
    photoSize: 'medium',
    textSize: 'normal',
    borderStyle: 'dashed',
    backgroundPattern: 'none',
    stickers: []
  });

  const themes = {
    punk: { bg: 'bg-black', accent: 'text-pink-500', border: 'border-pink-500', secondary: 'text-pink-300' },
    goth: { bg: 'bg-gray-900', accent: 'text-purple-400', border: 'border-purple-400', secondary: 'text-purple-300' },
    metal: { bg: 'bg-red-950', accent: 'text-red-400', border: 'border-red-400', secondary: 'text-red-300' },
    emo: { bg: 'bg-gray-800', accent: 'text-blue-400', border: 'border-blue-400', secondary: 'text-blue-300' },
    hardcore: { bg: 'bg-orange-950', accent: 'text-orange-400', border: 'border-orange-400', secondary: 'text-orange-300' },
    industrial: { bg: 'bg-slate-900', accent: 'text-cyan-400', border: 'border-cyan-400', secondary: 'text-cyan-300' }
  };

  const emotions = [
    { name: 'Euphoric', icon: '🔥', color: 'text-orange-400' },
    { name: 'Melancholic', icon: '🌧️', color: 'text-blue-400' },
    { name: 'Rebellious', icon: '⚡', color: 'text-yellow-400' },
    { name: 'Connected', icon: '💀', color: 'text-purple-400' },
    { name: 'Transcendent', icon: '✨', color: 'text-pink-400' },
    { name: 'Aggressive', icon: '🤘', color: 'text-red-400' },
    { name: 'Nostalgic', icon: '🖤', color: 'text-gray-400' },
    { name: 'Cathartic', icon: '💥', color: 'text-green-400' }
  ];

  const genres = ['Punk', 'Metal', 'Goth', 'Emo', 'Hardcore', 'Post-Punk', 'Industrial', 'Doom', 'Black Metal', 'Death Metal', 'Shoegaze', 'Grunge', 'Metalcore', 'Screamo', 'Post-Rock'];

  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setArtistSuggestions([]);
      return;
    }

    const fetchArtistSuggestions = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(
            debouncedSearchQuery
          )}&fmt=json&limit=5`
        );
        
        if (!response.ok) throw new Error('Failed to fetch artists');
        
        const data = await response.json();
        setArtistSuggestions(data.artists || []);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setArtistSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchArtistSuggestions();
  }, [debouncedSearchQuery]);

  const fetchEventsForArtist = async (artistId: string) => {
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const eventRes = await fetch(
        `https://musicbrainz.org/ws/2/event?artist=${artistId}&fmt=json&limit=10`
      );
      
      if (!eventRes.ok) throw new Error('Failed to fetch events');
      
      const eventData = await eventRes.json();
      const events = eventData.events || [];
      
      const results = events.map((ev: MusicBrainzEvent, idx: number) => ({
        id: idx + 1,
        artist: ev.artist || artistSuggestions.find(a => a.id === artistId)?.name || '',
        venue: ev.venue?.name || 'Unknown venue',
        city: ev.area?.name || 'Unknown city',
        date: ev.date || ev['life-span']?.begin || '',
        genre: ev.artist?.tags?.[0]?.name || '',
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  
  // --- API Integration ---
  // MusicBrainz concert search
  // setlist.fm API integration
  const getSetlistData = async (artist: string, date: string) => {
    // Requires setlist.fm API key
    const API_KEY = 'YOUR_SETLISTFM_API_KEY'; // <-- Replace with your key
    if (!artist || !date) return '';
    try {
      // 1. Search for artist MBID
      const mbRes = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artist)}&fmt=json&limit=1`);
      const mbData = await mbRes.json();
      const mbid = mbData.artists?.[0]?.id;
      if (!mbid) return '';
      // 2. Search for setlists for this artist and date
      const setlistRes = await fetch(`https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=${mbid}&date=${date.replace(/-/g, '')}`, {
        headers: {
          'x-api-key': API_KEY,
          'Accept': 'application/json',
        },
      });
      if (!setlistRes.ok) return '';
      const setlistData = await setlistRes.json();
      const setlist = setlistData.setlist?.[0];
      if (!setlist) return '';
      // Format setlist
      let songs = '';
      if (setlist.sets?.set?.length) {
        (setlist.sets.set as Array<Record<string, unknown>>).forEach((set) => {
          if ((set as { name?: string }).name) songs += `${(set as { name: string }).name}:
`;
          ((set as { song?: Array<{ name: string }> }).song || []).forEach((song, idx) => {
            songs += `${idx + 1}. ${song.name}
`;
          });
        });
      }
      return songs.trim();
    } catch {
      return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomizationChange = (field: string, value: string) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  };

  const toggleEmotion = (emotion: string) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, { id: Date.now() + Math.random(), src: typeof e.target?.result === 'string' ? e.target.result : '', name: file.name }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const selectSearchResult = (result: SearchResult) => {
    setFormData(prev => ({
      ...prev,
      artist: result.artist,
      venue: result.venue,
      city: result.city,
      date: result.date,
      genre: result.genre,
      searchedEvent: result
    }));
    setSearchResults([]);
  };

  const loadSetlist = async () => {
    if (formData.artist && formData.date) {
      const setlist = await getSetlistData(formData.artist, formData.date);
      setFormData(prev => ({ ...prev, setlist }));
    }
  };

  const addSticker = (sticker: string) => {
    setCustomization(prev => ({
      ...prev,
      stickers: [...prev.stickers, { id: Date.now(), emoji: sticker, x: Math.random() * 80, y: Math.random() * 80 }]
    }));
  };

  const removeSticker = (stickerId: number) => {
    setCustomization(prev => ({
      ...prev,
      stickers: prev.stickers.filter(s => s.id !== stickerId)
    }));
  };

  const generatePDF = async () => {
    // @ts-expect-error: No types for html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default;
    const printContent = document.getElementById('pdf-preview');
    if (!printContent) return;
    html2pdf()
      .set({
        margin: 0,
        filename: `Concert_Memory_${formData.artist || 'Zine'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .from(printContent)
      .save();
  };

  const FormStep = () => (
    <div className={`min-h-screen ${themes[customization.theme as keyof typeof themes].bg} text-white p-6`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold ${themes[customization.theme as keyof typeof themes].accent} mb-2 transform -rotate-1`}>
            CONCERT MEMORY ZINE
          </h1>
          <div className={`border-2 ${themes[customization.theme as keyof typeof themes].border} border-dashed p-2 inline-block transform rotate-1`}>
            <p className="text-sm uppercase tracking-wider">DIY • UNDERGROUND • MEMORIES</p>
          </div>
        </div>

        {/* Concert Search (Extended Option) */}
        <ConcertSearch
          query={searchQuery}
          onSearchChange={setSearchQuery}
          artistSuggestions={artistSuggestions}
          onArtistSelect={fetchEventsForArtist}
          searchResults={searchResults}
          isSearching={isSearching}
          onSelectResult={selectSearchResult}
          theme={themes[customization.theme as keyof typeof themes]}
        />

        {/* Basic Info Section (always visible) */}
        <ShowInfoForm
          formData={formData}
          onChange={handleInputChange}
          genres={genres}
          theme={themes[customization.theme as keyof typeof themes]}
        />

        {/* Photo Upload */}
        <PhotoUpload
          photos={formData.photos}
          onUpload={handlePhotoUpload}
          onRemove={removePhoto}
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          theme={themes[customization.theme as keyof typeof themes]}
        />

        {/* Emotional Impact */}
        <EmotionSelector
          emotions={emotions}
          selectedEmotions={formData.emotions}
          rating={formData.rating}
          onToggle={toggleEmotion}
          onRatingChange={(value) => handleInputChange('rating', String(value))}
          theme={themes[customization.theme as keyof typeof themes]}
        />

        {/* Memories Section */}
        <MemoriesSection
          setlist={formData.setlist}
          highlights={formData.highlights}
          notes={formData.notes}
          onChange={handleInputChange}
          onLoadSetlist={loadSetlist}
          artist={formData.artist}
          date={formData.date}
          theme={themes[customization.theme as keyof typeof themes]}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentStep('customize')}
            className={`px-8 py-3 ${themes[customization.theme as keyof typeof themes].accent} border-2 ${themes[customization.theme as keyof typeof themes].border} hover:bg-opacity-20 transition-all duration-200 uppercase tracking-wide transform hover:scale-105`}
          >
            <Palette className="inline mr-2" size={16} />
            Customize
          </button>
        </div>
      </div>
    </div>
  );

  const CustomizeStep = () => (
    <div className={`min-h-screen ${themes[customization.theme as keyof typeof themes].bg} text-white p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold ${themes[customization.theme as keyof typeof themes].accent} mb-2 transform rotate-1`}>
            MAKE IT YOURS
          </h1>
          <p className="text-gray-400">Customize your memory zine</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Options */}
          <CustomizationPanel
            customization={customization}
            onCustomizationChange={handleCustomizationChange}
            addSticker={addSticker}
            removeSticker={removeSticker}
            stickers={stickers}
            themes={themes}
            accent={themes[customization.theme as keyof typeof themes].accent}
            border={themes[customization.theme as keyof typeof themes].border}
          />
          {/* Preview */}
          <div className={`border-2 ${themes[customization.theme as keyof typeof themes].border} p-6`}>
            <h3 className={`text-xl ${themes[customization.theme as keyof typeof themes].accent} mb-4`}>Preview</h3>
            <MemoryZinePreview
              formData={formData}
              customization={customization}
              draggableStickers={true}
              onStickerMove={(id, x, y) => {
                setCustomization(prev => ({
                  ...prev,
                  stickers: prev.stickers.map(sticker =>
                    sticker.id === id ? { ...sticker, x, y } : sticker
                  )
                }));
              }}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => setCurrentStep('form')}
            className="px-6 py-2 border-2 border-gray-600 hover:border-gray-400 transition-all uppercase tracking-wide"
          >
            Back
          </button>
          <button
            onClick={() => setCurrentStep('preview')}
            className={`px-8 py-3 ${themes[customization.theme as keyof typeof themes].accent} border-2 ${themes[customization.theme as keyof typeof themes].border} hover:bg-opacity-20 transition-all duration-200 uppercase tracking-wide transform hover:scale-105`}
          >
            <Download className="inline mr-2" size={16} />
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );

  const PreviewStep = () => (
    <div className={`min-h-screen ${themes[customization.theme as keyof typeof themes].bg} text-white p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold ${themes[customization.theme as keyof typeof themes].accent} mb-2`}>
            YOUR MEMORY ZINE
          </h1>
          <p className="text-gray-400">Ready to save and share</p>
        </div>
        {/* PDF Preview */}
        <MemoryZinePreview
          formData={formData}
          customization={customization}
        />
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center no-print">
          <button
            onClick={() => setCurrentStep('customize')}
            className="px-6 py-2 border-2 border-gray-600 hover:border-gray-400 transition-all uppercase tracking-wide"
          >
            Back to Customize
          </button>
          <button
            onClick={generatePDF}
            className={`px-8 py-3 ${themes[customization.theme as keyof typeof themes].accent} border-2 ${themes[customization.theme as keyof typeof themes].border} hover:bg-opacity-20 transition-all duration-200 uppercase tracking-wide transform hover:scale-105`}
          >
            <Download className="inline mr-2" size={16} />
            Download PDF
          </button>
          <button
            onClick={() => {
              setFormData({
                artist: '',
                venue: '',
                date: '',
                city: '',
                genre: '',
                rating: 5,
                emotions: [],
                setlist: '',
                highlights: '',
                notes: '',
                photos: [],
                searchedEvent: null
              });
              setCustomization({
                theme: 'punk',
                colorScheme: 'neon-pink',
                font: 'grunge',
                layout: 'chaotic',
                photoSize: 'medium',
                textSize: 'normal',
                borderStyle: 'dashed',
                backgroundPattern: 'none',
                stickers: []
              });
              setCurrentStep('form');
            }}
            className="px-6 py-2 border-2 border-gray-600 hover:border-gray-400 transition-all uppercase tracking-wide"
          >
            <RotateCcw className="inline mr-2" size={16} />
            New Memory
          </button>
        </div>
        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400 text-sm no-print">
          <p>🎸 Tip: Use your browser&apos;s print function to save as PDF or print directly!</p>
          <p>📱 On mobile: Share button → Print → Save as PDF</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentStep === 'form' && <FormStep />}
      {currentStep === 'customize' && <CustomizeStep />}
      {currentStep === 'preview' && <PreviewStep />}
    </>
  );
};

export default ConcertMemoryApp;
