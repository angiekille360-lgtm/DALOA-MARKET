import React, { useState } from 'react';
import { Database, Check, Copy, X, ExternalLink, RotateCcw } from 'lucide-react';
import { isRealSupabaseConfigured, DaloaService } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const sqlSchema = `-- ==============================================================================
-- DALOA MARKET - TABLES SUPABASE PROPRES (CLIENTS & COMMANDES WAVE)
-- Copiez ce script et exécutez-le dans Supabase > SQL Editor
-- ==============================================================================

-- Supprime les anciennes tables pour repartir propre
drop table if exists commandes;
drop table if exists clients;

-- Table 1: Tous ceux qui s'inscrivent
create table clients (
  id uuid default gen_random_uuid() primary key,
  nom text,
  telephone text,
  email text,
  marque_telephone text,
  modele_telephone text,
  navigateur text,
  created_at timestamp default now()
);

-- Table 2: Toutes les ventes avec les infos que tu veux
create table commandes (
  id uuid default gen_random_uuid() primary key,
  nom_client text,
  numero_client text,
  marque_telephone text,
  produits_achetes jsonb,
  quantite integer,
  prix_total integer,
  adresse_livraison text,
  info_supplementaire text,
  transaction_wave text,
  statut text default 'Payé - à livrer sur 0596367219',
  created_at timestamp default now()
);

-- Active la sécurité pour que tu puisses tout voir
alter table clients enable row level security;
alter table commandes enable row level security;
create policy "tout voir" on clients for all using (true) with check (true);
create policy "tout voir" on commandes for all using (true) with check (true);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    showToast('Script SQL copié dans le presse-papier !', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous réinitialiser le catalogue et les commandes par défaut de Daloa Market ?')) {
      DaloaService.resetDemoData();
      showToast('Données démo réinitialisées.', 'info');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#0F5D2E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                Base de données Supabase & RLS
              </h3>
              <p className="text-xs text-gray-500">
                Statut et schéma SQL officiel pour Daloa Market
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Status box */}
          <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-bold text-[#0F5D2E]">
                  {isRealSupabaseConfigured ? 'Connecté à votre Supabase distant' : 'Mode Intégré Actif (Prêt pour Supabase)'}
                </span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                {isRealSupabaseConfigured 
                  ? 'Les données se synchronisent avec votre projet cloud Supabase.'
                  : 'L\'application fonctionne avec le stockage local persistant avec simulation RLS complète.'}
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-xs"
              title="Réinitialiser les 6 produits approuvés et les utilisateurs test"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Démo
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-800">
                Script SQL prêt à coller dans Supabase (Tables + RLS) :
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-[#0F5D2E] hover:bg-[#0c4723] text-white px-3 py-1.5 rounded-lg font-medium transition shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier le SQL'}
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
              {sqlSchema}
            </pre>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-orange-900 text-[11px]">
            <p className="font-bold mb-1">🔑 Compte Administrateur pré-configuré :</p>
            <p>Email : <code className="bg-orange-100 px-1 rounded font-bold">admin@daloamarket.ci</code></p>
            <p>Mot de passe : <code className="bg-orange-100 px-1 rounded font-bold">Admin123!</code></p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-semibold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
