import React from 'react';
import { ShoppingBag, Eye, MapPin, Check } from 'lucide-react';
import { Product } from '../lib/types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item.product.id === product.id);

  const mainImage = product.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Product Image Container */}
      <div 
        onClick={() => onSelect(product.id)}
        className="relative aspect-square w-full bg-gray-100 overflow-hidden cursor-pointer"
      >
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Location tag on image */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          <MapPin className="w-3 h-3 text-[#FF6B00]" />
          <span>Daloa</span>
        </div>

        {/* Quick view button hover */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product.id);
          }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-white/90 text-gray-700 hover:text-[#0F5D2E] shadow-sm transition-all duration-150"
          title="Voir détails"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Category metadata - clean typography, no pills */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="font-medium text-emerald-800">{product.category}</span>
          <span className="text-[10px] text-gray-400">Stock: {product.stock}</span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onSelect(product.id)}
          className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 hover:text-[#0F5D2E] cursor-pointer transition mb-2 min-h-[32px] sm:min-h-[40px]"
        >
          {product.name}
        </h3>

        {/* Price & Vendor */}
        <div className="mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-sm sm:text-base font-extrabold text-[#FF6B00]">
                {product.price.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              addToCart(product, 1, { x: rect.left + rect.width / 2, y: rect.top });
            }}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95 ${
              isInCart
                ? 'bg-emerald-50 text-[#0F5D2E] border border-emerald-300 hover:bg-emerald-100'
                : 'bg-[#FF6B00] hover:bg-[#0F5D2E] text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-[#0F5D2E]" />
                <span>Ajouté (+1)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Ajouter au panier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
