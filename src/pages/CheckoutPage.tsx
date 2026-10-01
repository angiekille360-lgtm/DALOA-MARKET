import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Truck,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DALOA_QUARTIERS } from '../lib/mockData';
import { Logo } from '../components/Logo';
import { WavePaymentModal } from '../components/WavePaymentModal';
import { Order } from '../lib/types';

interface CheckoutPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, totalPrice } = useCart();
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [quartier, setQuartier] = useState(DALOA_QUARTIERS[0]);
  const [addressDetails, setAddressDetails] = useState('');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [customerName, setCustomerName] = useState(currentUser?.full_name || '');
  
  // Wave Modal state (RESTE SUR LE SITE, NE FERME PAS L'APP)
  const [isWaveModalOpen, setIsWaveModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const deliveryFee = 1000;
  const finalTotal = totalPrice + deliveryFee;
  const waveMerchantNumber = '0596367219';

  // Ouvre la MODALE POPUP SANS FERMER LA PAGE
  const handleOpenWaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Votre panier est vide.', 'error');
      onNavigate('home');
      return;
    }

    if (!phone || !customerName) {
      showToast('Veuillez renseigner votre nom et votre numéro de téléphone.', 'error');
      return;
    }

    // Ouvre la modale sans recharger ni fermer l'application
    setIsWaveModalOpen(true);
  };

  const handleOrderConfirmed = (order: Order) => {
    setConfirmedOrder(order);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      
      {/* Header with Logo */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Commander sur DALOA MARKET
          </h1>
          <p className="text-xs text-gray-500">
            Livraison rapide à Daloa · Paiement sécurisé exclusivement par WAVE au 0596367219
          </p>
        </div>
        <Logo size="md" onClick={() => onNavigate('home')} />
      </div>

      <form onSubmit={handleOpenWaveModal} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Informations de contact */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0F5D2E]" />
              <span>1. Coordonnées de contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom et Prénoms *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Jean Kouamé"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#1DCBF7] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0596367219"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#1DCBF7] outline-hidden"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Le livreur vous contactera sur ce numéro à Daloa.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Adresse de livraison Daloa */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF6B00]" />
              <span>2. Adresse de livraison à Daloa</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Quartier de Daloa *
                </label>
                <select
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#1DCBF7] outline-hidden bg-white font-medium"
                >
                  {DALOA_QUARTIERS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Précisions adresse / Repère géographique
                </label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="Ex: Face à la pharmacie, Villa rouge près du maquis, Rue 12..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#1DCBF7] outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Mode de paiement UNIQUE WAVE */}
          <div className="bg-white rounded-3xl border-2 border-[#1DCBF7] p-5 sm:p-6 shadow-md bg-gradient-to-br from-sky-50/50 to-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1DCBF7]" />
                <span>3. Mode de Paiement : WAVE Côte d'Ivoire</span>
              </h3>
              <span className="text-[11px] font-black text-white bg-[#1DCBF7] px-2.5 py-0.5 rounded-full">
                WAVE SEUL
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-sky-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-900">Numéro Wave Marchand :</span>
                  <div className="text-xl font-black text-[#0284c7] font-mono tracking-wider">
                    {waveMerchantNumber}
                  </div>
                  <span className="text-[11px] text-gray-500 font-semibold">Nom : DALOA MARKET</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#1DCBF7] flex items-center justify-center font-black text-white text-xl shadow-xs">
                  W
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1">
                <p>✓ Au clic sur "Payer avec Wave", une fenêtre pop-up s'ouvre sur le site.</p>
                <p>✓ Votre page ne se fermera pas et vous pourrez confirmer votre commande.</p>
                <p>✓ Assistance Wave : <strong>0596367219</strong></p>
              </div>
            </div>
          </div>

        </div>

        {/* Order Summary & Submit Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Articles commandés ({items.length})
            </h3>

            {/* Micro items list */}
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-[10px] text-gray-500">Qté: {quantity}</p>
                  </div>
                  <span className="font-bold text-gray-800 shrink-0">
                    {(product.price * quantity).toLocaleString('fr-FR')} F
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Sous-total :</span>
                <span className="font-bold text-gray-900">{totalPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison Daloa :</span>
                <span className="font-bold text-emerald-700">{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-black text-gray-900">
                <span>Total à régler :</span>
                <span className="text-[#1DCBF7]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {/* BOUTON PAYER AVEC WAVE ULTRA STYLÉ (DÉGRADÉ ANIMÉ, OMBRE QUI PULSE, SCALE 1.05) */}
            <button
              type="submit"
              className="btn-wave-ultra w-full py-4 text-white font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-xl tracking-wide"
            >
              <span>Payer avec Wave 0596367219</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-sky-900 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1DCBF7]" />
                <span>Paiement sécurisé au 0596367219</span>
              </div>
              <p className="text-[10px] text-gray-400">
                La fenêtre de paiement s'ouvre dans une popup sans fermer l'application.
              </p>
            </div>
          </div>
        </div>

      </form>

      {/* ==================================================================== */}
      {/* POPUP MODALE WAVE (RESTE SUR LE SITE, NE FERME PAS L'APP) */}
      {/* ==================================================================== */}
      <WavePaymentModal
        isOpen={isWaveModalOpen}
        onClose={() => setIsWaveModalOpen(false)}
        amount={finalTotal}
        orderInfo={{
          items,
          delivery_address: `${quartier}, ${addressDetails ? addressDetails : 'Près du repère principal'}`,
          phone,
          customerName,
        }}
        onOrderConfirmed={handleOrderConfirmed}
      />

    </div>
  );
};
