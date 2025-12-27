"use client";

import { ImagePreviewProps } from "@/types/Props.types";
import { X } from "lucide-react";

export default function ImagePreview({
  src,
  alt = "Preview",
  onClose,
  username,
}: ImagePreviewProps) {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center w-screen h-screen animate-in fade-in duration-300"
      onClick={handleBackgroundClick}
    >
      {/* USERNAME FLOATING TAG */}
      {username && (
        <div className="absolute top-6 left-6 flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-[0.2em] shadow-2xl">
          {username}
        </div>
      )}

      {/* CLOSE BUTTON - Minimalist Glass */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 bg-white/10 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/40 rounded-full p-2.5 shadow-2xl transition-all active:scale-90 group"
        title="Close Preview"
      >
        <X
          size={22}
          className="group-hover:rotate-90 transition-transform duration-300"
        />
      </button>

      {/* THE IMAGE */}
      <div className="relative p-4 md:p-10 max-w-7xl max-h-screen flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] w-auto max-w-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500 border border-white/5"
        />
      </div>
    </div>
  );
}
