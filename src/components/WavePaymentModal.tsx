import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Phone, 
  MessageCircle,
  Loader2
} from 'lucide-react';
import { DaloaService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Order, CartItem } from '../lib/types';
import { Logo } from './Logo';

interface WavePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderInfo?: {
    items: CartItem[];
    delivery_address: string;
    phone: string;
    customerName?: string;
  };
  onOrderConfirmed?: (order: Order) => void;
  existingOrderId?: string;
}

export const WavePaymentModal: React.FC<WavePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderInfo,
  onOrderConfirmed,
  existingOrderId,
}) => {
  const { currentUser } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const { showToast } = useToast();

  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedOrder, setSavedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const waveMerchantNumber = '0596367219';
  const merchantName = 'DALOA MARKET';

  // 1. Bouton vert "Ouvrir mon appli Wave"
  const handleOpenWaveApp = () => {
    const deepLink = `wave://transfer?phone=2250596367219&amount=${amount}`;
    const fallbackWhatsApp = `https://wa.me/2250596367219?text=${encodeURIComponent(
      `Bonjour DALOA MARKET, je veux payer ${amount} FCFA`
    )}`;

    try {
      window.location.href = deepLink;
    } catch (e) {
      console.log('Deep link error:', e);
    }

    // Fallback if not opened or supported
    const fallbackTimer = setTimeout(() => {
      try {
        window.open(fallbackWhatsApp, '_blank');
      } catch (err) {
        console.log('Window open error:', err);
      }
    }, 1200);

    showToast(`Ouverture de Wave pour le paiement de ${amount.toLocaleString('fr-FR')} FCFA...`, 'info');
  };

  // 2. Bouton gris "J'ai payé, confirmer ma commande"
  const handleConfirmPaid = async () => {
    setSubmitting(true);
    try {
      const itemsToOrder = orderInfo?.items && orderInfo.items.length > 0 
        ? orderInfo.items 
        : cartItems;

      const deliveryAddress = orderInfo?.delivery_address || 'Quartier Daloa Centre (à préciser au livreur)';
      const customerPhone = orderInfo?.phone || currentUser?.phone || '0596367219';
      const userId = currentUser ? currentUser.id : 'guest-' + Date.now();

      // Enregistre dans Supabase table commandes / orders avec statut "en_attente"
      const { order, error } = await DaloaService.createOrder({
        user_id: userId,
        items: itemsToOrder,
        delivery_address: deliveryAddress,
        phone: customerPhone,
        customer_name: orderInfo?.customerName || currentUser?.full_name || 'Client Daloa',
        info_supplementaire: `Paiement Wave vérifié sur 0596367219 - Réf: ${transactionId || 'Non précisé'}`,
        payment_method: 'wave',
        wave_transaction_id: transactionId || 'WV-CONFIRMED-' + Date.now(),
        status: 'en_attente',
      });

      if (error || !order) {
        showToast(error || 'Erreur lors de la validation.', 'error');
        setSubmitting(false);
        return;
      }

      setSavedOrder(order);
      setIsSuccess(true);
      clearCart();
      if (onOrderConfirmed) {
        onOrderConfirmed(order);
      }
    } catch (err) {
      console.error('Order save error:', err);
      showToast('Erreur lors de l\'enregistrement de la commande.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(waveMerchantNumber);
    setCopied(true);
    showToast('Numéro 0596367219 copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in"
      onClick={(e) => {
        // Only close if clicking backdrop and not currently submitting
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-sky-100 relative my-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon (doesn't reload, stays on site) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Logo size="md" />
        </div>

        {/* ================================================================ */}
        {/* SUCCESS STATE */}
        {/* ================================================================ */}
        {isSuccess ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5D2E] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <h3 className="font-black text-base sm:text-lg text-[#0F5D2E] mb-1">
                Commande validée avec succès !
              </h3>
              <p className="text-xs sm:text-sm font-bold text-emerald-900 leading-snug">
                Merci ! Nous vérifions votre paiement sur 0596367219 et nous vous livrons.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Statut :</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  en_attente de vérification
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Numéro Wave vérifié :</span>
                <span className="font-mono font-bold text-gray-900">{waveMerchantNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Montant :</span>
                <span className="font-black text-[#1DCBF7]">{amount.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Réf. transaction :</span>
                  <span className="font-mono font-semibold text-gray-800">{transactionId}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={`https://wa.me/2250596367219?text=${encodeURIComponent(
                  `Bonjour DALOA MARKET, j'ai validé mon paiement Wave pour la commande de ${amount} FCFA au 0596367219.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Confirmer sur WhatsApp (0596367219)</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Fermer et continuer
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* POPUP FORM STATE */
          /* ================================================================ */
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="text-center pb-2 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DCBF7]/15 text-[#0284c7] text-[11px] font-black uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#1DCBF7] animate-pulse" />
                Paiement WAVE Côte d'Ivoire
              </span>
              <h2 className="text-lg sm:text-xl font-black text-gray-900">
                Paiement de votre commande
              </h2>
            </div>

            {/* Informations requises dans la popup */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-2.5 text-xs">
              
              {/* 1. Montant à payer */}
              <div className="flex items-center justify-between pb-2 border-b border-sky-100">
                <span className="text-gray-600 font-medium">Montant à payer :</span>
                <span className="text-lg font-black text-[#FF6B00]">
                  {amount.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {/* 2. Numéro Wave marchand */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Numéro Wave marchand :</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-sm text-gray-900 bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                    {waveMerchantNumber}
                  </span>
                  <button
                    onClick={handleCopyNumber}
                    className="p-1 text-[#0284c7] hover:bg-sky-100 rounded-md transition cursor-pointer"
                    title="Copier le numéro"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 3. Nom : DALOA MARKET */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Nom :</span>
                <span className="font-extrabold text-[#0F5D2E]">
                  {merchantName}
                </span>
              </div>

            </div>

            {/* Bouton VERT : "Ouvrir mon appli Wave" */}
            <button
              onClick={handleOpenWaveApp}
              className="w-full py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ExternalLink className="w-4 h-4 text-white" />
              <span>Ouvrir mon appli Wave</span>
            </button>

            {/* Saisie facultative ID Transaction Wave */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                ID de transaction Wave (facultatif / SMS reçu) :
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Ex: WV-829104 ou collez le SMS"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-gray-200 focus:border-[#1DCBF7] outline-hidden bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Bouton GRIS : "J'ai payé, confirmer ma commande" */}
            <button
              onClick={handleConfirmPaid}
              disabled={submitting}
              className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Enregistrement en cours...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>J'ai payé, confirmer ma commande</span>
                </>
              )}
            </button>

            {/* Notice de sécurité */}
            <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F5D2E]" />
              Paiement direct et sécurisé vers le compte Wave officiel 0596367219
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
