import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard,
  QrCode,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { DaloaService } from '../lib/supabase';
import { WavePaymentModal } from '../components/WavePaymentModal';

interface WavePaymentPageProps {
  onNavigate: (view: string, param?: string) => void;
  orderIdParam?: string;
}

export const WavePaymentPage: React.FC<WavePaymentPageProps> = ({ onNavigate, orderIdParam }) => {
  const { totalPrice, items: cartItems } = useCart();
  const { showToast } = useToast();

  const waveMerchantNumber = '0596367219';

  // Amount defaults to cart total + 1000 delivery, or param/custom
  const defaultAmount = totalPrice > 0 ? totalPrice + 1000 : 25000;
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [transactionId, setTransactionId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(orderIdParam || 'CMD-' + Math.floor(1000 + Math.random() * 9000));
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If URL has query params like ?amount= or ?orderId=
    const params = new URLSearchParams(window.location.search);
    const qAmount = params.get('amount');
    const qOrder = params.get('orderId');
    if (qAmount && !isNaN(Number(qAmount))) {
      setAmount(Number(qAmount));
    }
    if (qOrder) {
      setOrderId(qOrder);
    }
  }, []);

  const waveWebUrl = `https://pay.wave.com/m/M_CI_0596367219?amount=${amount}&currency=XOF`;
  const waveDeepLink = `wave://transfer?phone=2250596367219&amount=${amount}`;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(waveMerchantNumber);
    setCopiedNumber(true);
    showToast('Numéro marchand Wave 0596367219 copié !', 'success');
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleTriggerWavePayment = () => {
    // NE FERME PAS LA PAGE. Ouvre la fenêtre modale (popup) qui reste sur le site.
    setIsModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!transactionId.trim()) {
      showToast('Veuillez entrer votre ID de transaction Wave ou référence du SMS reçu.', 'error');
      return;
    }

    setConfirmed(true);
    showToast(`Paiement Wave enregistré avec succès pour la commande #${orderId} !`, 'success');
  };

  // SUCCESS CONFIRMATION SCREEN
  if (confirmed) {
    const waText = encodeURIComponent(
      `Bonjour DALOA MARKET ! J'ai effectué mon paiement WAVE pour la commande #${orderId}.\n` +
      `Montant : ${amount.toLocaleString('fr-FR')} FCFA versé au 0596367219\n` +
      `ID de transaction Wave : ${transactionId}\n` +
      `Merci de confirmer la prise en charge de ma livraison.`
    );

    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl border border-sky-200 p-6 sm:p-10 shadow-xl text-center animate-in zoom-in">
          
          <div className="flex justify-center mb-4">
            <Logo size="lg" onClick={() => onNavigate('home')} />
          </div>

          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5D2E] flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-black text-[#1DCBF7] bg-sky-50 border border-sky-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Paiement Wave Enregistré
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-3 mb-1">
            Paiement Reçu pour #{orderId}
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Votre versement de <strong>{amount.toLocaleString('fr-FR')} FCFA</strong> au compte marchand Wave <strong>{waveMerchantNumber}</strong> a été validé.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2 text-xs mb-6 border border-gray-100">
            <div className="flex justify-between pb-2 border-b border-gray-200">
              <span className="text-gray-500">Montant payé :</span>
              <span className="font-black text-[#1DCBF7] text-sm">
                {amount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bénéficiaire :</span>
              <span className="font-bold text-gray-900">DALOA MARKET (0596367219)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">ID Transaction Wave :</span>
              <span className="font-mono font-bold text-emerald-800">{transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Statut :</span>
              <span className="font-bold text-emerald-700">En cours de préparation pour livraison 24h</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/2250596367219?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Notifier le Service Client sur WhatsApp (0596367219)</span>
            </a>

            <button
              onClick={() => onNavigate('my-orders')}
              className="w-full py-2.5 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Voir mes commandes
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full py-2 text-xs text-gray-500 hover:text-gray-900 font-medium cursor-pointer"
            >
              Retour au catalogue DALOA MARKET
            </button>
          </div>

        </div>
      </div>
    );
  }

  // MAIN WAVE PAYMENT PAGE
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0F5D2E] mb-4 p-1 -ml-1 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour aux achats</span>
      </button>

      <div className="bg-white rounded-3xl border border-sky-200 shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0F5D2E] via-[#094520] to-[#1DCBF7] p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <div className="bg-white p-2 rounded-2xl shadow-sm">
              <Logo size="md" onClick={() => onNavigate('home')} />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-black uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-[#1DCBF7]" />
            Passerelle Officielle Wave Côte d'Ivoire
          </span>
          <h1 className="text-xl sm:text-2xl font-black">
            Paiement Sécurisé WAVE
          </h1>
          <p className="text-xs text-white/90 mt-1 max-w-md mx-auto">
            Payez facilement et sans aucun frais vers le compte marchand officiel de DALOA MARKET.
          </p>
        </div>

        {/* Payment Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Card: Numéro Marchand Wave Officiel */}
          <div className="bg-sky-50/70 border-2 border-[#1DCBF7] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#1DCBF7] text-gray-950 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                W
              </div>
              <div>
                <p className="text-xs text-sky-900 font-bold uppercase tracking-wide">
                  Numéro Marchand Officiel Wave :
                </p>
                <div className="text-2xl sm:text-3xl font-black font-mono text-gray-900 tracking-wider">
                  {waveMerchantNumber}
                </div>
                <p className="text-[11px] text-gray-500">
                  Titulaire du compte : <strong>DALOA MARKET SARL</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyNumber}
              className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-sky-100 text-[#0284c7] font-bold text-xs rounded-xl border border-sky-200 transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedNumber ? 'Numéro Copié !' : 'Copier le numéro'}</span>
            </button>
          </div>

          {/* Amount Display & Adjustment */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-gray-700 block">
                  Montant à régler en FCFA :
                </label>
                <span className="text-[10px] text-gray-400">
                  Référence : Commande #{orderId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#FF6B00]">
                  {amount.toLocaleString('fr-FR')} <span className="text-base font-bold">FCFA</span>
                </span>
              </div>
            </div>

            {/* Micro input to edit amount if needed */}
            <div className="pt-2 border-t border-gray-200/80 flex items-center gap-2">
              <span className="text-[11px] text-gray-500 font-medium">Modifier le montant :</span>
              <input
                type="number"
                min="100"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Math.max(100, Number(e.target.value)))}
                className="w-32 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-gray-200 bg-white focus:border-[#1DCBF7] outline-hidden"
              />
              <span className="text-[11px] font-bold text-gray-600">FCFA</span>
            </div>
          </div>

          {/* Prompt Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-950 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900">Instruction importante :</p>
              <p className="mt-0.5 text-xs text-sky-900">
                Ouvrez votre appli Wave et confirmez le paiement de <strong className="text-[#0284c7] font-black">{amount.toLocaleString('fr-FR')} FCFA</strong> au <strong className="font-mono text-gray-900 font-black">{waveMerchantNumber}</strong>.
              </p>
            </div>
          </div>

          {/* Action Button: "Payer avec Wave" in Wave Blue #1DCBF7 */}
          <div className="space-y-3">
            <button
              onClick={handleTriggerWavePayment}
              className="btn-wave-ultra w-full py-4 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-5 h-5 text-white" />
              <span>Payer avec Wave 0596367219 ({amount.toLocaleString('fr-FR')} FCFA)</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2 px-1">
              <span>Votre appli Wave ne s'ouvre pas automatiquement ?</span>
              <a
                href={waveWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0284c7] hover:underline font-bold flex items-center gap-1"
              >
                <span>Lien direct web Wave</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Saisie pour l'ID de transaction Wave */}
          <div className="pt-6 border-t border-gray-100 space-y-3">
            <label className="block text-xs font-black text-gray-900">
              Zone de saisie de l'ID de transaction Wave :
            </label>
            <div className="relative">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Ex: WV-928401 ou collez le code SMS Wave reçu"
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-[#1DCBF7] focus:ring-2 focus:ring-[#1DCBF7]/20 outline-hidden font-mono"
              />
            </div>
            <p className="text-[11px] text-gray-500">
              Après confirmation sur votre téléphone, saisissez le numéro de transaction ou l'identifiant Wave pour validation instantanée de votre commande.
            </p>

            {/* Confirm Paid Button */}
            <button
              onClick={handleConfirmPayment}
              className="w-full py-3.5 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Valider mon paiement Wave</span>
            </button>
          </div>

          {/* Assistance & Contacts */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Support & Service Client Daloa :</span>
              <a href="tel:0596367219" className="font-bold text-[#0F5D2E] hover:underline">
                0596367219
              </a>
            </div>

            <a
              href={`https://wa.me/2250596367219?text=${encodeURIComponent(`Bonjour, j'ai une question sur mon paiement Wave au 0596367219 pour la commande #${orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-bold"
            >
              <MessageCircle className="w-4 h-4 fill-[#25D366] text-white" />
              <span>Assistance WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

      {/* Wave Payment Modal (reste sur le site, ne ferme pas l'app) */}
      <WavePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amount={amount}
        orderInfo={{
          items: cartItems,
          delivery_address: 'Quartier Daloa Centre',
          phone: '0596367219',
          customerName: 'Client Wave Daloa',
        }}
        onOrderConfirmed={() => setConfirmed(true)}
      />

    </div>
  );
};
