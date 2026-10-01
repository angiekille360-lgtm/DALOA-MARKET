import React, { useState } from 'react';
import { Mail, Lock, Phone, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onNavigate: (view: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onNavigate }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp, quickLoginAsAdmin } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const ok = await signIn(email, password);
        if (ok) {
          onNavigate('home');
        }
      } else {
        if (!fullName || !phone) {
          showToast('Veuillez remplir votre nom complet et numéro de téléphone.', 'error');
          setSubmitting(false);
          return;
        }
        const ok = await signUp({
          email,
          password,
          full_name: fullName,
          phone,
          role,
        });
        if (ok) {
          onNavigate('home');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickAccount = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    showToast(`Identifiants pour ${quickEmail} renseignés. Cliquez sur Se connecter.`, 'info');
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-12 px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8">
        
        {/* Top Logo & Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="lg" onClick={() => onNavigate('home')} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {mode === 'login' ? 'Connexion à Daloa Market' : 'Créer un compte'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Accédez à vos commandes et vos annonces à Daloa'
              : 'Rejoignez la communauté des acheteurs et vendeurs de Daloa'}
          </p>
          <p className="text-[11px] text-[#1DCBF7] font-bold mt-1">
            Support Client : 0596367219
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            S'inscrire
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom et Prénoms
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Jean-Luc Kouamé"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Numéro de Téléphone (Orange, MTN, Wave)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+225 07 XX XX XX XX"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                      role === 'user'
                        ? 'border-[#0F5D2E] bg-emerald-50 text-[#0F5D2E] font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Acheteur
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`py-2 px-3 rounded-xl border text-center font-medium transition ${
                      role === 'vendor'
                        ? 'border-[#0F5D2E] bg-emerald-50 text-[#0F5D2E] font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Vendeur / Commerçant
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Adresse Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@domaine.ci"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Login Test Accounts for Evaluation */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5 text-center">
            Comptes de test rapides
          </p>

          <div className="space-y-1.5 text-xs">
            <button
              type="button"
              onClick={quickLoginAsAdmin}
              className="w-full py-2 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span>Admin : admin@daloamarket.ci</span>
              </div>
              <span className="text-[10px] bg-red-200/80 px-2 py-0.5 rounded">1-Clic</span>
            </button>

            <button
              type="button"
              onClick={() => fillQuickAccount('kone.boutique@daloamarket.ci', 'Admin123!')}
              className="w-full py-1.5 px-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-left transition text-[11px]"
            >
              <span>Vendeur : Boutique Koné (Grand Marché)</span>
              <span className="text-gray-400">Remplir</span>
            </button>

            <button
              type="button"
              onClick={() => fillQuickAccount('traore.jean@gmail.com', 'Admin123!')}
              className="w-full py-1.5 px-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-left transition text-[11px]"
            >
              <span>Client : Jean Traoré (Tazibouo)</span>
              <span className="text-gray-400">Remplir</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
