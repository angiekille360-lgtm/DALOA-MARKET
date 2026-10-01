import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Zap, 
  Share2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Check, 
  UserCircle2,
  Clock
} from 'lucide-react';
import { Product } from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { WavePaymentModal } from '../components/WavePaymentModal';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await DaloaService.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-md w-1/3 animate-pulse" />
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Produit non trouvé</h2>
        <p className="text-xs text-gray-500 mb-4">Cet article n'existe plus ou a été retiré du catalogue.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-[#0F5D2E] text-white rounded-xl text-xs font-semibold"
        >
          Retour aux articles
        </button>
      </div>
    );
  }

  const images = product.image_url?.length > 0 ? product.image_url : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Regarde ce produit sur DALOA MARKET :\n*${product.name}*\nPrix : ${product.price.toLocaleString('fr-FR')} FCFA\nDispo à Daloa avec livraison rapide !`
    );
    const link = document.createElement('a');
    link.href = `https://wa.me/?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOrderNow = () => {
    // NE FERME PAS LA PAGE. Ouvre la popup modale de paiement Wave sur le site.
    setIsWaveModalOpen(true);
  };

  const vendorName = product.profiles?.full_name || 'Commerçant Daloa Market';
  const vendorPhone = '0596367219';

  return (
    <div className="max-w-5xl mx-auto pb-16">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-[#0F5D2E] mb-4 p-1 -ml-1 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux produits</span>
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Images Section */}
          <div className="space-y-3">
            {/* Main Big Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>Disponible à Daloa</span>
              </div>
            </div>

            {/* Thumbnails if multiple images */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                      selectedImageIndex === idx ? 'border-[#FF6B00] ring-2 ring-[#FF6B00]/20' : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Section */}
          <div className="flex flex-col">
            
            {/* Category & Status */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-semibold text-emerald-800">{product.category}</span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium text-[11px]">
                <Check className="w-3 h-3" /> En stock ({product.stock} dispo)
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price Badge */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-sky-900 font-bold block">Prix direct Daloa :</span>
                <span className="text-[10px] font-black bg-[#1DCBF7] text-gray-950 px-2 py-0.5 rounded-full">
                  Paiement WAVE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B00]">
                {product.price.toLocaleString('fr-FR')} <span className="text-base sm:text-xl font-bold">FCFA</span>
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Paiement direct et sécurisé par <strong className="text-[#0284c7]">WAVE Côte d'Ivoire</strong> au numéro <strong className="font-mono text-gray-900">0596367219</strong>.
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5">
                Description de l'article
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description || 'Aucune description détaillée fournie.'}
              </p>
            </div>

            {/* Vendor Profile Info Box */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#0F5D2E] flex items-center justify-center font-bold text-sm">
                    {vendorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{vendorName}</h4>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Service Client / Support : 0596367219
                    </p>
                  </div>
                </div>
                <a
                  href="tel:0596367219"
                  className="p-2 bg-white rounded-xl border border-gray-200 text-[#0F5D2E] hover:bg-emerald-50 shadow-xs"
                  title="Appeler le Service Client"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-gray-700">Quantité :</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-gray-900 bg-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Call to Actions (Payer avec Wave in Blue #1DCBF7 & Add to cart & WhatsApp share) */}
            <div className="space-y-3 mt-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOrderNow}
                  className="btn-wave-ultra w-full py-3.5 px-4 rounded-xl text-white font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Payer avec Wave 0596367219</span>
                </button>

                <button
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    addToCart(product, quantity, { x: rect.left + rect.width / 2, y: rect.top });
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#0F5D2E] border border-emerald-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au panier</span>
                </button>
              </div>

              {/* Share on WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs border border-[#25D366]/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Partager sur WhatsApp (0596367219)</span>
              </button>
            </div>

            {/* Delivery Assurance */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-500">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Livraison garantie sous 24h ouvrées dans tous les quartiers de Daloa.</span>
            </div>

          </div>

        </div>
      </div>

      {/* Wave Payment Modal (reste sur le site, ne ferme pas l'app) */}
      <WavePaymentModal
        isOpen={isWaveModalOpen}
        onClose={() => setIsWaveModalOpen(false)}
        amount={product.price * quantity + 1000}
        orderInfo={{
          items: [{ product, quantity }],
          delivery_address: 'Quartier Daloa Centre (à préciser)',
          phone: '0596367219',
          customerName: 'Client Wave Daloa',
        }}
      />

    </div>
  );
};
