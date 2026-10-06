import React from 'react';
import { Wine, Cake, Receipt, X } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

interface PostServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseDesserts: () => void;
  onChooseBill: () => void;
}

export const PostServiceModal: React.FC<PostServiceModalProps> = ({
  isOpen,
  onClose,
  onChooseDesserts,
  onChooseBill,
}) => {
  const { selectedTable } = useRestaurant();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0f131d] border border-amber-500/30 p-6 sm:p-8 text-stone-100 shadow-2xl overflow-hidden text-center">
        {/* Glow corner */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Festive Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-600/30 border border-amber-500/40 mx-auto flex items-center justify-center text-3xl shadow-inner mb-4">
          🍷
        </div>

        <h2 className="text-2xl font-bold font-serif-luxury text-amber-200">
          Plats servis à votre table !
        </h2>
        <p className="text-base font-serif-luxury italic text-stone-300 mt-1">
          Bon appétit et délicieuse dégustation.
        </p>
        <p className="text-xs text-stone-400 mt-2 max-w-[280px] mx-auto">
          Toute la brigade de l’Ambroisie Royale se tient à votre entière disposition à la table {selectedTable}.
        </p>

        {/* Choices A & B */}
        <div className="mt-8 space-y-3">
          {/* Choix A : Desserts / Café Gourmand */}
          <button
            type="button"
            onClick={onChooseDesserts}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-[#182030] to-[#121622] hover:from-amber-500/20 hover:to-amber-600/20 border border-stone-800 hover:border-amber-500/50 text-left transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-100 group-hover:text-amber-300 block">
                  Commander un dessert ou café
                </span>
                <span className="text-[11px] text-stone-400">
                  Découvrez la Haute Pâtisserie & Café Gourmand
                </span>
              </div>
            </div>
            <span className="text-lg text-amber-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>

          {/* Choix B : Régler l'addition */}
          <button
            type="button"
            onClick={onChooseBill}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-left transition-all group flex items-center justify-between shadow-[0_4px_20px_rgba(245,158,11,0.4)] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-950/20 flex items-center justify-center text-stone-950 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-stone-950 block">
                  Régler l’Addition
                </span>
                <span className="text-[11px] text-stone-900 font-medium">
                  Pourboire, partage de note ou appel TPE
                </span>
              </div>
            </div>
            <span className="text-lg font-bold text-stone-950 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
