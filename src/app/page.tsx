"use client";

import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

interface ConcertMemory {
  artistName: string;
  venue: string;
  venueAddress: string;
  venueCapacity: string;
  date: string;
  feelings: string;
  setlist: string[];
  rating: number;
  ticketPrice: string;
  supportingActs: string;
  notes: string;
}

interface CustomizationOptions {
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: 'handwritten' | 'typewriter' | 'bold' | 'minimal';
  layout: 'zine' | 'journal' | 'poster' | 'polaroid';
  includeImage: boolean;
  imagePosition: 'top' | 'center' | 'bottom';
  borderStyle: 'solid' | 'dashed' | 'grunge' | 'none';
  textAlignment: 'left' | 'center' | 'justified';
}

const DEFAULT_FORM_DATA: ConcertMemory = {
  artistName: '',
  venue: '',
  venueAddress: '',
  venueCapacity: '',
  date: '',
  feelings: '',
  setlist: [],
  rating: 5,
  ticketPrice: '',
  supportingActs: '',
  notes: ''
};

const DEFAULT_CUSTOMIZATION: CustomizationOptions = {
  backgroundColor: '#ffffff',
  primaryColor: '#000000',
  secondaryColor: '#ff0066',
  fontStyle: 'typewriter',
  layout: 'zine',
  includeImage: false,
  imagePosition: 'top',
  borderStyle: 'dashed',
  textAlignment: 'left',
  textColor: '#000000'
};

export default function ConcertMemoryApp(): React.JSX.Element {
  const [formData, setFormData] = useState<ConcertMemory>(DEFAULT_FORM_DATA);
  const [customization, setCustomization] = useState<CustomizationOptions>(DEFAULT_CUSTOMIZATION);
  const [setlistInput, setSetlistInput] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'info' | 'custom'>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ConcertMemory) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCustomizationChange = (field: keyof CustomizationOptions) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRatingChange = (rating: number): void => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSetlistAdd = (): void => {
    if (setlistInput.trim()) {
      setFormData(prev => ({
        ...prev,
        setlist: [...prev.setlist, setlistInput.trim()]
      }));
      setSetlistInput('');
    }
  };

  const handleSetlistRemove = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      setlist: prev.setlist.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setCustomization(prev => ({ ...prev, includeImage: true }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePDF = async (): Promise<void> => {
    if (!formData.artistName || !formData.venue || !formData.date) {
      alert('Please fill in at least Artist, Venue, and Date');
      return;
    }

    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      // Background
      pdf.setFillColor(customization.backgroundColor);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      // Border
      if (customization.borderStyle !== 'none') {
        pdf.setDrawColor(customization.primaryColor);
        pdf.setLineWidth(customization.borderStyle === 'grunge' ? 3 : 2);
        if (customization.borderStyle === 'dashed') {
          pdf.setLineDashPattern([5, 5], 0);
        }
        pdf.rect(margin/2, margin/2, pageWidth - margin, pageHeight - margin, 'S');
        pdf.setLineDashPattern([], 0);
      }

      let yPosition = margin + 10;

      // Image
      if (customization.includeImage && uploadedImage) {
        const imgHeight = 60;
        const imgWidth = contentWidth;
        
        if (customization.imagePosition === 'top') {
          pdf.addImage(uploadedImage, 'JPEG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      }

      // Title
      pdf.setFontSize(28);
      pdf.setTextColor(customization.primaryColor);
      const titleText = customization.layout === 'poster' ? 
        `${formData.artistName.toUpperCase()}` : 
        'CONCERT MEMORY';
      
      if (customization.textAlignment === 'center') {
        pdf.text(titleText, pageWidth/2, yPosition, { align: 'center' });
      } else {
        pdf.text(titleText, margin, yPosition);
      }
      yPosition += 15;

      // Decorative line
      pdf.setDrawColor(customization.secondaryColor);
      pdf.setLineWidth(2);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;

      // Artist info
      pdf.setFontSize(16);
      pdf.setTextColor(customization.primaryColor);
      pdf.text('ARTIST', margin, yPosition);
      pdf.setTextColor(customization.secondaryColor);
      pdf.setFontSize(14);
      pdf.text(formData.artistName.toUpperCase(), margin, yPosition + 8);
      yPosition += 20;

      // Venue info
      pdf.setFontSize(16);
      pdf.setTextColor(customization.primaryColor);
      pdf.text('VENUE', margin, yPosition);
      pdf.setTextColor(customization.secondaryColor);
      pdf.setFontSize(14);
      pdf.text(formData.venue.toUpperCase(), margin, yPosition + 8);
      
      if (formData.venueAddress) {
        pdf.setFontSize(10);
        pdf.text(formData.venueAddress, margin, yPosition + 16);
      }
      yPosition += formData.venueAddress ? 28 : 20;

      // Date and details
      pdf.setFontSize(16);
      pdf.setTextColor(customization.primaryColor);
      pdf.text('SHOW DETAILS', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(customization.textColor || '#000000');
      pdf.text(`Date: ${formData.date}`, margin, yPosition);
      yPosition += 8;

      if (formData.ticketPrice) {
        pdf.text(`Ticket Price: ${formData.ticketPrice}`, margin, yPosition);
        yPosition += 8;
      }

      if (formData.venueCapacity) {
        pdf.text(`Venue Capacity: ${formData.venueCapacity}`, margin, yPosition);
        yPosition += 8;
      }

      if (formData.supportingActs) {
        pdf.text(`Supporting Acts: ${formData.supportingActs}`, margin, yPosition);
        yPosition += 8;
      }

      // Rating
      pdf.text(`Rating: ${'★'.repeat(formData.rating)}${'☆'.repeat(5 - formData.rating)}`, margin, yPosition);
      yPosition += 15;

      // Setlist
      if (formData.setlist.length > 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(customization.primaryColor);
        pdf.text('SETLIST', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setTextColor(customization.textColor || '#000000');
        formData.setlist.forEach((song, index) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(`${index + 1}. ${song}`, margin + 5, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Feelings
      if (formData.feelings) {
        pdf.setFontSize(16);
        pdf.setTextColor(customization.primaryColor);
        pdf.text('HOW IT FELT', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(customization.textColor || '#000000');
        const feelingsLines = pdf.splitTextToSize(formData.feelings, contentWidth);
        pdf.text(feelingsLines, margin, yPosition);
        yPosition += feelingsLines.length * 6 + 10;
      }

      // Notes
      if (formData.notes) {
        pdf.setFontSize(16);
        pdf.setTextColor(customization.primaryColor);
        pdf.text('NOTES', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(customization.textColor || '#000000');
        const notesLines = pdf.splitTextToSize(formData.notes, contentWidth);
        pdf.text(notesLines, margin, yPosition);
      }

      // Image at bottom if specified
      if (customization.includeImage && uploadedImage && customization.imagePosition === 'bottom') {
        const imgHeight = 60;
        const imgWidth = contentWidth;
        pdf.addImage(uploadedImage, 'JPEG', margin, pageHeight - margin - imgHeight, imgWidth, imgHeight);
      }

      pdf.save(`${formData.artistName.replace(/\s+/g, '_')}_${formData.date.replace(/\//g, '-')}_memory.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = (): void => {
    setFormData(DEFAULT_FORM_DATA);
    setSetlistInput('');
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPreviewStyle = () => ({
    backgroundColor: customization.backgroundColor,
    color: customization.textAlignment === 'center' ? customization.primaryColor : customization.secondaryColor,
    borderColor: customization.borderStyle !== 'none' ? customization.primaryColor : 'transparent',
    borderStyle: customization.borderStyle === 'dashed' ? 'dashed' : 'solid',
    borderWidth: customization.borderStyle !== 'none' ? '2px' : '0',
    fontFamily: customization.fontStyle === 'handwritten' ? 'cursive' : 
                 customization.fontStyle === 'typewriter' ? 'Courier New, monospace' :
                 customization.fontStyle === 'bold' ? 'Arial Black, sans-serif' : 
                 'Arial, sans-serif',
    textAlign: customization.textAlignment as 'left' | 'center' | 'justify'
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 tracking-wider transform text-red-500">
            CONCERT MEMORY GENERATOR
          </h1>
          <div className="h-1 w-48 mx-auto mb-4 bg-gradient-to-r from-red-500 to-purple-500" />
          <p className="text-xl font-bold tracking-wide text-gray-300">
            CAPTURE THE MOMENT • CREATE THE MEMORY
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-bold tracking-wide rounded-md transition-all duration-200 ${
                activeTab === 'info' 
                  ? 'bg-red-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              CONCERT INFO
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 font-bold tracking-wide rounded-md transition-all duration-200 ${
                activeTab === 'custom' 
                  ? 'bg-purple-500 text-white' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              CUSTOMIZE
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {activeTab === 'info' ? (
              <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-red-400 tracking-wider">
                  CONCERT DETAILS
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="artist">
                        ARTIST / BAND *
                      </label>
                      <input
                        id="artist"
                        type="text"
                        value={formData.artistName}
                        onChange={handleInputChange('artistName')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-red-500 focus:outline-none rounded"
                        placeholder="The Beatles"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="venue">
                        VENUE *
                      </label>
                      <input
                        id="venue"
                        type="text"
                        value={formData.venue}
                        onChange={handleInputChange('venue')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-red-500 focus:outline-none rounded"
                        placeholder="Madison Square Garden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="venueAddress">
                        VENUE ADDRESS
                      </label>
                      <input
                        id="venueAddress"
                        type="text"
                        value={formData.venueAddress}
                        onChange={handleInputChange('venueAddress')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded"
                        placeholder="4 Pennsylvania Plaza, New York, NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="date">
                        DATE *
                      </label>
                      <input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange('date')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold focus:border-red-500 focus:outline-none rounded"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="capacity">
                        VENUE CAPACITY
                      </label>
                      <input
                        id="capacity"
                        type="text"
                        value={formData.venueCapacity}
                        onChange={handleInputChange('venueCapacity')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded"
                        placeholder="20,000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="price">
                        TICKET PRICE
                      </label>
                      <input
                        id="price"
                        type="text"
                        value={formData.ticketPrice}
                        onChange={handleInputChange('ticketPrice')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded"
                        placeholder="$75"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="supporting">
                        SUPPORTING ACTS
                      </label>
                      <input
                        id="supporting"
                        type="text"
                        value={formData.supportingActs}
                        onChange={handleInputChange('supportingActs')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded"
                        placeholder="The Rolling Stones, Queen"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        RATING
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`text-2xl transition-colors ${
                              star <= formData.rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Setlist */}
                <div className="mt-6">
                  <label className="block text-sm font-bold mb-2 text-gray-300">
                    SETLIST
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={setlistInput}
                      onChange={(e) => setSetlistInput(e.target.value)}
                      className="flex-1 p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded"
                      placeholder="Song title"
                      onKeyPress={(e) => e.key === 'Enter' && handleSetlistAdd()}
                    />
                    <button
                      onClick={handleSetlistAdd}
                      className="px-4 py-3 bg-purple-500 text-white font-bold rounded hover:bg-purple-600 transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                  {formData.setlist.length > 0 && (
                    <div className="bg-gray-700 p-4 rounded max-h-40 overflow-y-auto">
                      {formData.setlist.map((song, index) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-white font-bold">{index + 1}. {song}</span>
                          <button
                            onClick={() => handleSetlistRemove(index)}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text Areas */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="feelings">
                      HOW IT FELT
                    </label>
                    <textarea
                      id="feelings"
                      value={formData.feelings}
                      onChange={handleInputChange('feelings')}
                      rows={4}
                      className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded resize-none"
                      placeholder="Raw energy, incredible performance, life-changing..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="notes">
                      ADDITIONAL NOTES
                    </label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange('notes')}
                      rows={4}
                      className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold tracking-wide focus:border-purple-500 focus:outline-none rounded resize-none"
                      placeholder="Special moments, who you went with, memories..."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700">
                <h2 className="text-2xl font-bold mb-6 text-purple-400 tracking-wider">
                  CUSTOMIZATION
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Colors */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-300">COLORS</h3>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        BACKGROUND COLOR
                      </label>
                      <input
                        type="color"
                        value={customization.backgroundColor}
                        onChange={handleCustomizationChange('backgroundColor')}
                        className="w-full h-12 rounded border-2 border-gray-600 bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        PRIMARY COLOR
                      </label>
                      <input
                        type="color"
                        value={customization.primaryColor}
                        onChange={handleCustomizationChange('primaryColor')}
                        className="w-full h-12 rounded border-2 border-gray-600 bg-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        ACCENT COLOR
                      </label>
                      <input
                        type="color"
                        value={customization.secondaryColor}
                        onChange={handleCustomizationChange('secondaryColor')}
                        className="w-full h-12 rounded border-2 border-gray-600 bg-gray-700"
                      />
                    </div>
                  </div>

                  {/* Style Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-300">STYLE</h3>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        FONT STYLE
                      </label>
                      <select
                        value={customization.fontStyle}
                        onChange={handleCustomizationChange('fontStyle')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold rounded focus:border-purple-500 focus:outline-none"
                      >
                        <option value="typewriter">Typewriter</option>
                        <option value="handwritten">Handwritten</option>
                        <option value="bold">Bold Sans</option>
                        <option value="minimal">Clean Minimal</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        LAYOUT STYLE
                      </label>
                      <select
                        value={customization.layout}
                        onChange={handleCustomizationChange('layout')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold rounded focus:border-purple-500 focus:outline-none"
                      >
                        <option value="zine">Zine Style</option>
                        <option value="journal">Journal Entry</option>
                        <option value="poster">Concert Poster</option>
                        <option value="polaroid">Photo Memory</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        BORDER STYLE
                      </label>
                      <select
                        value={customization.borderStyle}
                        onChange={handleCustomizationChange('borderStyle')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold rounded focus:border-purple-500 focus:outline-none"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="grunge">Thick Grunge</option>
                        <option value="none">No Border</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-300">
                        TEXT ALIGNMENT
                      </label>
                      <select
                        value={customization.textAlignment}
                        onChange={handleCustomizationChange('textAlignment')}
                        className="w-full p-3 bg-gray-700 border-2 border-gray-600 text-white font-bold rounded focus:border-purple-500 focus:outline-none"
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Centered</option>
                        <option value="justified">Justified</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-300 mb-4">IMAGE</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={customization.includeImage}
                        onChange={handleCustomizationChange('includeImage')}
                        className="rounded"
                      />
                      Include Image
                    </label>
                    
                    {customization.includeImage && (
                      <>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-600 transition-colors"
                        >
                          UPLOAD IMAGE
                        </button>
                        
                        <select
                          value={customization.imagePosition}
                          onChange={handleCustomizationChange('imagePosition')}
                          className="p-2 bg-gray-700 border-2 border-gray-600 text-white font-bold rounded focus:border-purple-500 focus:outline-none"
                        >
                          <option value="top">Top</option>
                          <option value="center">Center</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </>
                    )}
                  </div>
                  
                  {uploadedImage && (
                    <div className="mt-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="max-w-xs h-32 object-cover rounded border-2 border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={generatePDF}
                disabled={isGenerating || !formData.artistName || !formData.venue || !formData.date}
                className="flex-1 py-4 px-8 font-bold tracking-wider text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {isGenerating ? 'GENERATING PDF...' : 'GENERATE A4 PDF'}
              </button>
              
              <button
                onClick={resetForm}
                className="py-4 px-8 font-bold tracking-wider text-red-400 border-2 border-red-500 hover:bg-red-500 hover:text-white rounded-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                RESET ALL
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-lg border-2 border-gray-700 sticky top-4">
              <h2 className="text-2xl font-bold mb-6 text-center tracking-wider text-yellow-400">
                LIVE PREVIEW
              </h2>

              <div 
                className="w-full aspect-[210/297] border-2 p-4 relative transform hover:scale-105 transition-transform duration-200 overflow-hidden"
                style={getPreviewStyle()}
              >
                {/* Image Preview */}
                {customization.includeImage && uploadedImage && customization.imagePosition === 'top' && (
                  <div className="mb-4">
                    <img 
                      src={uploadedImage} 
                      alt="Concert" 
                      className="w-full h-16 object-cover rounded"
                    />
                  </div>
                )}

                {/* Title */}
                <div className="text-center mb-4">
                  <div 
                    className="text-lg font-bold tracking-wider"
                    style={{ color: customization.primaryColor }}
                  >
                    {customization.layout === 'poster' ? 
                      (formData.artistName.toUpperCase() || 'YOUR BAND') : 
                      'CONCERT MEMORY'
                    }
                  </div>
                  <div 
                    className="h-px mt-2 mb-4"
                    style={{ backgroundColor: customization.secondaryColor }}
                  />
                </div>

                <div className="space-y-3 text-xs overflow-hidden">
                  {/* Artist */}
                  <div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.primaryColor }}
                    >
                      ARTIST
                    </div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.secondaryColor }}
                    >
                      {formData.artistName.toUpperCase() || 'YOUR BAND'}
                    </div>
                  </div>

                  {/* Venue */}
                  <div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.primaryColor }}
                    >
                      VENUE
                    </div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.secondaryColor }}
                    >
                      {formData.venue.toUpperCase() || 'THE VENUE'}
                    </div>
                    {formData.venueAddress && (
                      <div 
                        className="text-xs mt-1"
                        style={{ color: customization.primaryColor }}
                      >
                        {formData.venueAddress}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.primaryColor }}
                    >
                      DATE
                    </div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.secondaryColor }}
                    >
                      {formData.date || '2024-XX-XX'}
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(formData.ticketPrice || formData.venueCapacity || formData.supportingActs) && (
                    <div>
                      <div 
                        className="font-bold tracking-wide"
                        style={{ color: customization.primaryColor }}
                      >
                        DETAILS
                      </div>
                      {formData.ticketPrice && (
                        <div 
                          className="text-xs"
                          style={{ color: customization.secondaryColor }}
                        >
                          Price: {formData.ticketPrice}
                        </div>
                      )}
                      {formData.venueCapacity && (
                        <div 
                          className="text-xs"
                          style={{ color: customization.secondaryColor }}
                        >
                          Capacity: {formData.venueCapacity}
                        </div>
                      )}
                      {formData.supportingActs && (
                        <div 
                          className="text-xs"
                          style={{ color: customization.secondaryColor }}
                        >
                          Support: {formData.supportingActs}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rating */}
                  <div>
                    <div 
                      className="font-bold tracking-wide"
                      style={{ color: customization.primaryColor }}
                    >
                      RATING
                    </div>
                    <div 
                      className="text-yellow-400"
                    >
                      {'★'.repeat(formData.rating)}{'☆'.repeat(5 - formData.rating)}
                    </div>
                  </div>

                  {/* Setlist Preview */}
                  {formData.setlist.length > 0 && (
                    <div>
                      <div 
                        className="font-bold tracking-wide"
                        style={{ color: customization.primaryColor }}
                      >
                        SETLIST ({formData.setlist.length} songs)
                      </div>
                      <div 
                        className="text-xs max-h-16 overflow-hidden"
                        style={{ color: customization.secondaryColor }}
                      >
                        {formData.setlist.slice(0, 3).map((song, index) => (
                          <div key={index}>{index + 1}. {song}</div>
                        ))}
                        {formData.setlist.length > 3 && <div>...</div>}
                      </div>
                    </div>
                  )}

                  {/* Feelings */}
                  {formData.feelings && (
                    <div>
                      <div 
                        className="font-bold tracking-wide"
                        style={{ color: customization.primaryColor }}
                      >
                        FEELINGS
                      </div>
                      <div 
                        className="text-xs leading-tight max-h-12 overflow-hidden"
                        style={{ color: customization.secondaryColor }}
                      >
                        {formData.feelings.length > 60 ? 
                          formData.feelings.substring(0, 60) + '...' : 
                          formData.feelings
                        }
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {formData.notes && (
                    <div>
                      <div 
                        className="font-bold tracking-wide"
                        style={{ color: customization.primaryColor }}
                      >
                        NOTES
                      </div>
                      <div 
                        className="text-xs leading-tight max-h-12 overflow-hidden"
                        style={{ color: customization.secondaryColor }}
                      >
                        {formData.notes.length > 60 ? 
                          formData.notes.substring(0, 60) + '...' : 
                          formData.notes
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Image at bottom */}
                {customization.includeImage && uploadedImage && customization.imagePosition === 'bottom' && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <img 
                      src={uploadedImage} 
                      alt="Concert" 
                      className="w-full h-12 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              {/* Preview Info */}
              <div className="mt-4 text-xs text-gray-400 text-center">
                <p>This is a scaled preview</p>
                <p>PDF will be full A4 size (210x297mm)</p>
                <p>Current style: {customization.layout} • {customization.fontStyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 py-8">
          <div className="inline-block px-6 py-3 border-2 border-purple-500 bg-gray-800 rounded-lg">
            <p className="text-sm font-bold tracking-wider text-gray-300">
              ⚡ NO ACCOUNTS • NO TRACKING • PURE CLIENT-SIDE ⚡
            </p>
            <p className="text-xs text-gray-500 mt-1">
              All data stays in your browser • Generate unlimited PDFs
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}