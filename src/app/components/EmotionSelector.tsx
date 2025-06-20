import React from 'react';
import { Heart } from 'lucide-react';

interface Emotion {
  name: string;
  icon: string;
  color: string;
}

interface EmotionSelectorProps {
  emotions: Emotion[];
  selectedEmotions: string[];
  rating: number;
  onToggle: (emotion: string) => void;
  onRatingChange: (value: number) => void;
  theme: {
    accent: string;
    border: string;
  };
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({ emotions, selectedEmotions, rating, onToggle, onRatingChange, theme }) => (
  <div className={`border-2 ${theme.border} p-6 mb-6 transform rotate-1`}>
    <h2 className={`text-2xl ${theme.accent} mb-4 flex items-center gap-2`}>
      <Heart size={24} />
      THE FEELS
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {emotions.map(emotion => (
        <button
          key={emotion.name}
          onClick={() => onToggle(emotion.name)}
          className={`p-3 border-2 border-dashed transition-all duration-200 ${
            selectedEmotions.includes(emotion.name)
              ? `${theme.border} ${theme.accent}`
              : 'border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          <div className="text-2xl mb-1">{emotion.icon}</div>
          <div className="text-xs uppercase">{emotion.name}</div>
        </button>
      ))}
    </div>
    <div className="mt-4">
      <label className="block text-sm uppercase tracking-wide mb-2">Intensity (1-10)</label>
      <input
        type="range"
        min="1"
        max="10"
        value={rating}
        onChange={(e) => onRatingChange(Number(e.target.value))}
        className="w-full"
      />
      <div className={`text-center text-3xl ${theme.accent} mt-2`}>
        {rating}/10
      </div>
    </div>
  </div>
);

export default EmotionSelector; 