import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Shirt, 
  UtensilsCrossed, 
  Home as HomeIcon, 
  Car, 
  Wrench, 
  Truck, 
  Clock, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Product, ProductCategory } from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_CATEGORIES } from '../lib/mockData';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await DaloaService.getProducts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        status: 'approved',
      });
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Shirt': return <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Home': return <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Car': return <Car className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Wrench': return <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />;
      default: return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* Promo Hero Banner (Jumia Côte d'Ivoire vibe: Green #0F5D2E & Orange #FF6B00) */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0F5D2E] via-[#094520] to-[#FF6B00] text-white p-5 sm:p-8 shadow-md">
        {/* Decorative elements */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-[#FF6B00]/20 blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-[11px] font-bold mb-3 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
            Livraison Express 24h à Daloa
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight sm:leading-snug mb-2">
            La Marketplace <span className="text-[#FF842B]">#1</span> de Daloa
          </h1>

          <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-5 max-w-lg">
            Achetez directement chez les commerçants du Grand Marché, Kennedy, Tazibouo et Lobia. Paiement direct et 100% sécurisé par <strong className="text-[#1DCBF7]">WAVE Côte d'Ivoire (0596367219)</strong> !
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Découvrir les offres</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('sell')}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Vendre mes articles</span>
            </button>
          </div>
        </div>

        {/* Micro highlights row on banner */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="truncate">Livraison en 24h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1DCBF7] shrink-0" />
            <span className="truncate font-bold text-[#1DCBF7]">Paiement 100% WAVE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-300 shrink-0" />
            <span className="truncate">Prix direct Daloa</span>
          </div>
        </div>
      </section>

      {/* Categories Grid with Icons */}
      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Catégories à Daloa
            </h2>
            <p className="text-xs text-gray-500">
              Explorez par rayon d'activité
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#FF6B00] font-semibold hover:underline cursor-pointer"
            >
              Voir tout
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {INITIAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.name)}
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-[#0F5D2E] text-[#0F5D2E] shadow-sm ring-1 ring-[#0F5D2E]'
                    : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700 hover:bg-gray-50/80 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-2 transition ${
                    isSelected
                      ? 'bg-[#0F5D2E] text-white'
                      : 'bg-emerald-50 text-[#0F5D2E] group-hover:scale-105'
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-[11px] sm:text-xs font-semibold line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Catalog Section / Produits Récents */}
      <section id="catalog-section" className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-xl font-extrabold text-gray-900">
                {selectedCategory === 'all' ? 'Produits récents' : `Rayon : ${selectedCategory}`}
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                ({products.length} {products.length > 1 ? 'articles' : 'article'})
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Articles vérifiés et disponibles immédiatement à Daloa
            </p>
          </div>

          {/* Quick Filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
                  selectedCategory === cat.name
                    ? 'bg-[#0F5D2E] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse space-y-3">
                <div className="aspect-square bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-1/2" />
                <div className="h-8 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center max-w-md mx-auto my-6 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
              Aucun produit trouvé
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}". Essayez un autre mot-clé.`
                : 'Aucun article actuellement disponible dans cette catégorie.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#0F5D2E] text-white rounded-xl text-xs font-semibold hover:bg-[#0c4723]"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onNavigate('product', id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Daloa Market Local Vendor CTA */}
      <section className="bg-emerald-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-xl font-bold">
            Vous êtes commerçant ou producteur à Daloa ?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-lg">
            Créez votre boutique gratuitement en 2 minutes. Vos produits seront visibles par des milliers de clients partout à Daloa.
          </p>
        </div>
        <button
          onClick={() => onNavigate('sell')}
          className="bg-[#FF6B00] hover:bg-[#e05e00] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl transition shadow-md shrink-0 cursor-pointer"
        >
          Commencer à vendre gratuitement
        </button>
      </section>

    </div>
  );
};
