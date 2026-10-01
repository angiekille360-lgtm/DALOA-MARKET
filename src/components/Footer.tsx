import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-24 sm:pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions Grid (Jumia style) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Livraison Daloa en 24h</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Tazibouo, Kennedy, Lobia, Marais, Soleil...</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-950 text-[#1DCBF7] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Paiement Sécurisé WAVE</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Wave CI officiel : 0596367219</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Vendeurs Vérifiés</h4>
              <p className="text-gray-400 text-[11px] mt-0.5">Commerçants réels du Grand Marché & Daloa</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-950 text-[#1DCBF7] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white text-xs sm:text-sm font-bold">Service Client WhatsApp / Appel</h4>
              <p className="text-[#1DCBF7] font-bold text-xs mt-0.5">0596367219</p>
            </div>
          </div>
        </div>

        {/* Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
          <div>
            <Logo size="md" className="brightness-110 mb-3 cursor-pointer" onClick={() => onNavigate?.('home')} />
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              DALOA MARKET est la plateforme locale de commerce électronique dédiée aux habitants et commerçants de la cité des Antilopes. Paiement direct et 100% sécurisé avec WAVE Côte d'Ivoire.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/2250596367219?text=Bonjour%20Daloa%20Market"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                Service Client WhatsApp : 0596367219
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Quartiers Desservis à Daloa
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <span>• Tazibouo (Univ.)</span>
              <span>• Rond-point Kennedy</span>
              <span>• Centre Commercial</span>
              <span>• Grand Marché</span>
              <span>• Huberson</span>
              <span>• Quartier Lobia</span>
              <span>• Quartier Marais</span>
              <span>• Belleville / Soleil</span>
              <span>• Gbeuliville</span>
              <span>• Abattoir / Balouzon</span>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Contacts & Service Client
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Rond-point Kennedy / Face Grand Marché, Daloa, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1DCBF7] shrink-0" />
                <a href="tel:0596367219" className="hover:text-white transition font-bold text-white">
                  Service Client WhatsApp / Appel : 0596367219
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>Lundi - Dimanche : 07h00 - 22h00</span>
              </li>
            </ul>

            {/* Payment Logos: ONLY WAVE */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-[11px] text-gray-400 mb-2 font-semibold">Moyen de paiement exclusif :</p>
              <div className="inline-flex items-center gap-2 bg-[#1DCBF7]/20 border border-[#1DCBF7] text-[#1DCBF7] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#1DCBF7] animate-pulse" />
                <span>WAVE CÔTE D'IVOIRE (0596367219)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-gray-800 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} DALOA MARKET. Fait avec <Heart className="w-3 h-3 text-[#FF6B00] inline mx-0.5 fill-[#FF6B00]" /> pour la ville de Daloa.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate?.('admin')} className="text-gray-500 hover:text-gray-300 text-[10px]">
              Espace Administrateur
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
