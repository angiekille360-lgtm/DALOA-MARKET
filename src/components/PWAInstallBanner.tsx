import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { Logo } from './Logo';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const isOnline = useOnlineStatus();

  // If running installed or user dismissed it
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Offline Status Top Bar if offline */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Mode hors-ligne activé. Les données du catalogue local restent accessibles.</span>
          </div>
        </div>
      )}

      {/* Mobile-first Install Promotion Bar (Jumia style) */}
      {(isInstallable || isIOS) && (
        <div className="bg-gradient-to-r from-[#0F5D2E] to-[#147a3e] text-white px-3 py-2 text-xs flex items-center justify-between border-b border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <Logo size="sm" variant="icon" />
            <div>
              <p className="font-bold text-white">Installez l'application DALOA MARKET</p>
              <p className="text-white/80 text-[10px]">Accès rapide & commandes sans rechargement</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isInstallable && (
              <button
                onClick={install}
                className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-3 py-1 rounded-md font-semibold text-xs transition shadow-sm flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Installer
              </button>
            )}
            {isIOS && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="bg-[#FF6B00] hover:bg-[#e05e00] text-white px-3 py-1 rounded-md font-semibold text-xs transition shadow-sm flex items-center gap-1"
              >
                <Share className="w-3.5 h-3.5" />
                Installer (iPhone)
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-white/60 hover:text-white p-1"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Logo size="sm" variant="icon" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Installer sur iPhone / iPad</h3>
                  <p className="text-xs text-gray-500">Ajouter à l'écran d'accueil</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ol className="space-y-3.5 text-xs text-gray-700 my-4">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-[#0F5D2E] font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <div>
                  Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-sky-600 mx-1" /> dans la barre inférieure de Safari.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-[#0F5D2E] font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <div>
                  Faites défiler vers le bas et sélectionnez <strong>Sur l'écran d'accueil</strong> <PlusSquare className="w-3.5 h-3.5 inline text-gray-700 mx-1" />.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-[#0F5D2E] font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <div>
                  Touchez <strong>Ajouter</strong> en haut à droite. Retrouvez DALOA MARKET instantanément comme une app native !
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-medium rounded-xl text-xs transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
