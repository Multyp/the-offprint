'use client';

import { Music, Zap } from 'lucide-react';

/**
 * Main header component with punk-inspired styling
 */
export function Header() {
  return (
    <header className="bg-black text-white border-b-4 border-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-1"></div>
      
      <div className="container mx-auto px-4 py-6 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-red-500" />
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-creepy tracking-wider">
              CONCERT MEMORY MAKER
            </h1>
            <p className="text-gray-300 font-typewriter text-sm tracking-wide">
              DIY // PUNK // PRINT // REMEMBER
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-xs font-mono text-gray-400 uppercase tracking-widest">
          Create → Customize → Print → Keep Forever
        </div>
      </div>
      
      {/* Decorative torn edge effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500"></div>
    </header>
  );
}