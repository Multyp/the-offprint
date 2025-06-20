import React from 'react';

interface FormData {
  artist: string;
  venue: string;
  date: string;
  city: string;
  genre: string;
}

interface ShowInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  genres: string[];
  theme: {
    accent: string;
    border: string;
  };
}

const ShowInfoForm: React.FC<ShowInfoFormProps> = ({ formData, onChange, genres, theme }) => (
  <div className={`border-2 ${theme.border} p-6 mb-6 transform -rotate-1`}>
    <h2 className={`text-2xl ${theme.accent} mb-4 flex items-center gap-2`}>
      THE SHOW
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">Artist/Band</label>
        <input
          type="text"
          value={formData.artist}
          onChange={(e) => onChange('artist', e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
          placeholder="Who rocked your world?"
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">Venue</label>
        <input
          type="text"
          value={formData.venue}
          onChange={(e) => onChange('venue', e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
          placeholder="The sacred ground"
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => onChange('date', e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
        />
      </div>
      <div>
        <label className="block text-sm uppercase tracking-wide mb-2">City</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => onChange('city', e.target.value)}
          className="w-full bg-transparent border-b-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
          placeholder="Where the magic happened"
        />
      </div>
    </div>
    <div className="mt-4">
      <label className="block text-sm uppercase tracking-wide mb-2">Genre</label>
      <select
        value={formData.genre}
        onChange={(e) => onChange('genre', e.target.value)}
        className="w-full bg-gray-800 border-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
      >
        <option value="">Select genre</option>
        {genres.map(genre => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
    </div>
  </div>
);

export default ShowInfoForm; 