import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/2250596367219?text=Bonjour%20Daloa%20Market"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter Daloa Market sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white/20"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <MessageCircle className="w-5 h-5 fill-white text-[#25D366] shrink-0" />
      <span className="text-xs font-black tracking-wide hidden sm:inline-block">
        WhatsApp : 0596367219
      </span>
      <span className="text-xs font-black tracking-wide sm:hidden">
        0596367219
      </span>
    </a>
  );
};
