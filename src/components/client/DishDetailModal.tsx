import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Check, Flame, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Dish, CookingPreference, DishAddon } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';
import { EU_ALLERGENS } from '../../data/menuData';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onAddedWithFly?: (e: React.MouseEvent, dish: Dish) => void;
}

const COOKING_LABELS: Record<CookingPreference, { name: string; desc: string }> = {
  bleu: { name: 'Bleu', desc: 'Très vif' },
  saignant: { name: 'Saignant', desc: 'Chaud à cœur' },
  a_point: { name: 'À point', desc: 'Rosé tendre' },
  bien_cuit: { name: 'Bien cuit', desc: 'Cuit à cœur' },
};

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onAddedWithFly }) => {
  const { addToCart } = useRestaurant();

  const [quantity, setQuantity] = useState(1);
  const [cooking, setCooking] = useState<CookingPreference | undefined>(
    dish?.requiresCooking ? (dish.availableCooking ? dish.availableCooking[0] : 'saignant') : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<DishAddon[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!dish) return null;

  const handleAddonToggle = (addon: DishAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = dish.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = (e: React.MouseEvent) => {
    if (dish.requiresCooking && !cooking) {
      setErrorMsg('Veuillez sélectionner la cuisson.');
      return;
    }

    addToCart({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      cookingPreference: cooking,
      selectedAddons,
      specialInstructions: specialNotes.trim(),
      image: dish.image,
    });

    if (onAddedWithFly) {
      onAddedWithFly(e, dish);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 70, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white dark:bg-[#1c1c1e] text-black dark:text-white shadow-2xl border border-stone-200 dark:border-[#2c2c2e]"
        >
          {/* iOS Grabber on Mobile */}
          <div className="w-10 h-1 bg-stone-300 dark:bg-stone-600 rounded-full mx-auto my-2.5 sm:hidden" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 text-stone-400 hover:text-white rounded-full bg-black/60 backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero Photo with iOS rounded frame */}
          <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-black">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#ff9f0a] block">
                Menu
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mt-0.5">
                {dish.name}
              </h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Header Menu Tag */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-[#2c2c2e]">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Menu • Sélection du Chef
              </span>
              <span className="text-base font-black text-[#ff9f0a] dark:text-[#ffd60a]">
                {unitPrice.toFixed(2)} €
              </span>
            </div>

            {/* Cuisson (Viandes / Burgers) */}
            {dish.requiresCooking && (
              <div className="rounded-2xl p-3 bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#ff9f0a]" />
                    <span>Cuisson</span>
                  </label>
                  <span className="text-[9px] text-[#ff9f0a] font-bold px-1.5 py-0.5 rounded-full bg-[#ff9f0a]/15">
                    Requis
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {((dish.availableCooking || ['bleu', 'saignant', 'a_point', 'bien_cuit']) as CookingPreference[]).map(
                    (cKey) => {
                      const isSelected = cooking === cKey;
                      const meta = COOKING_LABELS[cKey];
                      return (
                        <motion.button
                          key={cKey}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setCooking(cKey);
                            setErrorMsg('');
                          }}
                          className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-black text-white dark:bg-white dark:text-black font-extrabold border-transparent shadow-sm'
                              : 'bg-white dark:bg-[#1c1c1e] border-stone-200 dark:border-[#3a3a3c] text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{meta.name}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className="text-[9px] opacity-70 block mt-0.5">
                            {meta.desc}
                          </span>
                        </motion.button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* Suppléments */}
            {dish.addons && dish.addons.length > 0 && (
              <div className="rounded-2xl p-3 bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <label className="text-xs font-bold uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff9f0a]" />
                  <span>Suppléments</span>
                </label>

                <div className="space-y-1.5">
                  {dish.addons.map((addon) => {
                    const isChecked = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <motion.button
                        key={addon.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddonToggle(addon)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all text-left cursor-pointer ${
                          isChecked
                            ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-transparent'
                            : 'bg-white dark:bg-[#1c1c1e] border-stone-200 dark:border-[#3a3a3c] text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isChecked
                                ? 'bg-[#ff9f0a] border-[#ff9f0a] text-black'
                                : 'border-stone-400'
                            }`}
                          >
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs">{addon.name}</span>
                        </div>
                        <span className="text-xs font-extrabold whitespace-nowrap">
                          +{addon.price.toFixed(2)} €
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Allergènes */}
            <div className="rounded-2xl p-3 bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#ff9f0a]" />
                <span>Allergènes</span>
              </div>

              {dish.allergens.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {dish.allergens.map((allg) => (
                    <span
                      key={allg}
                      className="px-2 py-0.5 rounded-full bg-white dark:bg-[#1c1c1e] text-stone-700 dark:text-stone-300 text-[10px] font-semibold border border-stone-200 dark:border-[#3a3a3c]"
                    >
                      {allg}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-stone-500">Sans allergènes majeurs.</p>
              )}
            </div>

            {/* Instructions */}
            <div className="rounded-2xl p-3 bg-[#f2f2f7] dark:bg-[#2c2c2e]">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#ff9f0a]" />
                <span>Instructions</span>
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Ex: Sans sel, sauce à part..."
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-[#1c1c1e] border border-stone-200 dark:border-[#3a3a3c] text-black dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#ff9f0a]"
              />
            </div>

            {errorMsg && (
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs text-center font-bold">
                {errorMsg}
              </div>
            )}

            {/* Bottom Action: Quantité & Bouton Ajouter */}
            <div className="pt-1 flex items-center justify-between gap-2.5">
              {/* Quantity */}
              <div className="flex items-center gap-1 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#1c1c1e] text-black dark:text-white shadow-sm cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-bold text-black dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#1c1c1e] text-black dark:text-white shadow-sm cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Add Button */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-black text-xs shadow-md flex items-center justify-between cursor-pointer"
              >
                <span>Ajouter</span>
                <span>{totalPrice.toFixed(2)} €</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
