import React from 'react';
import confetti from 'canvas-confetti';
import { Check, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../lib/types';

/**
 * Fires a festive confetti burst with Daloa Market & Wave colors
 */
export function fireAddToCartConfetti(eventOrOrigin?: { x?: number; y?: number }) {
  // If coordinates provided, trigger from there, else from bottom or center
  const originX = eventOrOrigin?.x ? eventOrOrigin.x / window.innerWidth : 0.5;
  const originY = eventOrOrigin?.y ? eventOrOrigin.y / window.innerHeight : 0.7;

  // Primary burst: Daloa Green, Daloa Orange, Wave Cyan, Gold
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { x: originX, y: originY },
    colors: ['#0F5D2E', '#FF6B00', '#1DCBF7', '#FBBF24', '#22c55e'],
    disableForReducedMotion: true,
    zIndex: 9999,
  });

  // Secondary delayed stars burst for extra delight
  setTimeout(() => {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: Math.max(0.1, originX - 0.1), y: originY },
      colors: ['#1DCBF7', '#FF6B00', '#FFFFFF'],
      shapes: ['circle'],
      zIndex: 9999,
    });
  }, 120);
}

interface AddToCartCelebrationProps {
  lastAddedProduct: { product: Product; quantity: number } | null;
  onClose: () => void;
  onGoToCart: () => void;
}

export const AddToCartCelebration: React.FC<AddToCartCelebrationProps> = ({
  lastAddedProduct,
  onClose,
  onGoToCart,
}) => {
  if (!lastAddedProduct) return null;

  const { product, quantity } = lastAddedProduct;
  const image = product.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80';

  return (
    <aside 
      aria-label="Notification d'ajout au panier"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-500/30 p-3.5 sm:p-4 relative overflow-hidden backdrop-blur-md">
        
        {/* Top ambient color bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0F5D2E] via-[#FF6B00] to-[#1DCBF7]" />

        <div className="flex items-center gap-3">
          
          {/* Sautillante Bouncy Checkmark Icon */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0F5D2E] shadow-xs animate-bounce">
              <Check className="w-7 h-7 stroke-[3] text-[#0F5D2E]" />
            </div>
            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 p-0.5 bg-[#FF6B00] text-white rounded-full animate-ping">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
          </div>

          {/* Product thumbnail */}
          <img
            src={image}
            alt={product.name}
            className="w-11 h-11 rounded-lg object-cover border border-gray-100 shrink-0"
          />

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-[#0F5D2E] uppercase tracking-wide">
              <span>Ajouté au panier !</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DCBF7]" />
            </div>
            <p className="text-xs font-bold text-gray-900 truncate">
              {product.name}
            </p>
            <p className="text-[11px] font-semibold text-gray-500">
              {quantity > 1 ? `${quantity} exemplaires · ` : ''}
              <span className="text-[#FF6B00] font-black">
                {(product.price * quantity).toLocaleString('fr-FR')} FCFA
              </span>
            </p>
          </div>

          {/* Quick Cart Button */}
          <button
            onClick={() => {
              onClose();
              onGoToCart();
            }}
            className="shrink-0 p-2 sm:px-3 sm:py-2 bg-[#0F5D2E] hover:bg-[#0c4723] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
            title="Voir le panier"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Panier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
