import React, { useState } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Clock, 
  CheckCircle, 
  Image as ImageIcon, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ProductCategory } from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface SellPageProps {
  onNavigate: (view: string, param?: string) => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onNavigate }) => {
  const { currentUser, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Électronique');
  const [stock, setStock] = useState('1');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const categories: ProductCategory[] = [
    'Électronique',
    'Mode',
    'Alimentation',
    'Maison',
    'Véhicules',
    'Services',
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const file = files[0];
      const imageUrl = await DaloaService.uploadProductImage(file);
      setImages((prev) => [...prev, imageUrl]);
      showToast('Photo ajoutée avec succès !', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du téléversement de la photo.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Veuillez vous connecter pour publier une annonce.', 'error');
      onNavigate('login');
      return;
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);

    if (isNaN(numPrice) || numPrice < 0) {
      showToast('Veuillez entrer un prix valide en FCFA.', 'error');
      return;
    }

    setUploading(true);
    try {
      const { product, error } = await DaloaService.createProduct({
        user_id: currentUser.id,
        name,
        description,
        price: numPrice,
        category,
        image_url: images,
        stock: isNaN(numStock) ? 1 : numStock,
        isAdmin,
      });

      if (error || !product) {
        showToast(error || 'Erreur lors de la création du produit.', 'error');
        return;
      }

      setSubmittedSuccess(true);
      showToast(
        isAdmin 
          ? 'Produit approuvé et publié directement (Mode Admin) !' 
          : 'Produit enregistré ! En attente d\'approbation admin.',
        'success'
      );
    } catch (err) {
      console.error(err);
      showToast('Une erreur est survenue.', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#FF6B00] flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Connexion Requise
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Pour vendre un article sur DALOA MARKET et recevoir les commandes des clients, vous devez vous connecter ou créer un compte vendeur gratuit.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-bold text-xs rounded-xl transition"
            >
              Se connecter
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
            >
              Créer un compte vendeur
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submittedSuccess) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-emerald-100 p-8 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#0F5D2E] flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            {isAdmin ? 'Article mis en ligne avec succès !' : 'En attente d\'approbation admin'}
          </h2>
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            {isAdmin 
              ? 'En tant qu\'administrateur, votre article est immédiatement visible sur la page d\'accueil.'
              : 'Votre article a été transmis à l\'équipe de DALOA MARKET. Il sera validé et visible dans les minutes qui suivent après contrôle de conformité.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setName('');
                setDescription('');
                setPrice('');
                setImages([]);
              }}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl"
            >
              Publier un autre article
            </button>
            <button
              onClick={() => onNavigate(isAdmin ? 'admin' : 'home')}
              className="flex-1 py-2.5 bg-[#0F5D2E] hover:bg-[#0c4723] text-white font-bold text-xs rounded-xl"
            >
              {isAdmin ? 'Voir dans l\'Admin Panel' : 'Retour à l\'accueil'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            Vendre un produit à Daloa
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Remplissez les informations ci-dessous. Publication gratuite en quelques clics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nom du produit */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Nom de l'article *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Moto Haojue 110cc, Complet Bazin 3 pièces, Sac de Riz 50kg..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
            />
          </div>

          {/* Catégorie & Prix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] outline-hidden bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Prix en FCFA *
              </label>
              <input
                type="number"
                required
                min="0"
                step="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ex: 25000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Quantité en stock *
            </label>
            <input
              type="number"
              min="1"
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full sm:w-1/2 px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] outline-hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Description détaillée
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Précisez l'état (neuf / occasion), les caractéristiques, la couleur, le quartier où récupérer..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 outline-hidden"
            />
          </div>

          {/* Photos Upload (Supabase storage bucket 'product-images') */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Photos du produit (Bucket Supabase 'product-images')
            </label>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-90 hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload trigger button */}
              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF6B00] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition bg-gray-50 hover:bg-orange-50/50">
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-[10px] text-gray-500 font-medium">Ajouter photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {images.length === 0 && (
              <p className="text-[11px] text-gray-400 italic">
                * Si vous n'avez pas de photo immédiate, une image d'illustration sera générée automatiquement.
              </p>
            )}
          </div>

          {/* Submission Notice */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-[#0F5D2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Processus de vérification Daloa Market</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Chaque article est soumis avec le statut <code>status='pending'</code> pour modération par l'équipe avant d'apparaître sur la page publique.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{uploading ? 'Enregistrement en cours...' : 'Publier mon article'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
