import React from 'react';

interface ArtistSuggestion {
  id: string;
  name: string;
  country?: string;
}

interface SearchResult {
  id: number;
  artist: string;
  venue: string;
  city: string;
  date: string;
  genre: string;
}

interface ConcertSearchProps {
  query: string;
  onSearchChange: (query: string) => void;
  artistSuggestions: ArtistSuggestion[];
  onArtistSelect: (artistId: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  onSelectResult: (result: SearchResult) => void;
  theme: {
    accent: string;
    border: string;
  };
}

const ConcertSearch: React.FC<ConcertSearchProps> = ({
  query,
  onSearchChange,
  artistSuggestions,
  onArtistSelect,
  searchResults,
  isSearching,
  onSelectResult,
  theme
}) => {
  return (
    <div className={`border-2 ${theme.border} p-4 mb-6 transform rotate-1`}>
      <h3 className={`text-lg ${theme.accent} mb-3`}>Search for a concert (optional)</h3>
      
      {/* Search input with suggestions */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Start typing artist or band name..."
            className="flex-1 bg-transparent border-b-2 border-gray-600 focus:border-pink-500 outline-none p-2 text-white"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {isSearching && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          )}
        </div>
        
        {/* Artist suggestions dropdown */}
        {artistSuggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-gray-800 border border-gray-700 mt-1 rounded-md shadow-lg">
            {artistSuggestions.map(artist => (
              <div
                key={artist.id}
                className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 flex justify-between items-center"
                onClick={() => onArtistSelect(artist.id)}
              >
                <div>
                  <div className="font-medium">{artist.name}</div>
                  {artist.country && (
                    <div className="text-xs text-gray-400">{artist.country}</div>
                  )}
                </div>
                <div className="text-xs bg-gray-700 px-2 py-1 rounded">
                  Select
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className={`text-sm ${theme.accent} font-medium`}>
            Events for {searchResults[0]?.artist}
          </h4>
          
          {searchResults.map(result => (
            <button
              key={result.id}
              onClick={() => onSelectResult(result)}
              className="w-full p-3 border-2 border-gray-600 hover:border-gray-400 text-left transition-all group"
            >
              <div className="font-bold group-hover:text-pink-500 transition-colors">
                {result.artist}
              </div>
              <div className="text-sm text-gray-400 flex flex-wrap gap-2">
                <span>{result.venue}</span>
                <span>•</span>
                <span>{result.city}</span>
                <span>•</span>
                <span>{new Date(result.date).toLocaleDateString()}</span>
              </div>
              {result.genre && (
                <div className="mt-1">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {result.genre}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {query && !isSearching && artistSuggestions.length === 0 && searchResults.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No artists or events found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default ConcertSearch;