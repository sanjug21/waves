'use client';

import {  X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

export default function ImagePreview({ src, alt = 'Preview', onClose }: ImagePreviewProps) {
   const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center h-screen" onClick={handleBackgroundClick}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white text-gray-700 hover:text-[rgb(255,127,80)] rounded-full p-2 shadow-lg"
        title="Back"
      >
        <X size={20} />
      </button>

      <img
        src={src}
        alt={alt}
        className="h-screen w-auto max-w-full object-contain rounded-md shadow-2xl pt-2 pb-2"
      />
    </div>
  );
}
