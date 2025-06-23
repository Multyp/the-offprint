'use client';

import { useState } from 'react';
import { Calendar, MapPin, Music, Mic, Star, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import type { ConcertMemory, FormErrors } from '@/types/concert';

interface ConcertFormProps {
  /** Current concert memory data */
  data: ConcertMemory;
  /** Callback when form data changes */
  onChange: (data: ConcertMemory) => void;
}

/**
 * Main form component for collecting concert memory information
 * Includes validation and real-time updates
 */
export function ConcertForm({ data, onChange }: ConcertFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Validates form field and updates data
   */
  const handleFieldChange = (field: keyof ConcertMemory, value: string | number) => {
    // Clear previous error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Validate required fields
    if ((field === 'artist' || field === 'venue') && !value) {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
    }

    // Update data
    onChange({ ...data, [field]: value });
  };

  const moodLabels = {
    1: 'Terrible',
    2: 'Meh',
    3: 'Good',
    4: 'Amazing',
    5: 'Life Changing'
  };

  return (
    <Card className="rough-border border-2 border-black bg-white">
      <CardHeader className="bg-black text-white">
        <CardTitle className="flex items-center gap-2 font-zine text-xl">
          <Music className="w-5 h-5" />
          CONCERT MEMORY FORM
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        {/* Artist Name - Required */}
        <div className="space-y-2">
          <Label htmlFor="artist" className="flex items-center gap-2 font-typewriter font-bold">
            <Mic className="w-4 h-4" />
            Artist/Band Name *
          </Label>
          <Input
            id="artist"
            placeholder="e.g., The Ramones, Dead Kennedys, Fugazi"
            value={data.artist}
            onChange={(e) => handleFieldChange('artist', e.target.value)}
            className={`font-typewriter ${errors.artist ? 'border-red-500' : ''}`}
            required
          />
          {errors.artist && (
            <p className="text-red-500 text-sm font-typewriter">{errors.artist}</p>
          )}
        </div>

        {/* Venue Name - Required */}
        <div className="space-y-2">
          <Label htmlFor="venue" className="flex items-center gap-2 font-typewriter font-bold">
            <MapPin className="w-4 h-4" />
            Venue Name *
          </Label>
          <Input
            id="venue"
            placeholder="e.g., CBGB, The Fillmore, Local Dive Bar"
            value={data.venue}
            onChange={(e) => handleFieldChange('venue', e.target.value)}
            className={`font-typewriter ${errors.venue ? 'border-red-500' : ''}`}
            required
          />
          {errors.venue && (
            <p className="text-red-500 text-sm font-typewriter">{errors.venue}</p>
          )}
        </div>

        {/* Concert Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2 font-typewriter font-bold">
            <Calendar className="w-4 h-4" />
            Concert Date
          </Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
            className="font-typewriter"
          />
        </div>

        {/* Mood Rating */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 font-typewriter font-bold">
            <Star className="w-4 h-4" />
            How was it? ({moodLabels[data.moodRating as keyof typeof moodLabels]})
          </Label>
          <div className="px-3">
            <Slider
              value={[data.moodRating]}
              onValueChange={([value]) => handleFieldChange('moodRating', value)}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs font-typewriter text-gray-500 mt-1">
              <span>Terrible</span>
              <span>Meh</span>
              <span>Good</span>
              <span>Amazing</span>
              <span>Life Changing</span>
            </div>
          </div>
        </div>

        {/* Personal Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2 font-typewriter font-bold">
            <FileText className="w-4 h-4" />
            Personal Notes & Feelings
          </Label>
          <Textarea
            id="notes"
            placeholder="How did it make you feel? What stood out? Any crazy stories?"
            value={data.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            className="font-typewriter min-h-[100px] resize-vertical"
            rows={4}
          />
        </div>

        {/* Setlist */}
        <div className="space-y-2">
          <Label htmlFor="setlist" className="flex items-center gap-2 font-typewriter font-bold">
            <Music className="w-4 h-4" />
            Setlist (Optional)
          </Label>
          <Textarea
            id="setlist"
            placeholder="List the songs they played, one per line..."
            value={data.setlist}
            onChange={(e) => handleFieldChange('setlist', e.target.value)}
            className="font-typewriter min-h-[80px] resize-vertical"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}