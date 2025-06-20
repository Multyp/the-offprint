import React from 'react';
import Image from 'next/image';
import { Upload, Camera, X } from 'lucide-react';

interface Photo {
  id: number;
  src: string | ArrayBuffer | null;
  name: string;
}

interface PhotoUploadProps {
  photos: Photo[];
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (photoId: number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  theme: {
    border: string;
    accent: string;
  };
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onUpload, onRemove, fileInputRef, cameraInputRef, theme }) => (
  <div className={`border-2 ${theme.border} p-6 mb-6 transform rotate-1`}>
    <h2 className={`text-2xl ${theme.accent} mb-4 flex items-center gap-2`}>
      <Camera size={24} />
      PHOTOS & MEMORIES
    </h2>
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`flex-1 p-3 border-2 ${theme.border} hover:bg-opacity-20 transition-all`}
      >
        <Upload className="inline mr-2" size={16} />
        Upload Photos
      </button>
      <button
        onClick={() => cameraInputRef.current?.click()}
        className={`flex-1 p-3 border-2 ${theme.border} hover:bg-opacity-20 transition-all`}
      >
        <Camera className="inline mr-2" size={16} />
        Take Photo
      </button>
    </div>
    <input
      ref={fileInputRef}
      type="file"
      multiple
      accept="image/*"
      onChange={onUpload}
      className="hidden"
    />
    <input
      ref={cameraInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onUpload}
      className="hidden"
    />
    {photos.length > 0 && (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {photos.map(photo => (
          <div key={photo.id} className="relative">
            <Image
              src={typeof photo.src === 'string' ? photo.src : ''}
              alt={photo.name}
              className="w-full h-20 object-cover border-2 border-gray-600"
              width={200}
              height={80}
              unoptimized
            />
            <button
              onClick={() => onRemove(photo.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PhotoUpload; 