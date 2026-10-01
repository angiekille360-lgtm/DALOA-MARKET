import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const deliveryFee = items.length > 0 ? 1000 : 0; // 1 000 FCFA standard delivery in Daloa
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Découvrez nos articles en promotion livrables partout à Daloa en 24h.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="py-3 px-6 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            Commencer mes achats à Daloa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">
        Mon Panier ({totalItems} {totalItems > 1 ? 'articles' : 'article'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const img = product.image_url?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center gap-4 transition hover:border-gray-200"
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => onNavigate('product', product.id)}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                >
                  <img src={img} alt={product.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h3
                    onClick={() => onNavigate('product', product.id)}
                    className="text-xs sm:text-sm font-bold text-gray-900 truncate hover:text-[#0F5D2E] cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <div className="text-xs sm:text-sm font-extrabold text-[#FF6B00] mt-1">
                    {product.price.toLocaleString('fr-FR')} FCFA
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 py-1 font-bold text-gray-900 bg-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right shrink-0 hidden sm:block">
                  <span className="text-xs text-gray-400 block">Total</span>
                  <span className="text-sm font-black text-gray-900">
                    {(product.price * quantity).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Récapitulatif de commande
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-semibold text-gray-900">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison standard Daloa :</span>
                <span className="font-semibold text-emerald-700">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm sm:text-base font-black text-gray-900">
                <span>Total à régler :</span>
                <span className="text-[#FF6B00]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 bg-[#1DCBF7] hover:bg-[#0eb7e3] text-gray-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer mb-3 active:scale-98"
            >
              <span>Commander avec Wave</span>
              <ArrowRight className="w-4 h-4 text-gray-950" />
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition"
            >
              Continuer mes achats
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#0F5D2E]" />
                <span>Livraison sous 24h à domicile à Daloa</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1DCBF7]" />
                <span className="font-bold text-sky-900">Paiement 100% sécurisé WAVE : 0596367219</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
