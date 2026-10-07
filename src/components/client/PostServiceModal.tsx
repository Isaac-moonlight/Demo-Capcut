import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Receipt, X } from 'lucide-react';
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-[#1c1c1e] border border-stone-200 dark:border-[#2c2c2e] p-5 text-black dark:text-white shadow-2xl overflow-hidden text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-stone-400 hover:text-black dark:hover:text-white rounded-full bg-stone-100 dark:bg-[#2c2c2e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#ff9f0a]/20 mx-auto flex items-center justify-center text-2xl mb-2.5">
            🍷
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            Menu servi à votre table !
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Bonne dégustation à la table {selectedTable}.
          </p>

          {/* Choices A & B */}
          <div className="mt-5 space-y-2">
            {/* Choix A : Desserts */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onChooseDesserts}
              className="w-full p-3 rounded-2xl bg-[#f2f2f7] dark:bg-[#2c2c2e] hover:bg-stone-200 dark:hover:bg-[#3a3a3c] text-left transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#ff9f0a]/20 flex items-center justify-center text-[#ff9f0a]">
                  <Cake className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">
                    Menu Desserts & Cafés
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">
                    Pâtisserie et café gourmand
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-stone-400">→</span>
            </motion.button>

            {/* Choix B : Régler l'addition */}
            <motion.button
              type="button"
              data-tour="post-service-bill-btn"
              whileTap={{ scale: 0.96 }}
              onClick={onChooseBill}
              className="w-full p-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-left transition-all flex items-center justify-between shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black block">
                    Régler l’Addition
                  </span>
                  <span className="text-[10px] opacity-80">
                    Pourboire, partage ou TPE
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold">→</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
